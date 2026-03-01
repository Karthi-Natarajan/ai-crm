import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Calendar, User, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export function TopNav() {
  const navigate = useNavigate();
  const { signOutUser, profile } = useAuth();

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [unread, setUnread] = useState(true);

  function toggleNotif() {
    setOpenNotif(!openNotif);
    setOpenProfile(false);
    setUnread(false);
  }

  function toggleProfile() {
    setOpenProfile(!openProfile);
    setOpenNotif(false);
  }

  function goToSettings() {
    setOpenProfile(false);
    navigate("/settings");
  }

  async function logout() {
    try {
      setOpenProfile(false);
      await signOutUser();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // 🔤 Dynamic initials
  const initials =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`
      : "JD";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 relative">
      {/* SEARCH */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search leads, insights, actions..."
          className="pl-9 h-9 bg-secondary border-none text-sm"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(), "MMM d, yyyy")}</span>
        </div>

        {/* PROFILE */}
        <div className="relative">
          <button onClick={toggleProfile}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">
                  {profile?.firstName || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.email}
                </p>
              </div>

              <button
                onClick={goToSettings}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary"
              >
                <User className="w-4 h-4" /> Profile
              </button>

              <button
                onClick={goToSettings}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-secondary"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}