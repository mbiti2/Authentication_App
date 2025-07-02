import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { authApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LogOut } from "lucide-react";
import { HttpStatusCode } from "axios";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type FormData = z.infer<typeof schema>;

const AdminRegisterPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    try {
      await authApi.registerAdmin({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName
      });
      setSuccess("Admin registered successfully.");
      reset();
    } catch (err: any) {
      if (err.response.status === HttpStatusCode.Conflict) {
        setError("Email already registered");
      } else if (err.response.status === HttpStatusCode.Unauthorized) {
        logout();
      } else {
        setError(err.response.data.detail || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-900 relative">
      <button
        onClick={logout}
        className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
      >
        <LogOut size={16} /> Logout
      </button>
      <Card className="w-full max-w-md shadow-xl rounded-2xl backdrop-blur bg-white/80 mt-12">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold text-center text-blue-900">Register New Admin</CardTitle>
          <CardDescription className="text-center text-blue-700">
            Only accessible to admins
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
            {success && (
              <Alert variant="default">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-blue-900 font-semibold">First Name</Label>
              <Input id="firstName" {...register("firstName")} className={`rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.firstName ? 'border-red-500' : ''}`} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-blue-900 font-semibold">Last Name</Label>
              <Input id="lastName" {...register("lastName")} className={`rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.lastName ? 'border-red-500' : ''}`} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-semibold">Email</Label>
              <Input id="email" type="email" {...register("email")} className={`rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : ''}`} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-900 font-semibold">Password</Label>
              <Input id="password" type="password" {...register("password")} className={`rounded-lg focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border-red-500' : ''}`} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegisterPage;
