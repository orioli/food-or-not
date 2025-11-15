import { useState, useEffect } from "react";
import { FoodComparison } from "@/components/FoodComparison";
import { toast } from "sonner";

interface FoodItem {
  id: string;
  imageUrl: string;
  name: string;
}

// Mock data - replace with your actual images
const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    name: "Fresh Salad"
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    name: "Burger & Fries"
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80",
    name: "Fruit Smoothie"
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
    name: "Donuts"
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    name: "Sushi"
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80",
    name: "Pizza"
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
