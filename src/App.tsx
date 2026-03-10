import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import AdminLoginPage from "./pages/AdminLoginPage";

import AdminRoleRoute from "@/layouts/AdminRoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route
          element={
            <AdminRoleRoute allowedRoles={["SUPER_ADMIN", "OUTLET_ADMIN"]} />
          }
        >
          <Route
            path="/admin/dashboard"
            element={<div>Admin Dashboard</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;