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
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [comparisons, setComparisons] = useState<Array<{
    sessionId: string;
    winnerId: string;
    loserId: string;
    timestamp: Date;
    isCorrect: boolean;
  }>>([]);

  const handleChoice = (winnerId: string, loserId: string) => {
    const winner = FOOD_ITEMS.find(item => item.id === winnerId);
    const loser = FOOD_ITEMS.find(item => item.id === loserId);
    
    if (!winner || !loser) return;
    
    // Check if the choice was correct (winner has less sugar than loser)
    const isCorrect = winner.sugarPercentage < loser.sugarPercentage;
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
      timestamp: new Date(),
      isCorrect,
    };
    
    setComparisons(prev => [...prev, comparison]);
    
    console.log('Comparison recorded:', comparison);
    
    // Show feedback toast
    if (isCorrect) {
      toast.success("Correct! +1 point", {
        duration: 1500,
      });
    } else {
      toast.error("Incorrect! -1 point", {
        duration: 1500,
      });
    }
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
          <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-2xl font-bold text-foreground">Score: {score}</span>
          </div>
        </header>

        <FoodComparison 
          foodPairs={foodPairs}
          onChoice={handleChoice}
        />

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Anonymous session • No data is personally identifiable</p>
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
