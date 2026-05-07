import { Building2 } from "lucide-react";
import { AgencyDetailsCard } from "@/components/AgencyDetailsCard";
import { AgencyCodesSection } from "@/components/AgencyCodesSection";

export default function AgencyManager() {
  return (
    <div className="p-4 md:p-6 flex flex-col gap-6" style={{ direction: "rtl" }}>
      <div className="flex items-center gap-2">
        <Building2 className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">ניהול סוכנות</h1>
      </div>
      <AgencyDetailsCard />
      <AgencyCodesSection />
    </div>
  );
}