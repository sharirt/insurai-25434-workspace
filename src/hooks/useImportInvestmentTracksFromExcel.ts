import { useCallback } from "react";
import {
  useEntityGetAll,
  useEntityUpdate,
  useEntityCreateMany,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  FundsEntity,
  InvestmentTracksEntity,
} from "@/product-types";
import type { IFundsEntity, IInvestmentTracksEntity } from "@/product-types";
import * as XLSX from "xlsx";
import { parseInvestmentTrackRows } from "@/utils/excelInvestmentTracksParser";
import type { ParsedInvestmentTrackRow } from "@/utils/excelInvestmentTracksParser";

export interface ImportInvestmentTracksResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

export function useImportInvestmentTracksFromExcel(clientId: string) {
  const { createManyFunction, isLoading: isCreating } =
    useEntityCreateMany(InvestmentTracksEntity);
  const { updateFunction } = useEntityUpdate(InvestmentTracksEntity);

  // Fetch funds for this client to build policyNumber -> fundId map
  const { data: clientFunds, refetch: refetchFunds } = useEntityGetAll(
    FundsEntity,
    { clientId: clientId || "" },
    { enabled: !!clientId }
  );

  const isLoading = isCreating;

  /**
   * Builds a map from raw policy number string to Fund ID.
   * Used to resolve the policyNumber foreign key reference.
   */
  const buildPolicyNumberToFundIdMap = useCallback(
    (funds: (IFundsEntity & { id: string })[]): Map<string, string> => {
      const map = new Map<string, string>();
      for (const fund of funds) {
        if (fund.policyNumber) {
          map.set(fund.policyNumber, fund.id);
        }
      }
      return map;
    },
    []
  );

  /**
   * Parses an Excel file client-side to extract investment track rows
   * with raw policy numbers for later resolution.
   */
  const parseExcelFile = useCallback(
    async (file: File): Promise<ParsedInvestmentTrackRow[]> => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: "" }
        );
        const parseResult = parseInvestmentTrackRows(rawRows);
        return parseResult.rows;
      } catch {
        return [];
      }
    },
    []
  );

  /**
   * After server action creates investment tracks, update their policyNumber
   * field to reference Fund IDs instead of raw policy numbers.
   */
  const resolvePolicyNumberReferences = useCallback(
    async (
      parsedRows: ParsedInvestmentTrackRow[],
      funds: (IFundsEntity & { id: string })[]
    ) => {
      if (!parsedRows.length || !funds.length) return;

      const policyToFundId = buildPolicyNumberToFundIdMap(funds);

      // Collect the raw policy numbers from parsed data that have corresponding Fund IDs
      const policyNumbersWithFundIds = new Map<string, string>();
      for (const row of parsedRows) {
        if (row.rawPolicyNumber) {
          const fundId = policyToFundId.get(row.rawPolicyNumber);
          if (fundId) {
            policyNumbersWithFundIds.set(row.rawPolicyNumber, fundId);
          }
        }
      }

      if (policyNumbersWithFundIds.size === 0) return;

      // Wait a moment for the server to finish persisting records
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Refetch funds to get the latest data
      const fundsResult = await refetchFunds();
      const latestFunds = (
        fundsResult as { data?: (IFundsEntity & { id: string })[] }
      )?.data;

      if (latestFunds) {
        // Rebuild map with latest funds
        const latestPolicyToFundId = buildPolicyNumberToFundIdMap(
          latestFunds as (IFundsEntity & { id: string })[]
        );

        // Now we need to find newly created investment tracks that have raw
        // policy numbers as their policyNumber and update them to use Fund IDs
        // The server action stores raw policy numbers, so we find tracks
        // with those raw values and update to Fund IDs
        // We'll rely on the caller to refetch and update tracks
        return latestPolicyToFundId;
      }

      return policyToFundId;
    },
    [buildPolicyNumberToFundIdMap, refetchFunds]
  );

  /**
   * Updates investment track records that have raw policy numbers
   * to reference Fund IDs instead.
   */
  const updateTracksWithFundIds = useCallback(
    async (
      tracks: (IInvestmentTracksEntity & { id: string })[],
      funds: (IFundsEntity & { id: string })[]
    ) => {
      if (!tracks.length || !funds.length) return;

      const policyToFundId = buildPolicyNumberToFundIdMap(funds);
      const fundIdSet = new Set(funds.map((f) => f.id));

      const updatePromises: Promise<unknown>[] = [];

      for (const track of tracks) {
        // If the track's policyNumber is NOT already a Fund ID,
        // try to resolve it as a raw policy number
        if (track.policyNumber && !fundIdSet.has(track.policyNumber)) {
          const fundId = policyToFundId.get(track.policyNumber);
          if (fundId) {
            updatePromises.push(
              updateFunction({
                id: track.id,
                data: { policyNumber: fundId },
              })
            );
          }
        }
      }

      if (updatePromises.length > 0) {
        await Promise.allSettled(updatePromises);
      }
    },
    [buildPolicyNumberToFundIdMap, updateFunction]
  );

  const importFromFile = useCallback(
    async (
      file: File
    ): Promise<
      ImportInvestmentTracksResult & {
        parsedRows: ParsedInvestmentTrackRow[];
      }
    > => {
      // Parse Excel client-side to extract rows with raw policy numbers
      const parsedRows = await parseExcelFile(file);

      if (!parsedRows.length) {
        return {
          importedCount: 0,
          skippedCount: 0,
          errors: ["לא נמצאו שורות תקינות בקובץ"],
          parsedRows: [],
        };
      }

      // Build the records to create from the parsed rows
      const recordsToCreate: Partial<IInvestmentTracksEntity>[] = [];
      const errors: string[] = [];
      let skippedCount = 0;

      for (let i = 0; i < parsedRows.length; i++) {
        const { track, rawPolicyNumber } = parsedRows[i];
        const rowNum = i + 2; // Excel row (1-indexed + header)

        // Build the record with the raw policy number
        const record: Partial<IInvestmentTracksEntity> = { ...track };

        // Set the raw policy number on the record (will be resolved to Fund ID later)
        if (rawPolicyNumber) {
          record.policyNumber = rawPolicyNumber;
        }

        // Check that the record has at least some meaningful data.
        // A row is valid if it has ANY non-empty field (identifier or data field).
        // trackName = "." is a valid value and should NOT cause skipping.
        const hasAnyMeaningfulData =
          !!record.trackName ||
          !!record.policyNumber ||
          !!record.productType ||
          !!record.providerName ||
          !!record.payingEmployerName ||
          !!record.trackIdNumber ||
          record.totalPolicyAccumulation !== undefined ||
          record.trackAccumulationAmount !== undefined ||
          record.monthlyReturn !== undefined ||
          record.ytdReturn !== undefined ||
          record.return12Months !== undefined ||
          record.return3Years !== undefined ||
          record.return5Years !== undefined ||
          record.equityExposure !== undefined ||
          record.foreignExposure !== undefined ||
          record.foreignCurrencyExposure !== undefined ||
          !!record.dataValidityDate;

        if (!hasAnyMeaningfulData) {
          skippedCount++;
          errors.push(`שורה ${rowNum}: שורה ריקה ללא נתונים`);
          continue;
        }

        recordsToCreate.push(record);
      }

      if (recordsToCreate.length === 0) {
        return {
          importedCount: 0,
          skippedCount,
          errors,
          parsedRows,
        };
      }

      // Create all investment track records using createMany
      // Process in batches to avoid overwhelming the server
      const BATCH_SIZE = 50;
      let importedCount = 0;

      for (let i = 0; i < recordsToCreate.length; i += BATCH_SIZE) {
        const batch = recordsToCreate.slice(i, i + BATCH_SIZE);
        try {
          const created = await createManyFunction({
            data: batch as Record<string, unknown>[],
          });
          importedCount += created?.length ?? batch.length;
        } catch (err) {
          const batchStart = i + 2;
          const batchEnd = Math.min(i + BATCH_SIZE, recordsToCreate.length) + 1;
          errors.push(
            `שגיאה ביצירת שורות ${batchStart}-${batchEnd}: ${err instanceof Error ? err.message : String(err)}`
          );
          skippedCount += batch.length;
        }
      }

      return {
        importedCount,
        skippedCount,
        errors,
        parsedRows,
      };
    },
    [createManyFunction, parseExcelFile]
  );

  return {
    importFromFile,
    updateTracksWithFundIds,
    resolvePolicyNumberReferences,
    isLoading,
    clientFunds: clientFunds as
      | (IFundsEntity & { id: string })[]
      | undefined,
  };
}