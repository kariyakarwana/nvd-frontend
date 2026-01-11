import { useEffect, useState } from "react";
import { getAllCitizens } from "@/api/vaccination";
import type { User, VaccinationRecord } from "@/lib/types";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Search, UserCheck, Calendar, Syringe, X, Phone, Mail, MapPin, Cake } from "lucide-react";
import api from "@/api/axios";

export default function Citizens() {
  const [citizens, setCitizens] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<User | null>(null);
  const [vaccinationHistory, setVaccinationHistory] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive" | "success">("default");

  useEffect(() => {
    loadCitizens();
  }, []);

  const loadCitizens = async () => {
    try {
      const res = await getAllCitizens();
      setCitizens(res.data);
    } catch (error: any) {
      setAlertMessage(`Error loading citizens: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const viewCitizenDetails = async (citizen: User) => {
    setSelectedCitizen(citizen);
    setLoading(true);
    
    try {
      const historyRes = await api.get(`/vaccination/${citizen.nic}`);
      setVaccinationHistory(historyRes.data);
    } catch (error: any) {
      console.error("Error loading vaccination history:", error);
      setVaccinationHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedCitizen(null);
    setVaccinationHistory([]);
  };

  const filtered = citizens.filter(c =>
    (c.nic && c.nic.toLowerCase().includes(search.toLowerCase())) || 
    (c.fullname && c.fullname.toLowerCase().includes(search.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.toLowerCase().includes(search.toLowerCase()))
  );

  const calculateAge = (dob?: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
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

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Citizens</h1>
              <p className="text-sm text-gray-500">Manage and view citizen records</p>
            </div>
            <div className="text-sm text-gray-600">
              Total Citizens: <span className="font-bold text-teal-600">{citizens.length}</span>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="p-4 mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input 
                  className="pl-10" 
                  placeholder="Search by NIC, Name, Email, or Phone"
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 px-6 text-white hover:text-cyan-200">
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </div>
          </Card>

          {/* Citizens Grid */}
          {!selectedCitizen ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length === 0 ? (
                <div className="col-span-full">
                  <Card className="p-12 text-center">
                    <UserCheck size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Citizens Found</h3>
                    <p className="text-gray-400">
                      {search ? "Try a different search term" : "No citizens have been registered yet"}
                    </p>
                  </Card>
                </div>
              ) : (
                filtered.map(citizen => (
                  <Card 
                    key={citizen.id} 
                    className="p-5 hover:shadow-lg transition-all cursor-pointer hover:border-teal-500"
                    onClick={() => viewCitizenDetails(citizen)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-teal-100 p-3 rounded-full">
                          <UserCheck className="text-teal-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{citizen.fullname}</h3>
                          <p className="text-sm text-gray-500">NIC: {citizen.nic}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mt-4">
                      {citizen.email && (
                        <div className="flex items-center text-gray-600">
                          <Mail size={14} className="mr-2" />
                          <span className="truncate">{citizen.email}</span>
                        </div>
                      )}
                      {citizen.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone size={14} className="mr-2" />
                          <span>{citizen.phone}</span>
                        </div>
                      )}
                      {citizen.address && (
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-2" />
                          <span className="truncate">{citizen.address}</span>
                        </div>
                      )}
                      {citizen.dob && (
                        <div className="flex items-center text-gray-600">
                          <Cake size={14} className="mr-2" />
                          <span>{calculateAge(citizen.dob)}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewCitizenDetails(citizen);
                      }}
                    >
                      View Details
                    </Button>
                  </Card>
                ))
              )}
            </div>
          ) : (
            /* Citizen Details View */
            <div className="space-y-6">
              {/* Header with Back Button */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-teal-100 p-4 rounded-full">
                      <UserCheck className="text-teal-600" size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCitizen.fullname}</h2>
                      <p className="text-gray-500">NIC: {selectedCitizen.nic}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={closeDetails}>
                    <X size={18} className="mr-2" /> Close
                  </Button>
                </div>

                {/* Citizen Information Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{selectedCitizen.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedCitizen.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-semibold">{selectedCitizen.dob || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold">{calculateAge(selectedCitizen.dob)}</p>
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-semibold">{selectedCitizen.address || "N/A"}</p>
                  </div>
                </div>
              </Card>

              {/* Vaccination History */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Vaccination History
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {vaccinationHistory.length} record(s)
                  </span>
                </h3>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading vaccination history...</p>
                  </div>
                ) : vaccinationHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Syringe size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No vaccination records found</p>
                    <p className="text-sm mt-2">This citizen has not received any vaccinations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Vaccination Cards for better mobile view */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {vaccinationHistory.map(record => (
                        <Card key={record.id} className="p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Syringe size={16} className="text-teal-600" />
                              <span className="font-bold">{record.vaccine?.name}</span>
                            </div>
                            <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded">
                              Dose {record.doseNumber}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">Date:</span> {record.administrationDate}</p>
                            <p><span className="text-gray-500">Manufacturer:</span> {record.manufacturer}</p>
                            <p><span className="text-gray-500">Lot:</span> {record.lotNumber}</p>
                            <p><span className="text-gray-500">Provider:</span> {record.providerName}</p>
                            {record.providerOffice && (
                              <p><span className="text-gray-500">Office:</span> {record.providerOffice}</p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Table for desktop view */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            <th className="p-3 text-left font-semibold">Vaccine</th>
                            <th className="p-3 text-left font-semibold">Dose</th>
                            <th className="p-3 text-left font-semibold">Date</th>
                            <th className="p-3 text-left font-semibold">Manufacturer</th>
                            <th className="p-3 text-left font-semibold">Lot Number</th>
                            <th className="p-3 text-left font-semibold">Provider</th>
                            <th className="p-3 text-left font-semibold">Office</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vaccinationHistory.map((record, index) => (
                            <tr 
                              key={record.id} 
                              className={`border-b hover:bg-gray-50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              <td className="p-3 font-semibold text-teal-700">
                                {record.vaccine?.name}
                              </td>
                              <td className="p-3">
                                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-semibold">
                                  {record.doseNumber}
                                </span>
                              </td>
                              <td className="p-3">{record.administrationDate}</td>
                              <td className="p-3">{record.manufacturer}</td>
                              <td className="p-3 font-mono text-xs">{record.lotNumber}</td>
                              <td className="p-3">{record.providerName}</td>
                              <td className="p-3">{record.providerOffice || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-teal-600">
                          {vaccinationHistory.length}
                        </p>
                        <p className="text-sm text-gray-500">Total Doses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {new Set(vaccinationHistory.map(r => r.vaccine?.name)).size}
                        </p>
                        <p className="text-sm text-gray-500">Unique Vaccines</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {vaccinationHistory.length > 0 
                            ? vaccinationHistory[vaccinationHistory.length - 1].administrationDate 
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">Last Vaccination</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}