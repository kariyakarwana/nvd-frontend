import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

export default function HealthWorkerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [healthWorker, setHealthWorker] = useState<User | null>(null);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    title: "",
    password: ""
  });

  // Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive" | "success" | "warning" | "info" | "cyan">("default");

  useEffect(() => {
    loadHealthWorker();
  }, [id]);

  const loadHealthWorker = async () => {
    try {
      const res = await api.get(`/user/healthworker/${id}`);
      setHealthWorker(res.data);
      setForm({
        fullname: res.data.fullname || "",
        email: res.data.email || "",
        title: res.data.title || "",
        password: ""
      });
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/user/healthworker/${id}`, form);
      setAlertMessage("Health worker updated successfully");
      setAlertVariant("cyan");
      setTimeout(() => setAlertMessage(null), 5000);
      navigate("/admin/healthworkers");
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  if (!healthWorker) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      {alertMessage && (
        <Alert variant={alertVariant} className="mb-6">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/healthworkers")}
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Health Workers
      </Button>

      <Card className="max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Health Worker</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              value={form.fullname}
              onChange={e => setForm({ ...form, fullname: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Title (e.g., Nurse, Doctor)</Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Nurse, Doctor, etc."
            />
          </div>

          <div>
            <Label htmlFor="password">New Password (leave blank to keep current)</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter new password"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="bg-teal-600">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/healthworkers")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}