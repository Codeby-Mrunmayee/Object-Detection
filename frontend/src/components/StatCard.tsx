import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "green" | "red" | "yellow" | "cyan";
}

const colorMap = {
  green: { text: "neon-text-green", bg: "bg-neon-green/10", border: "border-neon-green/20" },
  red: { text: "neon-text-red", bg: "bg-neon-red/10", border: "border-neon-red/20" },
  yellow: { text: "neon-text-yellow", bg: "bg-neon-yellow/10", border: "border-neon-yellow/20" },
  cyan: { text: "neon-text-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/20" },
};

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => {
  const c = colorMap[color];
  return (
    <div className={`glass-card-hover p-5 flex items-center gap-4`}>
      <div className={`${c.bg} ${c.border} border rounded-lg p-3`}>
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <div>
        <p className="font-mono text-xs text-muted-foreground tracking-wider uppercase">{label}</p>
        <p className={`font-display text-2xl font-bold ${c.text}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
