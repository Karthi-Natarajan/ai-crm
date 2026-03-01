import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Brain,
  Trash2,
} from "lucide-react";
import { getActivities } from "@/services/api";
import { formatDistanceToNow } from "date-fns";

const ICONS: any = {
  lead: UserPlus,
  ai: Brain,
  delete: Trash2,
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setActivities(await getActivities());
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Timeline of real CRM events and actions.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {activities.map((a) => {
                const Icon = ICONS[a.type] || UserPlus;

                return (
                  <div key={a.id} className="flex gap-4 relative">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center z-10 shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {a.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(a.created_at))} ago
                      </p>
                    </div>
                  </div>
                );
              })}

              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No activity yet.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}