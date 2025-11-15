import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Label } from "recharts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ResultsScreenProps {
  totalComparisons: number;
  correctAnswers: number;
  score: number;
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
}

export const ResultsScreen = ({ totalComparisons, correctAnswers, score, sessionId, comparisons }: ResultsScreenProps) => {
  const navigate = useNavigate();
  const accuracy = totalComparisons > 0 ? Math.round((correctAnswers / totalComparisons) * 100) : 0;

  // Record session data when component mounts
  useEffect(() => {
    const recordSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/record-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            sessionId,
            totalComparisons,
            correctAnswers,
            accuracy,
            comparisons: comparisons.map(comp => ({
              winnerName: comp.winnerName,
              winnerSugar: comp.winnerSugar,
              loserName: comp.loserName,
              loserSugar: comp.loserSugar,
              isCorrect: comp.isCorrect,
              timestamp: comp.timestamp.toISOString(),
            })),
          }),
        });

        if (response.ok) {
          console.log('Session data recorded successfully');
        } else {
          console.error('Error recording session:', await response.text());
        }
      } catch (error) {
        console.error('Error recording session:', error);
      }
    };

    recordSession();
  }, [sessionId, totalComparisons, correctAnswers, accuracy, comparisons]);
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

  const challengeFriend = () => {
    const shareText = `I scored ${correctAnswers}/${totalComparisons} (${accuracy}%) on the Sugar Perception Test! Can you beat my score?`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: "Sugar Perception Test Challenge",
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        // Fallback to copying link
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("Challenge link copied to clipboard!");
    }
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
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Button 
            onClick={downloadData}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            Download Your Data
          </Button>
          <Button 
            onClick={challengeFriend}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            Challenge a Friend
          </Button>
          <Button 
            onClick={() => navigate("/database")}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            size="lg"
          >
            See Sugar Database
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-1">
          Thank you for helping us understand food perceptions!
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          Contact: jose.berengueres@nu.edu.kz
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
