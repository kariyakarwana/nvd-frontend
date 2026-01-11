import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LogOut, 
  User, 
  ChevronDown,
  UserCheck,
  Syringe,
  Users,
  Settings,
  Shield
} from "lucide-react";
import api from "@/api/axios";
import type { User as UserType } from "@/lib/types";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<UserType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getHomeRoute = () => {
    if (role === "ROLE_ADMIN") return "/admin";
    if (role === "ROLE_HEALTH_WORKER") return "/health";
    if (role === "ROLE_CITIZEN") return "/citizen";
    return "/";
  };

  const getRoleName = () => {
    if (role === "ROLE_ADMIN") return "Admin";
    if (role === "ROLE_HEALTH_WORKER") return "Health Worker";
    if (role === "ROLE_CITIZEN") return "Citizen";
    return "User";
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(getHomeRoute())}>
              <div className="bg-teal-600 p-2 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">NVD System</h1>
                <p className="text-xs text-gray-500">National Vaccination Database</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={location.pathname === getHomeRoute() ? "default" : "ghost"}
                onClick={() => navigate(getHomeRoute())}
                className={location.pathname === getHomeRoute() ? "bg-teal-600" : " hover:text-teal-200 text-white"}
              >
                <Home size={16} className="mr-2" />
                Home
              </Button>

              {role === "ROLE_ADMIN" && (
                <>
                  <Button
                    variant={location.pathname === "/admin/healthworkers" ? "default" : "ghost"}
                    onClick={() => navigate("/admin/healthworkers")}
                    className={location.pathname === "/admin/healthworkers" ? "bg-teal-600" : " hover:text-teal-200 text-white"}
                  >
                    <UserCheck size={16} className="mr-2" />
                    Health Workers
                  </Button>
                  <Button
                    variant={location.pathname === "/admin/vaccines" ? "default" : "ghost"}
                    onClick={() => navigate("/admin/vaccines")}
                    className={location.pathname === "/admin/vaccines" ? "bg-teal-600" : " hover:text-teal-200 text-white"}
                  >
                    <Syringe size={16} className="mr-2" />
                    Vaccines
                  </Button>
                </>
              )}

              {(role === "ROLE_ADMIN" || role === "ROLE_HEALTH_WORKER") && (
                <Button
                  variant={location.pathname === "/citizens" ? "default" : "ghost"}
                  onClick={() => navigate("/citizens")}
                  className={location.pathname === "/citizens" ? "bg-teal-600" : " text-white hover:text-teal-200"}
                >
                  <Users size={16} className="mr-2" />
                  Citizens
                </Button>
              )}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-green-200">
                    {user?.fullname || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{getRoleName()}</p>
                </div>
                <div className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                  {getInitials(user?.fullname)}
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.fullname || "User"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-white text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-white mt-0.5 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}