import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import type { AppDispatch } from "../store/store";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await dispatch(login({ email, password }));
    const role = (res.payload as { role: string }).role;

    if (role === "ADMIN") nav("/admin");
    if (role === "HEALTH_WORKER") nav("/health");
    if (role === "CITIZEN") nav("/citizen");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
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
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
