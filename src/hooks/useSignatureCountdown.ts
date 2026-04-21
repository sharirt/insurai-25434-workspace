import { useState, useEffect } from "react";
import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { SignatureRequestsEntity } from "@/product-types";

const EXPIRATION_HOURS = 72;

interface SignatureCountdownResult {
  hoursRemaining: number | null;
  isExpired: boolean;
  hasActiveRequests: boolean;
  label: string;
  variant: "secondary" | "destructive" | "warning";
}

export function useSignatureCountdown(meetingId: string): SignatureCountdownResult {
  const { data: signatureRequests } = useEntityGetAll(
    SignatureRequestsEntity,
    { meetingId },
    { enabled: !!meetingId }
  );

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Check if any signature request has "expired" status in DB
  const hasExpiredStatus = (signatureRequests || []).some((sr) => sr.status === "expired");
  if (hasExpiredStatus) {
    return { hoursRemaining: 0, isExpired: true, hasActiveRequests: true, label: "פג תוקף", variant: "destructive" };
  }

  const activeRequests = (signatureRequests || []).filter(
    (sr) => sr.status === "pending" || sr.status === "client_signed" || sr.status === "agent_signed"
  );

  if (activeRequests.length === 0) {
    return { hoursRemaining: null, isExpired: false, hasActiveRequests: false, label: "", variant: "secondary" };
  }

  // Find the latest sentAt among active requests
  let latestSentAt = 0;
  for (const sr of activeRequests) {
    if (sr.sentAt) {
      const t = new Date(sr.sentAt).getTime();
      if (t > latestSentAt) latestSentAt = t;
    }
  }

  if (latestSentAt === 0) {
    return { hoursRemaining: null, isExpired: false, hasActiveRequests: true, label: "", variant: "secondary" };
  }

  const expiresAt = latestSentAt + EXPIRATION_HOURS * 60 * 60 * 1000;
  const hoursRemaining = (expiresAt - now) / (1000 * 60 * 60);

  if (hoursRemaining <= 0) {
    return { hoursRemaining: 0, isExpired: true, hasActiveRequests: true, label: "פג תוקף", variant: "destructive" };
  }

  let label: string;
  if (hoursRemaining > 48) {
    const days = Math.floor(hoursRemaining / 24);
    label = `נותרו ${days} ימים`;
  } else if (hoursRemaining > 24) {
    label = "נותר יום אחד";
  } else {
    const hours = Math.floor(hoursRemaining);
    label = `נותרות ${hours} שעות`;
  }

  const variant = hoursRemaining <= 24 ? "warning" as const : "secondary" as const;

  return { hoursRemaining, isExpired: false, hasActiveRequests: true, label, variant };
}