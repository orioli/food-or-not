import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Label } from "recharts";

interface ResultsScreenProps {
  totalComparisons: number;
  correctAnswers: number;
  score: number;
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
}

export const ResultsScreen = ({ totalComparisons, correctAnswers, score, comparisons }: ResultsScreenProps) => {
  // Generate Gaussian/Binomial distribution data
  // For binomial: mean = n*p, std = sqrt(n*p*(1-p)) where p=0.5 for random guessing
  const n = totalComparisons;
  const mean = n / 2;
  const std = Math.sqrt(n * 0.5 * 0.5);
  
  // Generate bell curve data points
  const generateGaussianData = () => {
    const data = [];
    for (let x = 0; x <= n; x++) {
      // Gaussian probability density function
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(std, 2));
      const y = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      data.push({ x, y: y * 100 }); // Scale for better visualization
    }
    return data;
  };

  const data = generateGaussianData();
  const accuracy = totalComparisons > 0 ? Math.round((correctAnswers / totalComparisons) * 100) : 0;

  const downloadData = () => {
    // Create CSV content
    const headers = ["Trial", "Food 1", "Sugar %", "Food 2", "Sugar %", "Your Choice", "Correct?", "Timestamp"];
    const csvRows = [headers.join(",")];
    
    comparisons.forEach((comp, index) => {
      const row = [
        index + 1,
        `"${comp.winnerName}"`,
        comp.winnerSugar,
        `"${comp.loserName}"`,
        comp.loserSugar,
        `"${comp.winnerName}"`,
        comp.isCorrect ? "Correct" : "Incorrect",
        comp.timestamp.toISOString()
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sugar-test-results-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
        All Done! 🎉
      </h2>
      
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl w-full">
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-500">{correctAnswers}</div>
          <div className="text-sm text-muted-foreground mt-1">Correct</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-500">{totalComparisons - correctAnswers}</div>
          <div className="text-sm text-muted-foreground mt-1">Incorrect</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-primary">{accuracy}%</div>
          <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
        </Card>
      </div>

      <Card className="p-8 max-w-4xl w-full mt-8">
        <h3 className="text-2xl font-semibold mb-6">Your Performance Distribution</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This curve shows the expected distribution for random guessing. Your score is marked with "YOU".
        </p>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="x" 
              stroke="hsl(var(--foreground))"
              label={{ value: 'Number of Correct Answers', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }}
            />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={false}
            />
            <ReferenceLine 
              x={correctAnswers} 
              stroke="hsl(var(--destructive))" 
              strokeWidth={3}
              strokeDasharray="3 3"
            >
              <Label 
                value="YOU" 
                position="top" 
                fill="hsl(var(--destructive))"
                fontSize={16}
                fontWeight="bold"
              />
            </ReferenceLine>
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            {correctAnswers < mean - std && "You scored below the random guessing average. The foods might be trickier than they appear!"}
            {correctAnswers >= mean - std && correctAnswers <= mean + std && "You scored around the random guessing average. These sugar comparisons are challenging!"}
            {correctAnswers > mean + std && "You scored above the random guessing average. You have a good sense of sugar content!"}
          </p>
        </div>
      </Card>

      <div className="mt-8">
        <Button 
          onClick={downloadData}
          className="mb-4 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          Download Your Data
        </Button>
        
        <p className="text-muted-foreground mb-3">
          Thank you for helping us understand food perceptions!
        </p>
        <p className="text-lg font-semibold text-foreground">
          {correctAnswers < 7 && "You underperform a random monkey playing the game"}
          {correctAnswers >= 7 && correctAnswers <= 11 && "Slightly better than a teenager"}
          {correctAnswers > 11 && "On par with nutritionist knowledge"}
        </p>
      </div>
    </div>
  );
};
