import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Brain, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect after successful auth
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        await signIn(email, password);
        toast.success("Welcome back!");
      } else {
        // 🆕 SIGN UP
        await signUp(email, password);
        toast.success("Account created! Please sign in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: any) {
      console.error("Auth error:", err);

      const code = err?.code;

      // ✅ Proper UX-based error handling
      if (code === "auth/invalid-credential" || code === "auth/user-not-found") {
        toast.error("Account not found. Please sign up.");
        setIsLogin(false);
      } else if (code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (code === "auth/email-already-in-use") {
        toast.error("Email already exists. Please sign in.");
        setIsLogin(true);
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts. Try again later.");
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* BRAND */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">AI-First CRM</h1>
          <p className="text-muted-foreground text-sm">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* CARD */}
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{isLogin ? "Welcome back" : "Get started"}</CardTitle>
              <CardDescription>
                {isLogin
                  ? "Enter your credentials to access your dashboard"
                  : "Fill in your details to create an account"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-medium hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}