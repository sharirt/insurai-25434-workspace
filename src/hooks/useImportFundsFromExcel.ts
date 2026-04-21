import { useCallback } from "react";
import {
  useEntityUpdate,
  useEntityCreateMany,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FundsEntity } from "@/product-types";
import type { IFundsEntity } from "@/product-types";
import * as XLSX from "xlsx";
import { parseExcelRows } from "@/utils/excelFundsParser";

export interface ImportFundsResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

export interface ParsedProviderInfo {
  policyNumber: string;
  providerName: string;
}

export function useImportFundsFromExcel() {
  const { createManyFunction, isLoading: isCreating } =
    useEntityCreateMany(FundsEntity);
  const { updateFunction } = useEntityUpdate(FundsEntity);

  const isLoading = isCreating;

  /**
   * Parses an Excel file client-side to extract providerName values
   * mapped by policyNumber.
   */
  const parseProviderNames = useCallback(
    async (file: File): Promise<ParsedProviderInfo[]> => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet
        );
        const parseResult = parseExcelRows(rawRows);

        const results: ParsedProviderInfo[] = [];
        for (const row of parseResult.rows) {
          const policyNumber = row.fund.policyNumber;
          const providerName = row.fund.providerName;
          if (policyNumber && providerName) {
            results.push({ policyNumber, providerName });
          }
        }
        return results;
      } catch {
        return [];
      }
    },
    []
  );

  /**
   * Parses an Excel file and creates fund records directly via entity creation.
   */
  const importFromFile = useCallback(
    async (
      file: File,
      clientId: string
    ): Promise<ImportFundsResult & { parsedProviders: ParsedProviderInfo[] }> => {
      // Parse Excel client-side to extract fund data and providerName values
      const parsedProviders = await parseProviderNames(file);

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet
      );
      const parseResult = parseExcelRows(rawRows);

      if (!parseResult.rows.length) {
        return {
          importedCount: 0,
          skippedCount: 0,
          errors:
            parseResult.errors.length > 0
              ? parseResult.errors
              : ["לא נמצאו שורות תקינות בקובץ"],
          parsedProviders: [],
        };
      }

      // Build the records to create from the parsed rows
      const recordsToCreate: Partial<IFundsEntity & { clientId: string }>[] = [];
      const errors: string[] = [...parseResult.errors];
      let skippedCount = 0;

      for (let i = 0; i < parseResult.rows.length; i++) {
        const { fund } = parseResult.rows[i];
        const rowNum = i + 2; // Excel row (1-indexed + header)

        // Check that the record has at least some meaningful data
        const hasPolicyNumber = !!fund.policyNumber;
        const hasProductType = !!fund.productType;
        const hasPlanName = !!fund.planName;

        if (!hasPolicyNumber && !hasProductType && !hasPlanName) {
          skippedCount++;
          errors.push(
            `שורה ${rowNum}: חסרים נתונים מזהים (מספר פוליסה, סוג מוצר, או שם תוכנית)`
          );
          continue;
        }

        // Add clientId to each record
        recordsToCreate.push({
          ...fund,
          clientId,
        });
      }

      if (recordsToCreate.length === 0) {
        return {
          importedCount: 0,
          skippedCount,
          errors,
          parsedProviders,
        };
      }

      // Create all fund records using createMany
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
          const batchEnd =
            Math.min(i + BATCH_SIZE, recordsToCreate.length) + 1;
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
        parsedProviders,
      };
    },
    [createManyFunction, parseProviderNames]
  );

  /**
   * Updates funds that are missing providerName by matching on policyNumber.
   * Call this after the server action creates the funds and funds have been refetched.
   */
  const updateFundsWithProviderNames = useCallback(
    async (
      funds: (IFundsEntity & { id: string })[],
      parsedProviders: ParsedProviderInfo[]
    ) => {
      if (!parsedProviders.length || !funds.length) return;

      // Build a map of policyNumber -> providerName from parsed data
      const providerMap = new Map<string, string>();
      for (const item of parsedProviders) {
        providerMap.set(item.policyNumber, item.providerName);
      }

      // Find funds that are missing providerName and have a matching policyNumber
      const updatePromises: Promise<unknown>[] = [];
      for (const fund of funds) {
        if (!fund.providerName && fund.policyNumber) {
          const providerName = providerMap.get(fund.policyNumber);
          if (providerName) {
            updatePromises.push(
              updateFunction({
                id: fund.id,
                data: { providerName },
              })
            );
          }
        }
      }

      if (updatePromises.length > 0) {
        await Promise.allSettled(updatePromises);
      }
    },
    [updateFunction]
  );

  return { importFromFile, updateFundsWithProviderNames, isLoading };
}