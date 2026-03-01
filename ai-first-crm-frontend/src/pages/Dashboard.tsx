import { useEffect, useState } from "react";
import {
  Users,
  Flame,
  Thermometer,
  Snowflake,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { getDashboardStats, getDashboardCharts, getLeads } from "@/services/api";

/* 🔥 SAME STATUS COLORS — UNCHANGED */
const STATUS_COLORS: any = {
  Hot: "#ef4444",
  Warm: "#facc15",
  Cold: "#3b82f6",
};

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setStats(await getDashboardStats());
    setCharts(await getDashboardCharts());
    const leads = await getLeads();
    setRecent(leads.slice(0, 6));
  }

  if (!stats || !charts) {
    return <p className="text-muted-foreground">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time CRM intelligence & performance metrics
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <Kpi title="Total Leads" value={stats.totalLeads} icon={Users} />
        <Kpi title="Hot Leads" value={stats.hot} icon={Flame} color="from-red-500/20" />
        <Kpi title="Warm Leads" value={stats.warm} icon={Thermometer} color="from-yellow-400/30" />
        <Kpi title="Cold Leads" value={stats.cold} icon={Snowflake} color="from-blue-500/20" />
        <Kpi title="Industries" value={stats.industries} icon={Building2} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* GROWTH */}
        <Card className="xl:col-span-2 shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Lead Growth (Weekly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="url(#grad)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* STATUS MIX — UI UNCHANGED */}
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Lead Status Mix</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={charts.status}
                  innerRadius={65}
                  outerRadius={105}
                  dataKey="value"
                  paddingAngle={6}
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {charts.status.map((s: any) => {
                    const key =
                      String(s.status || s.name).toLowerCase();

                    return (
                      <Cell
                        key={key}
                        fill={
                          STATUS_COLORS[
                            String(s.status || s.name)
                              .charAt(0)
                              .toUpperCase() +
                              String(s.status || s.name).slice(1)
                          ] || "#9ca3af"
                        }
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* LEGEND */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {charts.status.map((s: any) => (
                <div key={s.status} className="text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: STATUS_COLORS[s.status] }}
                  />
                  <p className="text-xs text-muted-foreground">{s.status}</p>
                  <p className="text-lg font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ACTIVITY */}
      <Card className="shadow-md hover:shadow-lg transition">
        <CardHeader>
          <CardTitle>Live Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recent.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                  {l.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Added • {l.company}
                  </p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 text-xs rounded-full"
                style={{
                  backgroundColor: STATUS_COLORS[l.status] + "22",
                  color: STATUS_COLORS[l.status],
                }}
              >
                {l.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* KPI CARD — UNCHANGED */
function Kpi({ title, value, icon: Icon, color = "from-primary/10" }: any) {
  return (
    <Card className="relative overflow-hidden hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent`} />
      <CardContent className="relative p-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-muted-foreground">{title}</p>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}