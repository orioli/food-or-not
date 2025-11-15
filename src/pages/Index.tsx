import { useState, useEffect } from "react";
import { FoodComparison } from "@/components/FoodComparison";
import { toast } from "sonner";

import lindtChocolate from "@/assets/lindt-chocolate.jpg";
import kitkat from "@/assets/kitkat.jpg";
import kefir from "@/assets/kefir.jpg";
import activia from "@/assets/activia.jpg";
import blackBeans from "@/assets/black-beans.jpg";
import heinzBeanz from "@/assets/heinz-beanz.jpg";
import pregoSauce from "@/assets/prego-sauce.jpg";
import tomatoSauce from "@/assets/tomato-sauce.jpg";
import heinzKetchup from "@/assets/heinz-ketchup.jpg";

interface FoodItem {
  id: string;
  imageUrl: string;
  name: string;
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    imageUrl: lindtChocolate,
    name: "Lindt 90% Dark Chocolate"
  },
  {
    id: "2",
    imageUrl: kitkat,
    name: "Kit Kat"
  },
  {
    id: "3",
    imageUrl: kefir,
    name: "Kefir"
  },
  {
    id: "4",
    imageUrl: activia,
    name: "Activia Yogurt"
  },
  {
    id: "5",
    imageUrl: blackBeans,
    name: "Black Beans"
  },
  {
    id: "6",
    imageUrl: heinzBeanz,
    name: "Heinz Beanz"
  },
  {
    id: "7",
    imageUrl: pregoSauce,
    name: "Prego Sauce"
  },
  {
    id: "8",
    imageUrl: tomatoSauce,
    name: "Tomato Sauce"
  },
  {
    id: "9",
    imageUrl: heinzKetchup,
    name: "Heinz Ketchup"
  },
];

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
  // Shuffle the pairs
  return pairs.sort(() => Math.random() - 0.5);
};

const Index = () => {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [foodPairs] = useState(() => generatePairs(FOOD_ITEMS));
  const [comparisons, setComparisons] = useState<Array<{
    sessionId: string;
    winnerId: string;
    loserId: string;
    timestamp: Date;
  }>>([]);

  const handleChoice = (winnerId: string, loserId: string) => {
    const comparison = {
      sessionId,
      winnerId,
      loserId,
      timestamp: new Date(),
    };
    
    setComparisons(prev => [...prev, comparison]);
    
    // Here you would send this to your backend
    // For now, we'll just log it
    console.log('Comparison recorded:', comparison);
    
    // Show a subtle toast
    toast.success("Choice recorded!", {
      duration: 1500,
    });
  };

  useEffect(() => {
    console.log(`Session ${sessionId} started with ${foodPairs.length} comparisons`);
  }, [sessionId, foodPairs.length]);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Sugar Perception Test
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us understand how people perceive sugar content in different foods
          </p>
        </header>

        <FoodComparison 
          foodPairs={foodPairs}
          onChoice={handleChoice}
        />

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Anonymous session • No data is personally identifiable</p>
          <p className="mt-2">Comparisons made: {comparisons.length}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
