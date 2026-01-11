import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import type { AppDispatch } from "../store/store";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  // Alert state
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [alertVariant, setAlertVariant] = React.useState<"default" | "destructive" | "success">("default");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await dispatch(login({ email, password }));
      const role = (res.payload as { role: string }).role;

      if (role === "ROLE_ADMIN") nav("/admin");
      if (role === "ROLE_HEALTH_WORKER") nav("/health");
      if (role === "ROLE_CITIZEN") nav("/citizen");
    } catch (error) {
      setAlertMessage("Login failed: Invalid credentials");
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {/* Custom Alert */}
      {alertMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert variant={alertVariant}>
            <AlertTitle>
              {alertVariant === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="w-full max-w-md shadow-lg  border-teal-600">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-teal-100 p-3 text-teal-600">
              <ShieldCheck size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">My NVD Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 hover:text-cyan-200">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
