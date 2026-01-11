import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Search, Plus, Edit, Trash2, UserCheck } from "lucide-react";

export default function HealthWorkerList() {
  const [healthWorkers, setHealthWorkers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive" | "success">("default");

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    loadHealthWorkers();
  }, []);

  const loadHealthWorkers = async () => {
    try {
      const res = await api.get("/user/healthworkers");
      setHealthWorkers(res.data);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const deleteHealthWorker = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Health Worker",
      message: "Are you sure you want to delete this health worker? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await api.delete(`/user/healthworker/${id}`);
          setAlertMessage("Health worker deleted");
          setAlertVariant("success");
          setTimeout(() => setAlertMessage(null), 5000);
          loadHealthWorkers();
        } catch (error: any) {
          setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
          setAlertVariant("destructive");
          setTimeout(() => setAlertMessage(null), 5000);
        }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => {} });
      },
    });
  };

  const filtered = healthWorkers.filter(hw =>
    (hw.fullname && hw.fullname.toLowerCase().includes(search.toLowerCase())) ||
    (hw.email && hw.email.toLowerCase().includes(search.toLowerCase())) ||
    (hw.title && hw.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8">
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Health Workers</h1>
          <p className="text-sm text-gray-400">Manage health worker accounts</p>
        </div>
        <Button onClick={() => navigate("/admin")} className="bg-teal-600 text-white hover:text-cyan-200">
          <Plus size={16} className="mr-2" /> Add Health Worker
        </Button>
      </div>

      <Card className="p-6">
        <div className="relative mb-4 w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <Input
            className="pl-10"
            placeholder="Search by name, email, or title"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(hw => (
            <Card key={hw.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <UserCheck className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{hw.fullname}</h3>
                    <p className="text-sm text-gray-500">{hw.title || "Health Worker"}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-600">{hw.email}</p>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/healthworker/${hw.id}`)}
                  className="flex-1 hover:text-cyan-200 text-white"
                >
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteHealthWorker(hw.id)}
                  className="text-white hover:text-cyan-200"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <UserCheck size={48} className="mx-auto mb-4 opacity-20" />
            <p>No health workers found</p>
          </div>
        )}
      </Card>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => {} })}
        variant="destructive"
      />
    </div>
  );
}