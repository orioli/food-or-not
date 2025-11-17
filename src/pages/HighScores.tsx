import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HighScores = () => {
  const navigate = useNavigate();

  const highScores = [
    { rank: 1, name: "Ludoz", score: 100, flag: "🇪🇸" },
    { rank: 2, name: "Nalbo", score: 99, flag: "🇪🇸" },
    { rank: 3, name: "Matrix", score: 99, flag: "🇦🇺" },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 bg-gradient-primary bg-clip-text text-transparent tracking-wider">
            HIGH SCORES
          </h1>
          
          <div className="space-y-4 mb-8">
            {highScores.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-2 border-primary/20 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl font-bold text-primary w-8">
                    {entry.rank}
                  </span>
                  <span className="text-2xl font-mono font-bold text-foreground uppercase">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-mono font-bold text-primary">
                    {entry.score}
                  </span>
                  <span className="text-3xl">
                    {entry.flag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="font-bold"
            >
              Back to Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighScores;
