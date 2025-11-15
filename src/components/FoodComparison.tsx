import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FoodItem {
  id: string;
  imageUrl: string;
  name: string;
  sugarPercentage: number;
}

interface FoodComparisonProps {
  foodPairs: [FoodItem, FoodItem][];
  onChoice: (winnerId: string, loserId: string) => void;
}

export const FoodComparison = ({ foodPairs, onChoice }: FoodComparisonProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  if (currentIndex >= foodPairs.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          All Done! 🎉
        </h2>
        <p className="text-xl text-muted-foreground mb-2">
          You've completed {foodPairs.length} comparisons
        </p>
        <p className="text-muted-foreground">
          Thank you for helping us understand food perceptions!
        </p>
      </div>
    );
  }

  const [leftFood, rightFood] = foodPairs[currentIndex];

  const handleChoice = (side: 'left' | 'right') => {
    if (isAnimating) return;
    
    setSelectedSide(side);
    setIsAnimating(true);

    const winner = side === 'left' ? leftFood : rightFood;
    const loser = side === 'left' ? rightFood : leftFood;

    setTimeout(() => {
      onChoice(winner.id, loser.id);
      setCurrentIndex(prev => prev + 1);
      setSelectedSide(null);
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
          Which has less sugar?
        </h2>
        <p className="text-muted-foreground mb-4">
          Click on the food you think contains less sugar
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <span className="text-sm font-medium text-foreground">
            {currentIndex + 1} / {foodPairs.length}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <Card
          onClick={() => handleChoice('left')}
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all duration-300",
            "hover:shadow-hover hover:scale-[1.02] active:scale-[0.98]",
            "border-2",
            selectedSide === 'left' 
              ? "border-primary shadow-hover scale-[1.02]" 
              : selectedSide === 'right'
              ? "opacity-50 scale-95"
              : "border-border"
          )}
        >
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <img
              src={leftFood.imageUrl}
              alt={leftFood.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-4 text-center bg-card">
            <h3 className="text-lg font-semibold text-card-foreground">
              {leftFood.name}
            </h3>
          </div>
          {selectedSide === 'left' && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[2px]">
              <div className="text-6xl">✓</div>
            </div>
          )}
        </Card>

        <Card
          onClick={() => handleChoice('right')}
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all duration-300",
            "hover:shadow-hover hover:scale-[1.02] active:scale-[0.98]",
            "border-2",
            selectedSide === 'right' 
              ? "border-primary shadow-hover scale-[1.02]" 
              : selectedSide === 'left'
              ? "opacity-50 scale-95"
              : "border-border"
          )}
        >
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <img
              src={rightFood.imageUrl}
              alt={rightFood.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-4 text-center bg-card">
            <h3 className="text-lg font-semibold text-card-foreground">
              {rightFood.name}
            </h3>
          </div>
          {selectedSide === 'right' && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[2px]">
              <div className="text-6xl">✓</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
