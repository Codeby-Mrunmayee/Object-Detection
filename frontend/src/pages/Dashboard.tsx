import { useState, useCallback } from "react";
import { Upload, AlertTriangle, Eye, ShieldCheck, Activity, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import StatCard from "@/components/StatCard";
import RiskGauge from "@/components/RiskGauge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanned, setScanned] = useState(false);
  const navigate = useNavigate();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = () => {
    setScanned(true);
    setTimeout(() => navigate("/analyze"), 800);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-wider neon-text-cyan mb-2">
            SURVEILLANCE DASHBOARD
          </h1>
          <p className="font-body text-muted-foreground text-lg">
            Upload a room image to detect hidden surveillance devices and analyze privacy risks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Card */}
          <div className="lg:col-span-2">
            <GlassCard className="h-full" hover>
              <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4">
                IMAGE UPLOAD
              </h3>
              {!image ? (
                <label
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center h-72 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-neon-cyan/60 bg-neon-cyan/5"
                      : "border-border/50 hover:border-neon-cyan/30 hover:bg-secondary/20"
                  }`}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-body text-lg text-muted-foreground">
                    Drag & drop an image or <span className="neon-text-cyan">browse</span>
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/50 mt-2">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </label>
              ) : (
                <div className="relative h-72 rounded-xl overflow-hidden group">
                  <img src={image} alt="Uploaded room" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 rounded-lg border border-neon-cyan/30 bg-background/80 font-mono text-sm neon-text-cyan hover:bg-neon-cyan/10 transition-colors">
                      Replace Image
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    </label>
                  </div>
                  {/* Scan line effect */}
                  {scanned && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="scan-line w-full h-1/3" />
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Risk Score Preview */}
          <GlassCard hover glow={image ? "cyan" : "none"}>
            <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-6">
              QUICK RISK SCORE
            </h3>
            <div className="flex flex-col items-center">
              <RiskGauge score={image ? 72 : 0} size={200} />
            </div>
            <div className="mt-6">
              <Button
                onClick={runAnalysis}
                disabled={!image}
                className="w-full font-display text-sm tracking-wider bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:shadow-[var(--glow-green)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                RUN FULL ANALYSIS
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard label="Suspicious Objects" value={image ? 4 : "—"} icon={AlertTriangle} color="red" />
          <StatCard label="Reflection Alerts" value={image ? 2 : "—"} icon={Eye} color="yellow" />
          <StatCard label="Risk Score" value={image ? "72/100" : "—"} icon={ShieldCheck} color="cyan" />
          <StatCard label="Scan Status" value={image ? "Ready" : "Idle"} icon={Activity} color="green" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
