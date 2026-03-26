import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
  size?: number;
}

const RiskGauge = ({ score, size = 220 }: RiskGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 30) / 2;
  const circumference = Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const center = size / 2;

  const getColor = (s: number) => {
    if (s <= 30) return { class: "neon-text-green", stroke: "hsl(150, 100%, 45%)", glow: "var(--glow-green)" };
    if (s <= 65) return { class: "neon-text-yellow", stroke: "hsl(45, 100%, 55%)", glow: "var(--glow-yellow)" };
    return { class: "neon-text-red", stroke: "hsl(0, 85%, 55%)", glow: "var(--glow-red)" };
  };

  const color = getColor(animatedScore);
  const level = animatedScore <= 30 ? "LOW" : animatedScore <= 65 ? "MEDIUM" : "HIGH";

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {/* Background arc */}
        <path
          d={`M 15 ${center} A ${radius} ${radius} 0 0 1 ${size - 15} ${center}`}
          fill="none"
          stroke="hsl(0, 0%, 15%)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M 15 ${center} A ${radius} ${radius} 0 0 1 ${size - 15} ${center}`}
          fill="none"
          stroke={color.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - progress}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s",
            filter: `drop-shadow(0 0 8px ${color.stroke})`,
          }}
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 15}
          textAnchor="middle"
          className="font-display"
          style={{ fill: color.stroke, fontSize: "3rem", fontWeight: 800 }}
        >
          {animatedScore}
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          className="font-mono"
          style={{ fill: "hsl(0, 0%, 55%)", fontSize: "0.7rem", letterSpacing: "0.2em" }}
        >
          RISK SCORE
        </text>
      </svg>
      <span
        className={`font-display text-sm font-bold tracking-[0.3em] px-4 py-1 rounded-full border ${
          animatedScore <= 30
            ? "border-neon-green/30 bg-neon-green/5 neon-text-green"
            : animatedScore <= 65
            ? "border-neon-yellow/30 bg-neon-yellow/5 neon-text-yellow"
            : "border-neon-red/30 bg-neon-red/5 neon-text-red"
        }`}
      >
        {level} RISK
      </span>
    </div>
  );
};

export default RiskGauge;
