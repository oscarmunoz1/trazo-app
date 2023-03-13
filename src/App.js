import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
// import Authenticated from "./utils/protections/Authenticated";
// import CheckAuth from "./utils/protections/CheckAuth";
// import DashboardView from "./views/Dashboard/Dashboard";
// import NotAuthenticated from "./utils/protections/NotAuthenticated";
// import ParcelView from "./views/Dashboard/Parcel";
// import { Provider } from "react-redux";
import React from "react";

// import RequireUser from "./components/Auth/requireUser";
// import SignIn from "./views/Auth/SignIn";
// import SignUp from "./views/Auth/SignUp";
// import VerifyEmail from "./views/Auth/VerifyEmail";
// import { store } from "./store";

const App = () => {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />} />
      <Route path="/admin" element={<AdminLayout />} />
      <Route
        path="/"
        element={() => <Navigate to="/admin/dashboard" replace />}
      />
    </Routes>
  );
};

export default App;
