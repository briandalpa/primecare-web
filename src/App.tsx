import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GeolocationProvider from '@/features/geolocation/GeolocationProvider';

import LandingPage from './pages/LandingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SetPasswordPage from './pages/SetPasswordPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import ForbiddenPage from './pages/ForbiddenPage';

import UserManagementPage from './pages/UserManagementPage';
import OrderOverviewPage from './pages/OrderOverviewPage';
import CreateOrderPage from './pages/CreateOrderPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import AdminPickupRequestsPage from './pages/AdminPickupRequestsPage';

import OrderListPage from './pages/OrderListPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import CustomerOrderDetailPage from './pages/CustomerOrderDetailPage';

import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AddressManagementPage from './pages/AddressManagementPage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminOutletsPage from './pages/AdminOutletsPage';
import AdminBypassRequestPage from './pages/AdminBypassRequestPage';
import AdminOutletFormPage from './pages/AdminOutletFormPage';
import AdminShiftsPage from './pages/AdminShiftsPage';

import WorkerDashboardPage from '@/pages/WorkerDashboardPage';
import WorkerHistoryPage from '@/pages/WorkerHistoryPage';
import WorkerOrderProcessPage from '@/pages/WorkerOrderProcessPage';

import WorkerLayout from './layouts/WorkerLayout';
import DriverLayout from './layouts/DriverLayout';
import DriverDashboardPage from './pages/DriverDashboardPage';
import DriverHistory from './features/driver/DriverHistory';
import DriverActiveOrder from './features/driver/DriverActiveOrder';
import DriverProfile from './features/driver/DriverProfile';

import { Toaster } from '@/components/ui/sonner';
import CreatePickupPage from './pages/CreatePickupPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import NotFoundPage from './pages/NotFoundPage';
import CustomerComplaintListPage from './pages/CustomerComplaintListPage';
import CustomerComplaintDetailPage from './pages/CustomerComplaintDetailPage';
import AdminComplaintManagementPage from './pages/AdminComplaintManagementPage';

export default function App() {
  return (
    <GeolocationProvider>
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
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="orders" element={<OrderOverviewPage />} />
          <Route path="orders/create" element={<CreateOrderPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="pickup-requests" element={<AdminPickupRequestsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="outlets" element={<AdminOutletsPage />} />
          <Route path="outlets/new" element={<AdminOutletFormPage />} />
          <Route path="outlets/:id/edit" element={<AdminOutletFormPage />} />
          <Route path="shifts" element={<AdminShiftsPage />} />
          <Route path="bypass-requests" element={<AdminBypassRequestPage />} />
          <Route path="complaints" element={<AdminComplaintManagementPage />} />
        </Route>

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route element={<CustomerLayout />}>
          <Route path="/home" element={<CustomerDashboardPage />} />
          <Route path="/addresses" element={<AddressManagementPage />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/orders/:id" element={<CustomerOrderDetailPage />} />
          <Route path="/pickup/create" element={<CreatePickupPage />} />
          <Route path="/orders/:id/pay" element={<PaymentPage />} />
          <Route path="/orders/:id/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/orders/:id/payment-failure" element={<PaymentFailurePage />} />
          <Route path="/complaints" element={<CustomerComplaintListPage />} />
          <Route path="/complaints/:id" element={<CustomerComplaintDetailPage />} />
        </Route>

        {/* ================= WORKER ROUTES ================= */}
        <Route path="/worker" element={<WorkerLayout />}>
          <Route index element={<WorkerDashboardPage />} />
          <Route path="dashboard" element={<WorkerDashboardPage />} />
          <Route path="history" element={<WorkerHistoryPage />} />
          <Route path="orders/:id/process" element={<WorkerOrderProcessPage />} />
        </Route>

        {/* ================= DRIVER ROUTES ================= */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<DriverDashboardPage />} />
          <Route path="dashboard" element={<DriverDashboardPage />} />
          <Route path="active" element={<DriverActiveOrder />} />
          <Route path="history" element={<DriverHistory />} />
          <Route path="profile" element={<DriverProfile />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
    </GeolocationProvider>
  );
}
