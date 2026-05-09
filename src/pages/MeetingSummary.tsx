import { useNavigate } from "react-router";
import { useEffect } from "react";
import { getPageUrl } from "@/lib/utils";
import { AgentDashboard2Page } from "@/product-types";

export default function MeetingSummary() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(getPageUrl(AgentDashboard2Page), { replace: true });
  }, [navigate]);

  return null;
}