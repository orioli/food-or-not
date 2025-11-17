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
  onChoice: (winnerId: string, loserId: string, isCorrect: boolean) => void;
  correctAnswers: number;
  score: number;
  completedComparisons: number;
  sessionId: string;
  comparisons: Array<{
    sessionId: string;
    winnerId: string;
    loserId: string;
    winnerName: string;
    loserName: string;
    winnerSugar: number;
    loserSugar: number;
    timestamp: Date;
    isCorrect: boolean;
  }>;
  country: string;
  onCountryChange: (country: string) => void;
}

import { ResultsScreen } from "./ResultsScreen";

export const FoodComparison = ({ foodPairs, onChoice, correctAnswers, score, completedComparisons, sessionId, comparisons, country, onCountryChange }: FoodComparisonProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);

  if (currentIndex >= foodPairs.length) {
    return (
      <ResultsScreen 
        totalComparisons={completedComparisons}
        correctAnswers={correctAnswers}
        score={score}
        sessionId={sessionId}
        comparisons={comparisons}
        country={country}
      />
    );
  }

  const [leftFood, rightFood] = foodPairs[currentIndex];
  
  // CRITICAL VALIDATION: Prevent duplicate items on both sides
  if (leftFood.id === rightFood.id) {
    console.error('❌ DUPLICATE BUG DETECTED:', leftFood.name, 'appears on both sides!');
    // Skip to next comparison immediately
    setTimeout(() => setCurrentIndex(prev => prev + 1), 0);
    return null;
  }

  const handleChoice = (side: 'left' | 'right') => {
    if (isAnimating) return;
    
    setSelectedSide(side);
    setIsAnimating(true);

    const winner = side === 'left' ? leftFood : rightFood;
    const loser = side === 'left' ? rightFood : leftFood;
    
    // Check if correct
    const isCorrect = winner.sugarPercentage < loser.sugarPercentage;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      onChoice(winner.id, loser.id, isCorrect);
      setCurrentIndex(prev => prev + 1);
      setSelectedSide(null);
      setIsAnimating(false);
      setShowFeedback(null);
    }, 450);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-0 md:px-4">
      <div className="mb-4 md:mb-8 text-center px-2 md:px-0">
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => onCountryChange("US")}
            className={cn(
              "text-4xl md:text-5xl p-3 rounded-lg transition-all",
              country === "US" 
                ? "bg-primary/20 scale-110 ring-2 ring-primary" 
                : "hover:bg-muted opacity-60 hover:opacity-100"
            )}
            aria-label="Select United States"
          >
            🇺🇸
          </button>
          <button
            onClick={() => onCountryChange("SWEDEN")}
            className={cn(
              "text-4xl md:text-5xl p-3 rounded-lg transition-all",
              country === "SWEDEN" 
                ? "bg-primary/20 scale-110 ring-2 ring-primary" 
                : "hover:bg-muted opacity-60 hover:opacity-100"
            )}
            aria-label="Select Sweden"
          >
            🇸🇪
          </button>
          <button
            onClick={() => onCountryChange("AUSTRALIA")}
            className={cn(
              "text-4xl md:text-5xl p-3 rounded-lg transition-all",
              country === "AUSTRALIA" 
                ? "bg-primary/20 scale-110 ring-2 ring-primary" 
                : "hover:bg-muted opacity-60 hover:opacity-100"
            )}
            aria-label="Select Australia"
          >
            🇦🇺
          </button>
        </div>
        <h2 className="hidden md:block text-3xl md:text-4xl font-bold mb-3 text-foreground">
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

      <div className="grid grid-cols-2 gap-1 md:gap-8 relative">
        <Card
          onClick={() => handleChoice('left')}
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all duration-300",
            "hover:shadow-hover hover:scale-[1.02] active:scale-[0.98]",
            "border-2 rounded-none md:rounded-lg",
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
          <div className="p-1 md:p-4 text-center bg-card">
            <h3 className="text-xs md:text-lg font-semibold text-card-foreground">
              {leftFood.name}
            </h3>
          </div>
          {selectedSide !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 text-white text-3xl md:text-5xl font-bold px-6 py-3 rounded-lg">
                {leftFood.sugarPercentage}%
              </div>
            </div>
          )}
        </Card>

        {/* Feedback overlay between photos */}
        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-[20%] aspect-square bg-background/95 rounded-full flex items-center justify-center shadow-2xl border-4 border-primary animate-scale-in">
              <span className="text-5xl md:text-8xl">
                {showFeedback === 'correct' ? '✅' : '❌'}
              </span>
            </div>
          </div>
        )}

        <Card
          onClick={() => handleChoice('right')}
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all duration-300",
            "hover:shadow-hover hover:scale-[1.02] active:scale-[0.98]",
            "border-2 rounded-none md:rounded-lg",
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
          <div className="p-1 md:p-4 text-center bg-card">
            <h3 className="text-xs md:text-lg font-semibold text-card-foreground">
              {rightFood.name}
            </h3>
          </div>
          {selectedSide !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 text-white text-3xl md:text-5xl font-bold px-6 py-3 rounded-lg">
                {rightFood.sugarPercentage}%
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
