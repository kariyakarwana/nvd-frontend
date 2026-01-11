import { useState, useEffect } from "react";
import api from "@/api/axios";
import type { VaccinationRecord } from "@/lib/types";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Calendar, Syringe } from "lucide-react";

export default function CitizenDashboard() {
  const [vaccinationHistory, setVaccinationHistory] = useState<VaccinationRecord[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
      
      if (res.data.nic) {
        const historyRes = await api.get(`/vaccination/${res.data.nic}`);
        setVaccinationHistory(historyRes.data);
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Vaccination Records</h1>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Vaccination History
          </h2>
          
          {vaccinationHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Syringe size={48} className="mx-auto mb-4 opacity-20" />
              <p>No vaccination records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left">Vaccine</th>
                    <th className="p-3 text-left">Dose</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Manufacturer</th>
                    <th className="p-3 text-left">Provider</th>
                    <th className="p-3 text-left">Office</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinationHistory.map(record => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{record.vaccine?.name}</td>
                      <td className="p-3">{record.doseNumber}</td>
                      <td className="p-3">{record.administrationDate}</td>
                      <td className="p-3">{record.manufacturer}</td>
                      <td className="p-3">{record.providerName}</td>
                      <td className="p-3">{record.providerOffice || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}