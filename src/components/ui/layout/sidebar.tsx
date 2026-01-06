import { Home, Users, User, LogOut, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import clsx from "clsx"

const menu = [
  { name: "Dashboard", icon: Home },
  { name: "Citizens", icon: Users, active: true },
  { name: "Profile", icon: User },
]

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <Shield className="text-teal-600" />
        <div>
          <h2 className="font-bold text-lg">My NVD</h2>
          <p className="text-xs text-gray-400">Tracking wellness for life</p>
        </div>
      </div>

      <nav className="px-4 space-y-1">
        {menu.map((item) => (
          <div key={item.name}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-lg text-sm cursor-pointer",
              item.active ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:bg-gray-100"
            )}>
            <item.icon size={18} />
            {item.name}
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/100" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Dr. Ruwan Jayasinghe</p>
            <p className="text-xs text-gray-400">Health worker</p>
          </div>
        </div>

        <button className="w-full flex items-center gap-2 text-red-500 border border-red-200 rounded-lg p-2 text-sm hover:bg-red-50">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
