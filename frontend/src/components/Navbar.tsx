import { Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Scan, FileText, Info } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: Scan },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Shield className="h-8 w-8 text-neon-green transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(150,100%,45%)]" />
            <div className="absolute inset-0 h-8 w-8 rounded-full bg-neon-green/10 blur-md" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-widest neon-text-green leading-none">
              SENTINELEYE
            </span>
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
              AI SURVEILLANCE ANALYZER
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium tracking-wide transition-all duration-300 ${
                  active
                    ? "neon-text-cyan bg-neon-cyan/5 border border-neon-cyan/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
