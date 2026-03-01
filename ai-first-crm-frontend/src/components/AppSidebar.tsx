import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Brain,
  BarChart3,
  Activity,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "AI Insights", url: "/ai-insights", icon: Brain },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Activity", url: "/activity", icon: Activity },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      <div className="h-14 flex items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sidebar-accent-foreground font-semibold text-sm tracking-tight">
          AI-First CRM
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? ""
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs font-medium text-sidebar-accent-foreground">AI Credits</p>
          <div className="mt-2 h-1.5 rounded-full bg-sidebar-border overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-sidebar-primary" />
          </div>
          <p className="text-xs text-sidebar-muted mt-1.5">750 / 1,000 used</p>
        </div>
      </div>
    </aside>
  );
}
