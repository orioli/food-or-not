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
  const [sessionId] = useState(() => crypto.randomUUID());
  const [foodPairs] = useState(() => generatePairs(FOOD_ITEMS));
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
