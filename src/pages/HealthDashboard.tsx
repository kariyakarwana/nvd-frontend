import { useState, useEffect } from "react";
import { searchCitizen, addVaccination, getVaccines } from "@/api/vaccination";
import type { User, Vaccine, AddVaccinationRequest, VaccinationRecord } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Search, Syringe, UserCheck, Calendar, UserPlus, Clock } from "lucide-react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";
export default function HealthDashboard() {
  const [nic, setNic] = useState("");
  const [citizen, setCitizen] = useState<User | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [vaccinationHistory, setVaccinationHistory] = useState<VaccinationRecord[]>([]);
  const [recentCitizens, setRecentCitizens] = useState<User[]>([]);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [showAddCitizenForm, setShowAddCitizenForm] = useState(false);

  const [vaccinationForm, setVaccinationForm] = useState<AddVaccinationRequest>({
    vaccine: { id: 0 },
    doseNumber: 1,
    administrationDate: "",
    manufacturer: "",
    lotNumber: "",
    expiryDate: "",
    providerName: "",
    providerOffice: "",
    providerTitle: "",
    visDate: ""
  });

  const [citizenForm, setCitizenForm] = useState({
    email: "",
    fullname: "",
    nic: "",
    address: "",
    phone: "",
    dob: ""
  });

  // Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive" | "success">("default");



  const loadVaccines = async () => {
    try {
      const res = await getVaccines();
      setVaccines(res.data);
    } catch (error: any) {
      setAlertMessage(`Error loading vaccines: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const search = async () => {
    if (!nic.trim()) {
      setAlertMessage("Please enter a NIC number");
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    try {
      const res = await searchCitizen(nic);
      setCitizen(res.data);

      // Load vaccination history
      const historyRes = await api.get(`/vaccination/${nic}`);
      setVaccinationHistory(historyRes.data);

      setShowVaccinationForm(false);
      setShowAddCitizenForm(false);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
      setCitizen(null);
      setVaccinationHistory([]);
    }
  };

  const addCitizen = async () => {
    // Validate form
    if (!citizenForm.fullname || !citizenForm.email || !citizenForm.nic || !citizenForm.dob) {
      setAlertMessage("Please fill in all required fields (Name, Email, NIC, Date of Birth)");
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    try {
      await api.post("/user/citizen", citizenForm);
      setAlertMessage("Citizen added successfully! Default password is: 123456");
      setAlertVariant("success");
      setTimeout(() => setAlertMessage(null), 5000);

      // Reset form
      setCitizenForm({
        email: "",
        fullname: "",
        nic: "",
        address: "",
        phone: "",
        dob: ""
      });
      setShowAddCitizenForm(false);

      // Auto-search for the newly added citizen
      setNic(citizenForm.nic);
      setTimeout(() => search(), 500);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const submitVaccination = async () => {
    if (!citizen) return;

    // Validate form
    if (!vaccinationForm.vaccine.id || vaccinationForm.vaccine.id === 0) {
      setAlertMessage("Please select a vaccine");
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    if (!vaccinationForm.administrationDate || !vaccinationForm.manufacturer ||
        !vaccinationForm.lotNumber || !vaccinationForm.expiryDate || !vaccinationForm.visDate) {
      setAlertMessage("Please fill in all required fields");
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    try {
      await addVaccination(nic, vaccinationForm);
      setAlertMessage("Vaccination record saved successfully!");
      setAlertVariant("success");
      setTimeout(() => setAlertMessage(null), 5000);

      // Reload vaccination history
      const historyRes = await api.get(`/vaccination/${nic}`);
      setVaccinationHistory(historyRes.data);
      
      // Reset form
      setVaccinationForm({
        vaccine: { id: 0 },
        doseNumber: 1,
        administrationDate: "",
        manufacturer: "",
        lotNumber: "",
        expiryDate: "",
        providerName: "",
        providerOffice: "",
        providerTitle: "",
        visDate: ""
      });
      setShowVaccinationForm(false);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };




  const loadRecentCitizens = async () => {
    try {
      const res = await api.get("/citizen/all");
      // Show first 5 citizens
      setRecentCitizens(res.data.slice(0, 5));
    } catch (error: any) {
      console.error("Error loading recent citizens:", error);
    }
  };

  const selectCitizen = async (selectedNic: string) => {
    setNic(selectedNic);
    try {
      const res = await searchCitizen(selectedNic);
      setCitizen(res.data);

      const historyRes = await api.get(`/vaccination/${selectedNic}`);
      setVaccinationHistory(historyRes.data);

      setShowVaccinationForm(false);
      setShowAddCitizenForm(false);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

    useEffect(() => {
    loadVaccines();
    loadRecentCitizens();
  }, []);

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

    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Health Worker Dashboard</h1>
        <Button 
          onClick={() => {
            setShowAddCitizenForm(!showAddCitizenForm);
            setShowVaccinationForm(false);
            setCitizen(null);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus size={18} className="mr-2" />
          {showAddCitizenForm ? "Cancel" : "Add New Citizen"}
        </Button>
      </div>

      
       {/* Search Section */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Search Citizen</h2>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              value={nic}
              onChange={e => setNic(e.target.value)}
              placeholder="Enter NIC Number"
              className="pl-10"
              onKeyPress={e => e.key === 'Enter' && search()}
            />
          </div>
          <Button onClick={search} className="bg-teal-600 hover:bg-teal-700">
            <Search size={18} className="mr-2" /> Search
          </Button>
        </div>
      </Card>



      {/* Recent Citizens Section - NEW */}
          {!citizen && !showAddCitizenForm && recentCitizens.length > 0 && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="mr-2" size={20} />
                Recent Citizens
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {recentCitizens.map(c => (
                  <Card
                    key={c.id}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-teal-500"
                    onClick={() => selectCitizen(c.nic!)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <UserCheck className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{c.fullname}</h3>
                        <p className="text-xs text-gray-500 truncate">{c.nic}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

      {/* Add Citizen Form */}
      {showAddCitizenForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <UserPlus className="mr-2" size={20} />
            Add New Citizen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullname">Full Name *</Label>
              <Input
                id="fullname"
                placeholder="Enter full name"
                value={citizenForm.fullname}
                onChange={e => setCitizenForm({ ...citizenForm, fullname: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={citizenForm.email}
                onChange={e => setCitizenForm({ ...citizenForm, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="nic">NIC Number *</Label>
              <Input
                id="nic"
                placeholder="e.g., 199012345678"
                value={citizenForm.nic}
                onChange={e => setCitizenForm({ ...citizenForm, nic: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={citizenForm.dob}
                onChange={e => setCitizenForm({ ...citizenForm, dob: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="07XXXXXXXX"
                value={citizenForm.phone}
                onChange={e => setCitizenForm({ ...citizenForm, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter address"
                value={citizenForm.address}
                onChange={e => setCitizenForm({ ...citizenForm, address: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={addCitizen} className="bg-blue-600 hover:bg-blue-700 text-white hover:text-cyan-200">
              <UserPlus size={16} className="mr-2" />
              Add Citizen
            </Button>
            <Button variant="outline" onClick={() => setShowAddCitizenForm(false)} className="text-white hover:text-cyan-200">
              Cancel
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * Default password will be: <strong>123456</strong> (Citizen can change it later)
          </p>
        </Card>
      )}

     

      {/* Citizen Information */}
      {citizen && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserCheck className="text-blue-600" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{citizen.fullname}</h2>
                  <p className="text-gray-500">NIC: {citizen.nic}</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setShowVaccinationForm(!showVaccinationForm);
                  setShowAddCitizenForm(false);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Syringe size={18} className="mr-2" />
                {showVaccinationForm ? "Cancel" : "Add Vaccination"}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-semibold">{citizen.dob || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-semibold">{citizen.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p className="font-semibold">{citizen.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{citizen.email || "N/A"}</p>
              </div>
            </div>
          </Card>

          {/* Add Vaccination Form */}
          {showVaccinationForm && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Add Vaccination Record</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vaccine">Vaccine *</Label>
                  <select
                    id="vaccine"
                    className="w-full border rounded p-2"
                    value={vaccinationForm.vaccine.id}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, vaccine: { id: Number(e.target.value) } })}
                  >
                    <option value="0">Select Vaccine</option>
                    {vaccines.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.totalDoses} doses)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="doseNumber">Dose Number *</Label>
                  <Input
                    id="doseNumber"
                    type="number"
                    min="1"
                    value={vaccinationForm.doseNumber}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, doseNumber: +e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="administrationDate">Administration Date *</Label>
                  <Input
                    id="administrationDate"
                    type="date"
                    value={vaccinationForm.administrationDate}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, administrationDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    placeholder="e.g., Pfizer, Moderna"
                    value={vaccinationForm.manufacturer}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, manufacturer: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="lotNumber">Lot Number *</Label>
                  <Input
                    id="lotNumber"
                    placeholder="Vaccine lot number"
                    value={vaccinationForm.lotNumber}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, lotNumber: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={vaccinationForm.expiryDate}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, expiryDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="providerOffice">Provider Office</Label>
                  <Input
                    id="providerOffice"
                    placeholder="Clinic/Hospital name"
                    value={vaccinationForm.providerOffice}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, providerOffice: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="visDate">VIS Date *</Label>
                  <Input
                    id="visDate"
                    type="date"
                    value={vaccinationForm.visDate}
                    onChange={e => setVaccinationForm({ ...vaccinationForm, visDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={submitVaccination} className="bg-green-600 hover:bg-green-700">
                  Save Vaccination Record
                </Button>
                <Button variant="outline" onClick={() => setShowVaccinationForm(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Vaccination History */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2" size={20} />
              Vaccination History
            </h3>
            
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
                      <th className="p-3 text-left">Lot Number</th>
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
                        <td className="p-3">{record.lotNumber}</td>
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
      )}

      {/* Empty State */}
      {!citizen && !showAddCitizenForm && (
        <Card className="p-12 text-center">
          <Search size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Search for a Citizen</h3>
          <p className="text-gray-400">Enter a citizen's NIC number to view their information and add vaccination records</p>
        </Card>
      )}
    </div>
    </div>
  );
}