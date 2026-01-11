import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Vaccine } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Edit2, Trash2, Syringe } from "lucide-react";

export default function VaccineManagement() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive" | "success" | "warning" | "info" | "cyan">("default");
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
  const [form, setForm] = useState({
    name: "",
    totalDoses: 1,
    minAgeMonths: 0,
    maxAgeMonths: 60
  });

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    try {
      const res = await api.get("/vaccines");
      setVaccines(res.data);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/vaccines/${editingId}`, form);
        setAlertMessage("Vaccine updated successfully");
        setAlertVariant("success");
        setTimeout(() => setAlertMessage(null), 5000);
      } else {
        await api.post("/vaccines", form);
        setAlertMessage("Vaccine added successfully");
        setAlertVariant("success");
        setTimeout(() => setAlertMessage(null), 5000);
      }
      resetForm();
      loadVaccines();
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleEdit = (vaccine: Vaccine) => {
    setForm({
      name: vaccine.name,
      totalDoses: vaccine.totalDoses,
      minAgeMonths: vaccine.minAgeMonths,
      maxAgeMonths: vaccine.maxAgeMonths
    });
    setEditingId(vaccine.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Vaccine",
      message: "Are you sure you want to delete this vaccine? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await api.delete(`/vaccines/${id}`);
          setAlertMessage("Vaccine deleted");
          setAlertVariant("success");
          setTimeout(() => setAlertMessage(null), 5000);
          loadVaccines();
        } catch (error: any) {
          setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
          setAlertVariant("destructive");
          setTimeout(() => setAlertMessage(null), 5000);
        }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => {} });
      },
    });
  };

  const resetForm = () => {
    setForm({ name: "", totalDoses: 1, minAgeMonths: 0, maxAgeMonths: 60 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-8">
      {alertMessage && (
        <Alert variant={alertVariant} className="mb-6">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vaccine Management</h1>
          <p className="text-sm text-gray-400">Manage available vaccines</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:text-cyan-200">
          <Plus size={16} className="mr-2" /> Add Vaccine
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Vaccine" : "Add New Vaccine"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Vaccine Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., BCG, OPV, MMR"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalDoses">Total Doses</Label>
                <Input
                  id="totalDoses"
                  type="number"
                  min="1"
                  value={form.totalDoses}
                  onChange={e => setForm({ ...form, totalDoses: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="minAge">Min Age (months)</Label>
                <Input
                  id="minAge"
                  type="number"
                  min="0"
                  value={form.minAgeMonths}
                  onChange={e => setForm({ ...form, minAgeMonths: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="maxAge">Max Age (months)</Label>
                <Input
                  id="maxAge"
                  type="number"
                  min="0"
                  value={form.maxAgeMonths}
                  onChange={e => setForm({ ...form, maxAgeMonths: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="bg-teal-600 hover:text-cyan-200">
                {editingId ? "Update Vaccine" : "Add Vaccine"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="text-white hover:text-cyan-200">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaccines.map(vaccine => (
            <Card key={vaccine.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Syringe className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vaccine.name}</h3>
                    <p className="text-sm text-gray-500">{vaccine.totalDoses} doses</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>Age: {vaccine.minAgeMonths} - {vaccine.maxAgeMonths} months</p>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(vaccine)}
                  className="flex-1 hover:text-cyan-200 text-white"
                >
                  <Edit2 size={14} className="mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(vaccine.id)}
                  className="text-white hover:text-cyan-200"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {vaccines.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Syringe size={48} className="mx-auto mb-4 opacity-20" />
            <p>No vaccines added yet</p>
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