import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Admin", email: "admin@aicrm.com" })
    );
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Login
      </button>
    </div>
  );
}