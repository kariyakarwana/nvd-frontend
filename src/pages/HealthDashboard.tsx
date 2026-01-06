import { useState } from "react";
import api from "../api/axios";

export default function HealthDashboard() {
  const [nic, setNic] = useState("");
  const [citizen, setCitizen] = useState<any>(null);
  const [error, setError] = useState("");

  const search = async () => {
    try {
      setError("");
      const response = await api.get(`/citizen/search/${nic}`);
      setCitizen(response.data);
    } catch (err: any) {
      setError(err.response?.data || "Citizen not found");
      setCitizen(null);
    }
  };
  return (
   <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Search Citizen by NIC</h2>
      <input
        type="text"
        placeholder="Enter NIC"
        value={nic}
        onChange={(e) => setNic(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={search}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {citizen && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p><strong>Name:</strong> {citizen.fullname}</p>
          <p><strong>NIC:</strong> {citizen.nic}</p>
          <p><strong>Address:</strong> {citizen.address}</p>
          <p><strong>Phone:</strong> {citizen.phone}</p>
          <p><strong>Date of Birth:</strong> {citizen.dob}</p>
        </div>
      )}
    </div>
  )
}
