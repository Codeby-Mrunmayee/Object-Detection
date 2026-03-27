import { Download, RotateCcw, ShieldAlert, Eye, Camera, Wifi, Radio, Lightbulb } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import RiskGauge from "@/components/RiskGauge";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell } from "recharts";

const riskFactors = [
  { name: "Hidden Cameras", value: 85, color: "hsl(0, 85%, 55%)" },
  { name: "IR Reflections", value: 60, color: "hsl(45, 100%, 55%)" },
  { name: "RF Signals", value: 45, color: "hsl(45, 100%, 55%)" },
  { name: "Unusual Objects", value: 70, color: "hsl(0, 85%, 55%)" },
  { name: "Wire Anomalies", value: 30, color: "hsl(150, 100%, 45%)" },
  { name: "Network Devices", value: 55, color: "hsl(45, 100%, 55%)" },
];

const confidenceData = [
  { subject: "Camera Detection", A: 92 },
  { subject: "Object Recognition", A: 85 },
  { subject: "RF Analysis", A: 78 },
  { subject: "Pattern Matching", A: 88 },
  { subject: "Anomaly Score", A: 72 },
  { subject: "Context Analysis", A: 80 },
];

const detectedObjects = [
  { name: "Small camera lens", confidence: 94, risk: "high" as const },
  { name: "Unusual IR reflection", confidence: 87, risk: "high" as const },
  { name: "Hidden wireless transmitter", confidence: 72, risk: "medium" as const },
  
];

const suggestions = [
  "Inspect the air vent on the east wall for a potential pinhole camera.",
  "Check doorbell area for IR-emitting devices using your phone camera.",
  "Scan for RF signals near the desk area using a bug detector.",
  
];

const Analyze = () => {
  const riskColor = (r: string) =>
    r === "high" ? "neon-text-red" : r === "medium" ? "neon-text-yellow" : "neon-text-green";
  const riskBg = (r: string) =>
    r === "high" ? "bg-neon-red/10 border-neon-red/20" : r === "medium" ? "bg-neon-yellow/10 border-neon-yellow/20" : "bg-neon-green/10 border-neon-green/20";

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-wider neon-text-cyan mb-2">
              ANALYSIS RESULTS
            </h1>
            <p className="font-body text-muted-foreground text-lg">
              Comprehensive AI-powered surveillance risk assessment
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-display text-xs tracking-wider border-border/50 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4 mr-2" />
              SCAN AGAIN
            </Button>
            <Button className="font-display text-xs tracking-wider bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              PDF REPORT
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Risk Gauge - Center piece */}
          <div className="lg:col-span-6">
            <GlassCard glow="red" hover className="flex flex-col items-center justify-center h-full">
              <RiskGauge score={72} size={240} />
              <p className="font-mono text-xs text-muted-foreground mt-4 text-center">
                Analysis completed at {new Date().toLocaleTimeString()}
              </p>
            </GlassCard>
          </div>

          {/* Detected Objects */}
          <div className="lg:col-span-6">
            <GlassCard hover className="h-full">
              <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 neon-text-red" />
                DETECTED OBJECTS
              </h3>
              <div className="space-y-3">
                {detectedObjects.map((obj, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${riskBg(obj.risk)}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-body text-sm text-foreground/90">{obj.name}</span>
                      <span className={`font-mono text-xs font-bold ${riskColor(obj.risk)} uppercase`}>
                        {obj.risk}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${obj.confidence}%`,
                            background: obj.risk === "high" ? "hsl(0, 85%, 55%)" : "hsl(45, 100%, 55%)",
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{obj.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          

          {/* Risk Factor Breakdown */}
          <div className="lg:col-span-6">
            <GlassCard hover>
              <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4">
                RISK FACTOR BREAKDOWN
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskFactors} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 11, fontFamily: "Rajdhani" }} axisLine={{ stroke: "hsl(0, 0%, 15%)" }} />
                  <YAxis tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 11 }} axisLine={{ stroke: "hsl(0, 0%, 15%)" }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 15%)", borderRadius: "8px", fontFamily: "JetBrains Mono", fontSize: 12 }}
                    labelStyle={{ color: "hsl(0, 0%, 85%)" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {riskFactors.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Confidence Radar */}
          <div className="lg:col-span-6">
            <GlassCard hover>
              <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4">
                AI CONFIDENCE SCORE
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={confidenceData}>
                  <PolarGrid stroke="hsl(0, 0%, 15%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 10, fontFamily: "Rajdhani" }} />
                  <Radar name="Confidence" dataKey="A" stroke="hsl(185, 100%, 50%)" fill="hsl(185, 100%, 50%)" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Explanation */}
          <div className="lg:col-span-6">
            <GlassCard hover>
              <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Radio className="h-4 w-4 neon-text-cyan" />
                WHY THIS RISK SCORE
              </h3>
              <div className="space-y-3 font-body text-sm text-secondary-foreground/80 leading-relaxed">
                <p>
                  The AI model identified <span className="neon-text-red font-semibold">4 suspicious objects</span> in the uploaded room image. 
                  A high-confidence detection of a <span className="neon-text-red font-semibold">pinhole camera lens</span> near the ventilation 
                  system contributed significantly to the elevated risk score.
                </p>
                <p>
                  Additionally, <span className="neon-text-yellow font-semibold">infrared reflections</span> were detected on the bookshelf area, 
                  which often indicate active surveillance equipment. The combination of multiple threat indicators across different 
                  categories resulted in the overall score of <span className="neon-text-red font-bold">72/100</span>.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Safety Suggestions */}
          <div className="lg:col-span-6">
            <GlassCard hover>
              <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 neon-text-green" />
                SAFETY SUGGESTIONS
              </h3>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 border border-border/30">
                    <span className="font-display text-xs neon-text-green mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-body text-sm text-secondary-foreground/80">{s}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
