import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FundTable } from "@/components/FundTable";
import type {
  IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject,
  IFetchMyGemelDataActionOutputAverageObject,
} from "@/product-types";

interface CategoryCardProps {
  category: string;
  funds: IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject[];
  average?: IFetchMyGemelDataActionOutputAverageObject;
}

export const CategoryCard = ({ category, funds, average }: CategoryCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{category}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <FundTable funds={funds} average={average} />
      </CardContent>
    </Card>
  );
};