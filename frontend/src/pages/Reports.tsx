import { Download, FileText } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const scanHistory = [
  { id: "SCN-001", date: "2026-03-25", location: "Office Room A", score: 72, level: "High" },
  { id: "SCN-002", date: "2026-03-24", location: "Conference Room", score: 34, level: "Medium" },
  { id: "SCN-003", date: "2026-03-23", location: "Hotel Suite 412", score: 88, level: "High" },
  { id: "SCN-004", date: "2026-03-22", location: "Home Office", score: 12, level: "Low" },
  { id: "SCN-005", date: "2026-03-20", location: "Meeting Room B", score: 45, level: "Medium" },
];

const trendData = [
  { date: "Mar 20", score: 12 },
  { date: "Mar 21", score: 28 },
  { date: "Mar 22", score: 12 },
  { date: "Mar 23", score: 88 },
  { date: "Mar 24", score: 34 },
  { date: "Mar 25", score: 72 },
];

const distData = [
  { name: "High Risk", value: 2, color: "hsl(0, 85%, 55%)" },
  { name: "Medium Risk", value: 2, color: "hsl(45, 100%, 55%)" },
  { name: "Low Risk", value: 1, color: "hsl(150, 100%, 45%)" },
];

const levelColor = (l: string) =>
  l === "High" ? "neon-text-red" : l === "Medium" ? "neon-text-yellow" : "neon-text-green";

const Reports = () => (
  <div className="min-h-screen pt-24 pb-12 px-6">
    <div className="container mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-wider neon-text-cyan mb-2">SCAN REPORTS</h1>
          <p className="font-body text-muted-foreground text-lg">Historical scan data and analytics</p>
        </div>
        <Button variant="outline" className="font-display text-xs tracking-wider border-neon-green/30 text-neon-green hover:bg-neon-green/10">
          <Download className="h-4 w-4 mr-2" />
          EXPORT ALL
        </Button>
      </div>

      {/* Scan history table */}
      <GlassCard hover className="mb-6 overflow-hidden">
        <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 neon-text-cyan" />
          SCAN HISTORY
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {["Scan ID", "Date", "Location", "Risk Score", "Level", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-mono text-xs text-muted-foreground tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((s) => (
                <tr key={s.id} className="border-b border-border/10 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm neon-text-cyan">{s.id}</td>
                  <td className="py-3 px-4 font-body text-sm text-secondary-foreground/80">{s.date}</td>
                  <td className="py-3 px-4 font-body text-sm text-secondary-foreground/80">{s.location}</td>
                  <td className="py-3 px-4 font-display text-sm font-bold text-foreground">{s.score}</td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs font-bold ${levelColor(s.level)} uppercase`}>{s.level}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="font-mono text-xs text-muted-foreground hover:text-neon-cyan transition-colors">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <GlassCard hover>
          <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4">RISK TREND</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 11 }} axisLine={{ stroke: "hsl(0, 0%, 15%)" }} />
              <YAxis tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 11 }} axisLine={{ stroke: "hsl(0, 0%, 15%)" }} />
              <Tooltip contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 15%)", borderRadius: "8px", fontFamily: "JetBrains Mono", fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="hsl(185, 100%, 50%)" strokeWidth={2} dot={{ fill: "hsl(185, 100%, 50%)", r: 4 }} activeDot={{ r: 6, stroke: "hsl(185, 100%, 50%)", strokeWidth: 2, fill: "hsl(0, 0%, 0%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Distribution */}
        <GlassCard hover>
          <h3 className="font-display text-sm tracking-widest text-muted-foreground mb-4">RISK DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={distData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                {distData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend formatter={(value) => <span style={{ color: "hsl(0, 0%, 75%)", fontFamily: "Rajdhani", fontSize: 13 }}>{value}</span>} />
              <Tooltip contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 15%)", borderRadius: "8px", fontFamily: "JetBrains Mono", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  </div>
);

export default Reports;
