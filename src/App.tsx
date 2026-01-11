//import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import HealthDashboard from './pages/HealthDashboard'
import CitizenDashboard from './pages/CitizenDashboard'
import HealthWorkerList from './pages/HealthWorkerList'
import HealthWorkerEdit from './pages/HealthWorkerEdit'
import VaccineManagement from './pages/VaccineManagement'
import Profile from './pages/Profile'
import Citizens from './pages/Citizens'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
//import { Button } from './components/ui/button'
//import  Citizens from './pages/Citizens'
//import Sidebar from './components/ui/layout/sidebar'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute allowed={["ROLE_ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/healthworkers" element={<HealthWorkerList />} />
        <Route path="/admin/healthworker/:id" element={<HealthWorkerEdit />} />
        <Route path="/admin/vaccines" element={<VaccineManagement />} />
      </Route>

      <Route element={<ProtectedRoute allowed={["ROLE_ADMIN", "ROLE_HEALTH_WORKER"]} />}>
        <Route path="/health" element={<HealthDashboard />} />
        <Route path="/citizens" element={<Citizens />} />
      </Route>

      <Route element={<ProtectedRoute allowed={["ROLE_CITIZEN"]} />}>
        <Route path="/citizen" element={<CitizenDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowed={["ROLE_ADMIN", "ROLE_HEALTH_WORKER", "ROLE_CITIZEN"]} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
