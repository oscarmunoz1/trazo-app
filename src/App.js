import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Authenticated from "./utils/protections/Authenticated";
import CertificationsView from "views/Dashboard/Certifications";
import CheckAuth from "./utils/protections/CheckAuth";
import CommercialView from "views/Dashboard/Commercial";
import DashboardView from "views/Dashboard/Dashboard";
import NotAuthenticated from "./utils/protections/NotAuthenticated";
import ParcelView from "views/Dashboard/Parcel";
import React from "react";
import SelectCompanyView from "views/Dashboard/SelectCompany";
import SignIn from "views/Authentication/SignIn/SignInBasic";
import SignUp from "views/Authentication/SignUp/SignUpBasic";
import VerifyEmail from "./views/Authentication/SignUp/VerifyEmail";

const App = () => (
  <Routes>
    <Route element={<CheckAuth />}>
      <Route element={<NotAuthenticated />}>
        <Route path="/" element={<Navigate to="/auth/signin" replace />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signin" exact element={<SignIn />} key={1} />
          <Route path="signup" exact key={2} element={<SignUp />} />
          <Route path="verifyemail" exact key={2} element={<VerifyEmail />} />
        </Route>
      </Route>
      <Route element={<Authenticated />}>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route path="select-company" exact element={<SelectCompanyView />} />
          <Route
            path="establishment/:establishmentId"
            exact
            element={<DashboardView />}
          />
          <Route
            path="establishment/:establishmentId/parcel/:parcelId"
            exact
            element={<ParcelView />}
          />
          <Route
            path="establishment/:establishmentId/parcel/:parcelId"
            exact
            element={<CommercialView />}
          />
          <Route
            path="establishment/:establishmentId/certifications/parcels"
            exact
            element={<CertificationsView />}
          />
          <Route
            path="establishment/:establishmentId/certifications/events"
            exact
            element={<CertificationsView />}
          />
          <Route
            path="establishment/:establishmentId/commercial"
            exact
            element={<CommercialView />}
          />
          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Route>
      </Route>
      <Route
        path="*"
        element={() => <Navigate to="/admin/dashboard" replace />}
      />
    </Route>
  </Routes>
);

export default App;
