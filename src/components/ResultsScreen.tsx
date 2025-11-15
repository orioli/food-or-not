import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Label } from "recharts";

interface ResultsScreenProps {
  totalComparisons: number;
  correctAnswers: number;
  score: number;
}

export const ResultsScreen = ({ totalComparisons, correctAnswers, score }: ResultsScreenProps) => {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
        All Done! 🎉
      </h2>
      <p className="text-xl text-muted-foreground mb-2">
        You've completed {totalComparisons} comparisons
      </p>
      
      <div className="grid grid-cols-3 gap-4 my-8 max-w-2xl w-full">
        <Card className="p-6">
          <div className="text-3xl font-bold text-green-500">{correctAnswers}</div>
          <div className="text-sm text-muted-foreground mt-1">Correct</div>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-red-500">{totalComparisons - correctAnswers}</div>
          <div className="text-sm text-muted-foreground mt-1">Incorrect</div>
        </Card>
        <Card className="p-6">
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

      <p className="text-muted-foreground mt-8">
        Thank you for helping us understand food perceptions!
      </p>
    </div>
  );
};
