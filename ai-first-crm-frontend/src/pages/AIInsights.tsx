import { useEffect, useState } from "react";
import {
  Sparkles,
  Brain,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import {
  getLeads,
  generateAIInsight,
  getAIInsights,
} from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Lead {
  id: number;
  name: string;
  company: string;
  status: "Hot" | "Warm" | "Cold";
}

interface Insight {
  id: number;
  insight: string;
  score: number;
  created_at: string;
}

export default function AllInsights() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLeads().then(setLeads);
  }, []);

  useEffect(() => {
    if (!selectedLead) return;
    getAIInsights(selectedLead.id).then(setInsights);
  }, [selectedLead]);

  const handleGenerate = async () => {
    if (!selectedLead) return;
    setLoading(true);
    await generateAIInsight(selectedLead.id);
    const updated = await getAIInsights(selectedLead.id);
    setInsights(updated);
    setLoading(false);
  };

  const latest = insights[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="text-primary w-5 h-5" />
          AI Insights
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time AI analysis for every lead
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Selector */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Lead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  selectedLead?.id === lead.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.company}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      lead.status === "Hot" && "bg-red-100 text-red-600",
                      lead.status === "Warm" && "bg-orange-100 text-orange-600",
                      lead.status === "Cold" && "bg-blue-100 text-blue-600"
                    )}
                  >
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI Analysis
            </CardTitle>
            <Button onClick={handleGenerate} disabled={!selectedLead || loading}>
              <Zap className="w-4 h-4 mr-1" />
              {loading ? "Analyzing..." : "Generate Insight"}
            </Button>
          </CardHeader>

          <CardContent className="space-y-5">
            {!selectedLead && (
              <div className="text-center py-12 text-muted-foreground">
                Select a lead to view AI insights
              </div>
            )}

            {selectedLead && !latest && (
              <div className="text-center py-12 text-muted-foreground">
                No insights yet. Generate the first one 🚀
              </div>
            )}

            {latest && (
              <>
                {/* Score Card */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 flex flex-col items-center justify-center border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">
                      AI Confidence
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {latest.score}
                    </p>
                    <p className="text-xs">/100</p>
                  </div>

                  <div className="col-span-2 border rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Key Insight
                    </p>
                    <p className="text-sm whitespace-pre-line">
                      {latest.insight}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Insight History
                  </p>
                  <div className="space-y-3">
                    {insights.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-3 text-sm"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">
                            Score: {item.score}/100
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {item.insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}