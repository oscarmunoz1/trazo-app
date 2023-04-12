import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Authenticated from "./utils/protections/Authenticated";
import CheckAuth from "./utils/protections/CheckAuth";
import DashboardView from "views/Dashboard/Dashboard";
// import DashboardView from "./views/Dashboard/Dashboard";
import NotAuthenticated from "./utils/protections/NotAuthenticated";
import ParcelView from "views/Dashboard/Parcel";
// import ParcelView from "./views/Dashboard/Parcel";
// import { Provider } from "react-redux";
import React from "react";
import SelectCompanyView from "views/Dashboard/SelectCompany";
// import RequireUser from "./components/Auth/requireUser";
import SignIn from "views/Authentication/SignIn/SignInBasic";
import SignUp from "views/Authentication/SignUp/SignUpBasic";
import VerifyEmail from "./views/Authentication/SignUp/VerifyEmail";

// import { store } from "./store";

const App = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route element={<CheckAuth />}>
        <Route element={<NotAuthenticated />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" exact element={<SignIn />} key={1} />
            <Route path="signup" exact key={2} element={<SignUp />} />
            <Route path="verifyemail" exact key={2} element={<VerifyEmail />} />
            {/* <Route
              path="/"
              element={() => <Navigate to="/auth/signin" replace />}
            /> */}
          </Route>
        </Route>
        <Route element={<Authenticated />}>
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route
              path="select-company"
              exact
              element={<SelectCompanyView />}
            />
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
              path="*"
              element={() => <Navigate to="/dashboard" replace />}
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
};

export default App;
