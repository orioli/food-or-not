import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VisitCounter from "@/components/VisitCounter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import pregoUS from "@/assets/US/8_prego.jpeg";
import noosaUS from "@/assets/US/16_noosa.jpeg";
import quakerMedleysUS from "@/assets/US/26_quaker_medleys.jpeg";
import clifBarUS from "@/assets/US/31_clif_bar.jpeg";
import kitKatUS from "@/assets/US/50_kit_kat.jpeg";
import honeySmacksUS from "@/assets/US/59_honey_smacks.jpeg";

import vegemiteAU from "@/assets/AUSTRALIA/3_vegemite.png";
import weetabixAU from "@/assets/AUSTRALIA/4_Weetabix.png";
import colesYoghurtAU from "@/assets/AUSTRALIA/5_Coles_natural_yoghgurt.png";
import cheeriosAU from "@/assets/AUSTRALIA/15_Uncle_Tobys_Cheerios_Multigrain_Cereal.png";
import colesTomatoKetchupAU from "@/assets/AUSTRALIA/29_Coles_Tomato_Ketchup_487mL.png";
import timTamAU from "@/assets/AUSTRALIA/32_tim_tam.png";

import kottbullarSE from "@/assets/SWEDEN/2_kottbullar_vego.jpg";
import caesarSaladSE from "@/assets/SWEDEN/14_caesar_salad.jpg";
import yallaYogurtSE from "@/assets/SWEDEN/8_yalla_yogurt.jpg";
import festisOrangeSE from "@/assets/SWEDEN/7_festis_orange.jpg";
import mozzarellaBurgerSE from "@/assets/SWEDEN/17_mozzarella_burger.jpg";
import kanelbulleSE from "@/assets/SWEDEN/23_kanelbulle.jpg";
import xtraIceCreamSE from "@/assets/SWEDEN/25_xtra_ice_cream.png";

interface FoodItem {
  id: string;
  imageUrl: string;
  name: string;
  sugarPercentage: number;
}

const getFoodItems = (country: string): FoodItem[] => {
  const foodData = {
    US: [
      { id: "1", imageUrl: pregoUS, name: "Prego Sauce", sugarPercentage: 8 },
      { id: "2", imageUrl: noosaUS, name: "Noosa Yogurt", sugarPercentage: 16 },
      { id: "3", imageUrl: quakerMedleysUS, name: "Quaker Real Medleys", sugarPercentage: 26 },
      { id: "4", imageUrl: clifBarUS, name: "Clif Bar", sugarPercentage: 31 },
      { id: "5", imageUrl: kitKatUS, name: "Kit Kat", sugarPercentage: 50 },
      { id: "6", imageUrl: honeySmacksUS, name: "Honey Smacks Cereal", sugarPercentage: 59 },
    ],
    SWEDEN: [
      { id: "1", imageUrl: kottbullarSE, name: "Köttbullar Vego", sugarPercentage: 2 },
      { id: "2", imageUrl: yallaYogurtSE, name: "Yalla Yogurt", sugarPercentage: 8 },
      { id: "3", imageUrl: festisOrangeSE, name: "Festis Orange", sugarPercentage: 7 },
      { id: "4", imageUrl: caesarSaladSE, name: "Caesar Salad", sugarPercentage: 14 },
      { id: "5", imageUrl: mozzarellaBurgerSE, name: "Mighty Mozzarella Burger", sugarPercentage: 17 },
      { id: "6", imageUrl: kanelbulleSE, name: "Kanelbulle", sugarPercentage: 23 },
      { id: "7", imageUrl: xtraIceCreamSE, name: "Xtra Glasspinnar", sugarPercentage: 25 },
    ],
    AUSTRALIA: [
      { id: "1", imageUrl: vegemiteAU, name: "Vegemite", sugarPercentage: 3 },
      { id: "2", imageUrl: weetabixAU, name: "Weetabix Original", sugarPercentage: 4 },
      { id: "3", imageUrl: colesYoghurtAU, name: "Coles Greek Natural Yoghurt", sugarPercentage: 5 },
      { id: "4", imageUrl: cheeriosAU, name: "Uncle Tobys Cheerios", sugarPercentage: 15 },
      { id: "5", imageUrl: colesTomatoKetchupAU, name: "Coles Tomato Ketchup", sugarPercentage: 29 },
      { id: "6", imageUrl: timTamAU, name: "Tim Tam Original", sugarPercentage: 32 },
    ],
  };
  
  return foodData[country as keyof typeof foodData] || foodData.AUSTRALIA;
};

const SugarDatabase = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [country, setCountry] = useState(searchParams.get("country") || "AUSTRALIA");

  const FOOD_ITEMS = getFoodItems(country);
  const sortedFoods = [...FOOD_ITEMS].sort((a, b) => a.sugarPercentage - b.sugarPercentage);

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setSearchParams({ country: newCountry });
  };

  const countryNames = {
    US: "United States",
    SWEDEN: "Sweden",
    AUSTRALIA: "Australia"
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            onClick={() => navigate(`/?country=${country}`)}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Test
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Sugar Content Database
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Complete reference of sugar percentages in tested foods
          </p>

          {/* Country Selection */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={country === "US" ? "default" : "outline"}
              onClick={() => handleCountryChange("US")}
              className="text-2xl px-6 py-6"
            >
              🇺🇸 {countryNames.US}
            </Button>
            <Button
              variant={country === "SWEDEN" ? "default" : "outline"}
              onClick={() => handleCountryChange("SWEDEN")}
              className="text-2xl px-6 py-6"
            >
              🇸🇪 {countryNames.SWEDEN}
            </Button>
            <Button
              variant={country === "AUSTRALIA" ? "default" : "outline"}
              onClick={() => handleCountryChange("AUSTRALIA")}
              className="text-2xl px-6 py-6"
            >
              🇦🇺 {countryNames.AUSTRALIA}
            </Button>
          </div>
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
      <VisitCounter />
    </div>
  );
};

export default SugarDatabase;
