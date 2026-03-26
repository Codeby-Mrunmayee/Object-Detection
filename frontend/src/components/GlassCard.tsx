import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "green" | "red" | "yellow" | "cyan" | "none";
}

const GlassCard = ({ children, className = "", hover = false, glow = "none" }: GlassCardProps) => {
  const glowClass = glow !== "none" ? `glow-border-${glow}` : "";
  return (
    <div className={`${hover ? "glass-card-hover" : "glass-card"} ${glowClass} p-6 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
