import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function UserMenu() {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOutUser();
      navigate("/auth"); // 🔐 go back to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 w-full text-left"
    >
      Logout
    </button>
  );
}