import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // ✅ NEW

  // Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [aiNotif, setAiNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // AI config
  const [tone, setTone] = useState("Professional");
  const [autoInsights, setAutoInsights] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadSettings() {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmailNotif(data.notifications?.email ?? true);
          setAiNotif(data.notifications?.ai ?? true);
          setWeeklyDigest(data.notifications?.weekly ?? true);
          setTone(data.ai?.tone || "Professional");
          setAutoInsights(data.ai?.autoInsights ?? true);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [user]);

  async function saveProfile() {
    if (!user || saving) return;

    setSaving(true); // ✅ start feedback

    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        {
          firstName,
          lastName,
          email: user.email,
          notifications: {
            email: emailNotif,
            ai: aiNotif,
            weekly: weeklyDigest,
          },
          ai: {
            tone,
            autoInsights,
          },
        },
        { merge: true }
      );

      toast.success("Settings updated successfully ✅"); // ✅ clear feedback
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false); // ✅ end feedback
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading settings…</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* PROFILE */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>

          <Button size="sm" onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* NOTIFICATIONS */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            label="Email notifications"
            desc="Receive email alerts"
            checked={emailNotif}
            onChange={setEmailNotif}
          />
          <Toggle
            label="AI insight alerts"
            desc="Get notified for insights"
            checked={aiNotif}
            onChange={setAiNotif}
          />
          <Toggle
            label="Weekly digest"
            desc="Weekly CRM summary"
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </CardContent>
      </Card>

      {/* AI CONFIG */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">AI Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value="GPT-4o" disabled />
          <Input value={tone} onChange={(e) => setTone(e.target.value)} />
          <Separator />
          <Toggle
            label="Auto-generate insights"
            desc="Analyze leads automatically"
            checked={autoInsights}
            onChange={setAutoInsights}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* TOGGLE */
function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}