import { useState, useEffect } from "react";
import { FoodComparison } from "@/components/FoodComparison";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

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
  
  return foodData[country as keyof typeof foodData] || foodData.US;
};

// Fisher-Yates shuffle algorithm - properly shuffles array without corruption
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate all possible pairs
const generatePairs = (items: FoodItem[]): [FoodItem, FoodItem][] => {
  const pairs: [FoodItem, FoodItem][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      // Randomly decide which item goes first
      if (Math.random() > 0.5) {
        pairs.push([items[i], items[j]]);
      } else {
        pairs.push([items[j], items[i]]);
      }
    }
  }
  
  // Use Fisher-Yates shuffle instead of unreliable Array.sort()
  const shuffled = shuffleArray(pairs);
  
  // Validate: ensure no pair has the same item on both sides
  const validated = shuffled.filter(([left, right]) => {
    if (left.id === right.id) {
      console.error('❌ CRITICAL: Duplicate pair detected!', left.name);
      return false;
    }
    return true;
  });
  
  console.log('✅ Generated', validated.length, 'valid pairs');
  return validated;
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [country, setCountry] = useState(searchParams.get("country") || "AUSTRALIA");
  const [sessionId] = useState(() => crypto.randomUUID());
  const FOOD_ITEMS = getFoodItems(country);
  const [foodPairs, setFoodPairs] = useState(() => generatePairs(FOOD_ITEMS));
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [comparisons, setComparisons] = useState<Array<{
    sessionId: string;
    winnerId: string;
    loserId: string;
    winnerName: string;
    loserName: string;
    winnerSugar: number;
    loserSugar: number;
    timestamp: Date;
    isCorrect: boolean;
  }>>([]);

  // Regenerate food pairs when country changes
  useEffect(() => {
    const newFoodItems = getFoodItems(country);
    setFoodPairs(generatePairs(newFoodItems));
  }, [country]);

  const handleChoice = (winnerId: string, loserId: string, isCorrect: boolean) => {
    const winner = FOOD_ITEMS.find(item => item.id === winnerId);
    const loser = FOOD_ITEMS.find(item => item.id === loserId);
    
    if (!winner || !loser) return;
    
    const pointChange = isCorrect ? 1 : -1;
    
    setScore(prev => prev + pointChange);
    
    // Update correct/incorrect counters
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }
    
    const comparison = {
      sessionId,
      winnerId,
      loserId,
      winnerName: winner.name,
      loserName: loser.name,
      winnerSugar: winner.sugarPercentage,
      loserSugar: loser.sugarPercentage,
      timestamp: new Date(),
      isCorrect,
    };
    
    setComparisons(prev => [...prev, comparison]);
    
    console.log('Comparison recorded:', comparison);
  };

  // Preload all images at game start for instant transitions
  useEffect(() => {
    FOOD_ITEMS.forEach(item => {
      const img = new Image();
      img.src = item.imageUrl;
    });
  }, [country]);

  useEffect(() => {
    console.log(`Session ${sessionId} started with ${foodPairs.length} comparisons`);
  }, [sessionId, foodPairs.length]);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto py-4 md:py-12 px-0 md:px-4">
        <header className="text-center mb-6 md:mb-12 px-2 md:px-0">
          <h1 className="text-3xl md:text-6xl font-bold mb-2 md:mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Sugar Perception Test
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us (<a href="https://www.amazon.com/stores/Jose-Berengueres/author/B00LU2U7VE" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dr. Jose Berengueres et al.</a>) understand how people perceive sugar content in different foods.
          </p>
        </header>

        <FoodComparison 
          foodPairs={foodPairs}
          onChoice={handleChoice}
          correctAnswers={correctAnswers}
          score={score}
          completedComparisons={comparisons.length}
          sessionId={sessionId}
          comparisons={comparisons}
          country={country}
          onCountryChange={setCountry}
        />

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Anonymous session • No data is personally identifiable or being logged</p>
          <p className="mt-2">
            Comparisons made: {comparisons.length} | 
            Correct: {correctAnswers} | 
            Incorrect: {incorrectAnswers}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
