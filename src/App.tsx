//import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import HealthDashboard from './pages/HealthDashboard'
import CitizenDashboard from './pages/CitizenDashboard'
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

      <Route element={<ProtectedRoute allowed={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowed={["ADMIN", "HEALTH_WORKER"]} />}>
        <Route path="/health" element={<HealthDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowed={["CITIZEN"]} />}>
        <Route path="/citizen" element={<CitizenDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
