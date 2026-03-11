import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SetPasswordPage from './pages/SetPasswordPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';

import { RoleRoute } from '@/features/auth/RoleRoute';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/auth/login" element={<CustomerLoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/set-password" element={<SetPasswordPage />} />
        <Route path="/auth/email-verified" element={<EmailVerifiedPage />} />
        <Route path="/auth/google-callback" element={<GoogleCallbackPage />} />

        {/* Admin Protected Routes */}
        <Route
          element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'OUTLET_ADMIN']} />}
        >
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
