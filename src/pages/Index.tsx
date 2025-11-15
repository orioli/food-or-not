import { useState, useEffect } from "react";
import { FoodComparison } from "@/components/FoodComparison";
import { toast } from "sonner";

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
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    imageUrl: prego,
    name: "Prego Sauce (8% sugar)"
  },
  {
    id: "2",
    imageUrl: noosa,
    name: "Noosa Yogurt (16% sugar)"
  },
  {
    id: "3",
    imageUrl: quakerMedleys,
    name: "Quaker Real Medleys (26% sugar)"
  },
  {
    id: "4",
    imageUrl: clifBar,
    name: "Clif Bar (31% sugar)"
  },
  {
    id: "5",
    imageUrl: kitKat,
    name: "Kit Kat (50% sugar)"
  },
  {
    id: "6",
    imageUrl: honeySmacks,
    name: "Honey Smacks Cereal (59% sugar)"
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
