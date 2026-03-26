import { Shield, Cpu, Camera, BarChart3, ScanEye, Brain, Layers, Zap } from "lucide-react";
import GlassCard from "@/components/GlassCard";

const steps = [
  { icon: Camera, title: "Image Capture", desc: "Upload a room image or capture one in real-time for analysis." },
  { icon: ScanEye, title: "Object Detection", desc: "YOLO-based AI model scans for hidden cameras, microphones, and transmitters." },
  { icon: Brain, title: "Risk Analysis", desc: "Multi-factor AI risk model evaluates threat level using pattern recognition." },
  { icon: BarChart3, title: "Report Generation", desc: "Comprehensive risk report with heatmaps, suggestions, and confidence scores." },
];

const techStack = [
  { name: "YOLOv8", desc: "Real-time object detection for surveillance device identification", color: "neon-text-red" },
  { name: "OpenCV", desc: "Computer vision for reflection analysis and image preprocessing", color: "neon-text-green" },
  { name: "TensorFlow", desc: "Deep learning inference for pattern recognition models", color: "neon-text-yellow" },
  { name: "React + Vite", desc: "Modern frontend with real-time data visualization", color: "neon-text-cyan" },
  { name: "AI Risk Model", desc: "Custom multi-factor risk scoring algorithm", color: "neon-text-red" },
  { name: "Python Backend", desc: "FastAPI-powered inference server with GPU acceleration", color: "neon-text-green" },
];

const About = () => (
  <div className="min-h-screen pt-24 pb-12 px-6">
    <div className="container mx-auto max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Shield className="h-16 w-16 neon-text-green" />
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-neon-green/10 blur-xl" />
          </div>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-wider neon-text-cyan mb-4">
          SENTINELEYE AI
        </h1>
        <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          An AI-powered privacy risk analyzer that detects hidden surveillance devices in any room.
          Using state-of-the-art computer vision and deep learning, SentinelEye identifies potential threats 
          and provides actionable security recommendations.
        </p>
      </div>

      {/* How it works */}
      <GlassCard className="mb-8">
        <h2 className="font-display text-lg tracking-widest neon-text-cyan mb-8 text-center">
          HOW IT WORKS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="p-4 rounded-xl border border-border/30 bg-secondary/20 group-hover:border-neon-cyan/30 group-hover:bg-neon-cyan/5 transition-all duration-300">
                  <step.icon className="h-8 w-8 text-muted-foreground group-hover:text-neon-cyan transition-colors" />
                </div>
                <span className="absolute -top-2 -right-2 font-display text-xs font-bold neon-text-green bg-background px-1.5 py-0.5 rounded-md border border-neon-green/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-2">{step.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Tech Stack */}
      <GlassCard>
        <h2 className="font-display text-lg tracking-widest neon-text-cyan mb-8 text-center">
          TECHNOLOGIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, i) => (
            <div key={i} className="p-4 rounded-lg border border-border/20 bg-secondary/10 hover:border-border/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <Layers className={`h-4 w-4 ${tech.color}`} />
                <h3 className={`font-display text-sm font-bold tracking-wider ${tech.color}`}>{tech.name}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground">{tech.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </div>
);

export default About;
