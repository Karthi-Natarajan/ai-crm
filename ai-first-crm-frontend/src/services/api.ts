const API_BASE_URL = "http://127.0.0.1:5000";

export interface LeadPayload {
  name: string;
  company: string;
  role: string;
  email: string;
  industry: string;
  status: "Hot" | "Warm" | "Cold";
  notes: string;
}

export async function getLeads() {
  const res = await fetch(`${API_BASE_URL}/leads`);
  return res.json();
}

export async function createLead(data: LeadPayload) {
  const res = await fetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteLead(id: number) {
  const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/dashboard`);
  return res.json();
}

export async function getDashboardCharts() {
  const res = await fetch(`${API_BASE_URL}/dashboard/charts`);
  return res.json();
}

export async function generateAIInsight(leadId: number) {
  const res = await fetch(`${API_BASE_URL}/ai-insights/${leadId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("AI insight failed");
  return res.json();
}

export async function getAIInsights(leadId: number) {
  const res = await fetch(`${API_BASE_URL}/ai-insights/${leadId}`);
  if (!res.ok) throw new Error("Failed to load insights");
  return res.json();
}
export async function getAnalytics() {
  const res = await fetch("http://127.0.0.1:5000/analytics");
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}
export async function getActivities() {
  const res = await fetch("http://127.0.0.1:5000/activities");
  if (!res.ok) throw new Error("Failed to load activity");
  return res.json();
}
export function logout() {
  localStorage.removeItem("user");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("user");
}
