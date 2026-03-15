import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"

import LandingPage from "./pages/LandingPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import CustomerLoginPage from "./pages/CustomerLoginPage"
import RegisterPage from "./pages/RegisterPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import SetPasswordPage from "./pages/SetPasswordPage"
import EmailVerifiedPage from "./pages/EmailVerifiedPage"
import GoogleCallbackPage from "./pages/GoogleCallbackPage"
import { UsersPage } from "./pages/UsersPage"

import AdminOrdersPage from "./pages/AdminOrdersPage"
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage"

import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/auth/login" element={<CustomerLoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/set-password" element={<SetPasswordPage />} />
        <Route path="/auth/email-verified" element={<EmailVerifiedPage />} />
        <Route path="/auth/google-callback" element={<GoogleCallbackPage />} />

        {/* ================= ADMIN ROUTES ================= */}

        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />

        <Route path="/admin/users" element={<UsersPage />} />

        {/* PCS-120 Admin Orders List */}
        <Route path="/admin/orders" element={<AdminOrdersPage />} />

        {/* PCS-121 Admin Order Detail */}
        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />

      </Routes>

      <Toaster />

    </BrowserRouter>
  )
}

export default App