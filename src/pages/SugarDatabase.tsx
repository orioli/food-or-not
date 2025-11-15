import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import prego from "@/assets/8_prego.jpeg";
import noosa from "@/assets/16_noosa.jpeg";
import quakerMedleys from "@/assets/26_quaker_medleys.jpeg";
import clifBar from "@/assets/31_clif_bar.jpeg";
import kitKat from "@/assets/50_kit_kat.jpeg";
import honeySmacks from "@/assets/59_honey_smacks.jpeg";

interface FoodItem {
  id: string;
  imageUrl: string;
  name: string;
  sugarPercentage: number;
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    imageUrl: prego,
    name: "Prego Sauce",
    sugarPercentage: 8
  },
  {
    id: "2",
    imageUrl: noosa,
    name: "Noosa Yogurt",
    sugarPercentage: 16
  },
  {
    id: "3",
    imageUrl: quakerMedleys,
    name: "Quaker Real Medleys",
    sugarPercentage: 26
  },
  {
    id: "4",
    imageUrl: clifBar,
    name: "Clif Bar",
    sugarPercentage: 31
  },
  {
    id: "5",
    imageUrl: kitKat,
    name: "Kit Kat",
    sugarPercentage: 50
  },
  {
    id: "6",
    imageUrl: honeySmacks,
    name: "Honey Smacks Cereal",
    sugarPercentage: 59
  },
];

const SugarDatabase = () => {
  const navigate = useNavigate();

  // Sort by sugar percentage
  const sortedFoods = [...FOOD_ITEMS].sort((a, b) => a.sugarPercentage - b.sugarPercentage);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Test
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Sugar Content Database
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete reference of sugar percentages in tested foods
          </p>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Food Name</TableHead>
                <TableHead className="text-right">Sugar Content (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFoods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell>
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{food.name}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-lg font-semibold text-primary">
                      {food.sugarPercentage}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Sugar content shown as percentage by weight</p>
        </div>
      </div>
    </div>
  );
};

export default SugarDatabase;
