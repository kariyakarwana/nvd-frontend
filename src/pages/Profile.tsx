import { useState, useEffect } from "react";
import api from "../api/axios";
import type { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCircle, Lock } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive" | "success" | "warning" | "info" | "cyan">("default");
  const [profileForm, setProfileForm] = useState({
    fullname: "",
    dob: "",
    title: "",
    phone: "",
    address: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
      setProfileForm({
        fullname: res.data.fullname || "",
        dob: res.data.dob || "",
        title: res.data.title || "",
        phone: res.data.phone || "",
        address: res.data.address || ""
      });
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/user/profile", profileForm);
      setAlertMessage("Profile updated successfully");
      setAlertVariant("success");
      setTimeout(() => setAlertMessage(null), 5000);
      loadProfile();
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlertMessage("New passwords do not match");
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlertMessage("Password must be at least 6 characters long");
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    try {
      await api.put("/user/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setAlertMessage("Password changed successfully");
      setAlertVariant("success");
      setTimeout(() => setAlertMessage(null), 5000);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (error: any) {
      setAlertMessage(`Error: ${error.response?.data?.message || error.message}`);
      setAlertVariant("destructive");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {alertMessage && (
        <Alert variant={alertVariant} className="mb-6">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Profile Information Card */}
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-teal-100 p-4 rounded-full">
              <UserCircle className="text-teal-600" size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.fullname || "No Name"}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-400 capitalize">
                {user.role.replace("ROLE_", "").replace("_", " ").toLowerCase()}
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={profileForm.fullname}
                onChange={e => setProfileForm({ ...profileForm, fullname: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profileForm.dob}
                onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
              />
            </div>

            {user.role === "ROLE_HEALTH_WORKER" && (
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={profileForm.title}
                  onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                  placeholder="e.g., Nurse, Doctor, Medical Officer"
                />
              </div>
            )}

            {user.role === "ROLE_CITIZEN" && (
              <>
                <div>
                  <Label htmlFor="nic">NIC Number (Read Only)</Label>
                  <Input
                    id="nic"
                    value={user.nic || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="07XXXXXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileForm.address}
                    onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
              </>
            )}

            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 hover:text-cyan-200">
              Update Profile
            </Button>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lock size={20} className="text-gray-600" />
              <h3 className="font-bold text-lg ">Change Password</h3>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-white hover:text-cyan-200"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                />
              </div>

              {passwordForm.newPassword && passwordForm.confirmPassword && 
               passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}

              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700"
                disabled={passwordForm.newPassword !== passwordForm.confirmPassword}
              >
                Change Password
              </Button>
            </form>
          )}

          {!showPasswordForm && (
            <p className="text-sm text-gray-500 mt-2">
              Keep your account secure by using a strong password
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}