import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log("Login form submitted with data:", data);
      setError("");
      console.log("Calling login function...");
      await login(data.email, data.password);
      console.log("Login function completed successfully");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-900">
      <Card className="w-full max-w-md shadow-xl rounded-2xl backdrop-blur bg-white/80">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold text-center text-blue-900">Sign In</CardTitle>
          <CardDescription className="text-center text-blue-700">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                {...register("email")}
                className={`rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900 font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-blue-900">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-700 hover:underline font-semibold">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
