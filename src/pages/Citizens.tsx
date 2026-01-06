import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"

const data = [
  { name: "Saman Perera", nic: "198512345678", phone: "0771234567", address: "123 Temple Road, Colombo" },
  { name: "Kamala Silva", nic: "199098765432", phone: "0719876543", address: "45 Galle Road, Kalutara" },
  { name: "Nimali Fernando", nic: "199545678901", phone: "0765432109", address: "89 Kandy Road, Gampaha" },
]

export default function Citizens() {
  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Citizens</h1>
          <p className="text-sm text-gray-400">Manage and view citizens records</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus size={16} className="mr-1" /> Add Citizen
        </Button>
      </div>

      <Card className="p-6">
        <div className="relative mb-4 w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <Input placeholder="Search by ID or Name..." className="pl-8" />
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Name</th>
              <th>National ID (NIC)</th>
              <th>Contact Number</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.nic} className="border-b last:border-0">
                <td className="py-3 font-medium">{c.name}</td>
                <td className="text-center">{c.nic}</td>
                <td className="text-center">{c.phone}</td>
                <td>{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
