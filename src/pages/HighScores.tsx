import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HighScores = () => {
  const navigate = useNavigate();

  const highScores = [
    { rank: 1, name: "LUDOZ", score: 100, flag: "🇪🇸" },
    { rank: 2, name: "NALBO", score: 99, flag: "🇪🇸" },
    { rank: 3, name: "MATRIX", score: 99, flag: "🇦🇺" },
  ];

  return (
    <div className="min-h-screen crt-screen flex items-center justify-center p-4 font-pixel">
      <div className="w-full max-w-3xl relative z-10">
        {/* Arcade Cabinet Border Effect */}
        <div className="border-8 border-[#222] rounded-3xl p-1 bg-gradient-to-b from-[#444] to-[#111] shadow-2xl">
          <div className="border-4 border-[#333] rounded-2xl p-8 bg-black">
            
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl mb-4 retro-text blink tracking-wider">
                HIGH SCORES
              </h1>
              <div className="flex justify-center gap-4 text-lg retro-text-cyan">
                <span>*** TOP PLAYERS ***</span>
              </div>
            </div>
            
            {/* Score Table */}
            <div className="space-y-6 mb-12">
              {highScores.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center justify-between p-6 border-4 border-[#0f0] bg-black/50 relative"
                  style={{
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.1)'
                  }}
                >
                  {/* Rank */}
                  <div className="flex items-center gap-6 flex-1">
                    <span className="text-4xl md:text-5xl retro-text-yellow w-16 text-center">
                      {entry.rank}
                    </span>
                    
                    {/* Name */}
                    <span className="text-2xl md:text-3xl retro-text tracking-widest">
                      {entry.name}
                    </span>
                  </div>
                  
                  {/* Score and Flag */}
                  <div className="flex items-center gap-6">
                    <span className="text-3xl md:text-4xl retro-text font-bold tracking-wider">
                      {entry.score.toString().padStart(3, '0')}
                    </span>
                    <span className="text-4xl md:text-5xl filter brightness-150">
                      {entry.flag}
                    </span>
                  </div>
                  
                  {/* Scan line effect on each entry */}
                  <div className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.3) 2px, rgba(0, 255, 0, 0.3) 4px)'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center space-y-6">
              <div className="retro-text-cyan text-sm md:text-base tracking-wider">
                INSERT COIN TO CONTINUE
              </div>
              <Button
                onClick={() => navigate("/")}
                className="bg-transparent border-4 border-[#0f0] text-[#0f0] hover:bg-[#0f0] hover:text-black text-xl px-8 py-6 font-pixel transition-all duration-200"
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                }}
              >
                BACK
              </Button>
            </div>
          </div>
        </div>
        
        {/* Arcade "GAME OVER" style decoration */}
        <div className="text-center mt-8 retro-text-yellow text-xs tracking-widest opacity-50">
          © 1982 SUGAR ARCADE
        </div>
      </div>
    </div>
  );
};

export default HighScores;
