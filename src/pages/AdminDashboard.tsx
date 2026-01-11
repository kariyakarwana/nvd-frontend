import { useState, useEffect } from "react";
import api from "../api/axios";
import type { User, VaccinationRecord } from "@/lib/types";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboard() {
  const { token, role } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("Token:", token);
    console.log("Role:", role);
  }, [token, role]);

  const [healthWorker, setHealthWorker] = useState({
    email: "",
    password: "",
    fullname: "",
    title: ""
  });

  const [citizen, setCitizen] = useState({
    email: "",
    fullname: "",
    nic: "",
    address: "",
    phone: "",
    dob: ""
  });

  const [searchNic, setSearchNic] = useState("");
  const [citizenData, setCitizenData] = useState<User | null>(null);
  const [records, setRecords] = useState<VaccinationRecord[]>([]);

  // Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive" | "success">("default");

  const addHealthWorker = async () => {
    try {
      await api.post("/user/healthworker", healthWorker);
      setAlertMessage("Health Worker Added Successfully!");
      setAlertVariant("success");
      setHealthWorker({ email: "", password: "", fullname: "", title: "" });
      // Clear alert after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      // Clear alert after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const addCitizen = async () => {
    try {
      await api.post("/user/citizen", citizen);
      setAlertMessage("Citizen Added Successfully!");
      setAlertVariant("success");
      setCitizen({ email: "", fullname: "", nic: "", address: "", phone: "", dob: "" });
      // Clear alert after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      // Clear alert after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const searchCitizen = async () => {
    try {
      const res = await api.get(`/citizen/search/${searchNic}`);
      setCitizenData(res.data);
      const history = await api.get(`/vaccination/${searchNic}`);
      setRecords(history.data);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      // Clear alert after 5 seconds
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Add Health Worker */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Add Health Worker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="Full Name"
                value={healthWorker.fullname}
                onChange={e => setHealthWorker({ ...healthWorker, fullname: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="Email"
                type="email"
                value={healthWorker.email}
                onChange={e => setHealthWorker({ ...healthWorker, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Title (e.g., Nurse, Doctor)"
                value={healthWorker.title}
                onChange={e => setHealthWorker({ ...healthWorker, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                placeholder="Password"
                type="password"
                value={healthWorker.password}
                onChange={e => setHealthWorker({ ...healthWorker, password: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addHealthWorker} className="mt-4 bg-green-600 text-white hover:text-cyan-200">
            Add Health Worker
          </Button>
        </Card>

        {/* Add Citizen */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Add Citizen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="Full Name"
                value={citizen.fullname}
                onChange={e => setCitizen({ ...citizen, fullname: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="Email"
                type="email"
                value={citizen.email}
                onChange={e => setCitizen({ ...citizen, email: e.target.value })}
              />
            </div>
            <div>
              <Label>NIC</Label>
              <Input
                placeholder="NIC"
                value={citizen.nic}
                onChange={e => setCitizen({ ...citizen, nic: e.target.value })}
              />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={citizen.dob}
                onChange={e => setCitizen({ ...citizen, dob: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                placeholder="Phone"
                value={citizen.phone}
                onChange={e => setCitizen({ ...citizen, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                placeholder="Address"
                value={citizen.address}
                onChange={e => setCitizen({ ...citizen, address: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addCitizen} className="mt-4 bg-blue-600 text-white hover:text-cyan-200">
            Add Citizen
          </Button>
        </Card>

        {/* Search Citizen */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Search Citizen</h2>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Enter NIC"
              value={searchNic}
              onChange={e => setSearchNic(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && searchCitizen()}
            />
            <Button onClick={searchCitizen} className="bg-teal-600 text-white hover:text-cyan-200">
              Search
            </Button>
          </div>

          {citizenData && (
            <div className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{citizenData.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIC</p>
                  <p className="font-semibold">{citizenData.nic}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{citizenData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{citizenData.address}</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Vaccination History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left">Vaccine</th>
                      <th className="p-3 text-left">Dose</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(r => (
                      <tr key={r.id} className="border-b">
                        <td className="p-3">{r.vaccine?.name}</td>
                        <td className="p-3">{r.doseNumber}</td>
                        <td className="p-3">{r.administrationDate}</td>
                        <td className="p-3">{r.providerName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}