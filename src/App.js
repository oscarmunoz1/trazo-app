import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import AddEstablishment from "views/Dashboard/Dashboard/Establishment/AddEstablishment";
import AddParcel from "views/Dashboard/Dashboard/Parcel/AddParcel";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Authenticated from "./utils/protections/Authenticated";
import Capture from "views/Scan/Capture/Capture";
import CertificationsView from "views/Dashboard/Certifications";
import CheckAuth from "./utils/protections/CheckAuth";
import CommercialView from "views/Dashboard/Commercial";
import DashboardView from "views/Dashboard/Dashboard";
import DetailEvent from "views/Dashboard/Dashboard/Event/DetailEvent";
import FinishProduction from "views/Dashboard/Dashboard/Production/FinishProduction";
import NotAuthenticated from "./utils/protections/NotAuthenticated";
import ParcelView from "views/Dashboard/Parcel";
import ProductDetail from "views/Scan/ProductDetail/ProductDetail";
import ProfileEstablishment from "views/Dashboard/Dashboard/Establishment/ProfileEstablishment";
import ProfileParcel from "views/Dashboard/Dashboard/Parcel/ProfileParcel";
import ProfileProduction from "views/Dashboard/Dashboard/Production/ProfileProduction";
import React from "react";
import SelectCompanyView from "views/Dashboard/SelectCompany";
import SignIn from "views/Authentication/SignIn/SignInIllustration";
import SignInApp from "views/Authentication/SignIn/SignInBasic";
import SignUp from "views/Authentication/SignUp/SignUpBasic";
import UpdateEvent from "views/Dashboard/Dashboard/Event/UpdateEvent";
import UpdateProduction from "views/Dashboard/Dashboard/Production/UpdateProduction";
import VerifyEmail from "./views/Authentication/SignUp/VerifyEmail";

const App = () => {
  const location = useLocation();
  const [subdomain, setSubDomain] = useState(null);

  useEffect(() => {
    const host = window.location.host; // gets the full domain of the app

    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) setSubDomain(arr[0]);
  }, []);

  return (
    <Routes>
      <Route element={<CheckAuth />}>
        <Route element={<NotAuthenticated />}>
          {subdomain ? (
            <>
              <Route
                path="/"
                element={<Navigate to="/auth/signin" replace />}
              />
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="signin" exact element={<SignInApp />} key={1} />
                <Route path="signup" exact key={2} element={<SignUp />} />
                <Route
                  path="verifyemail"
                  exact
                  key={2}
                  element={<VerifyEmail />}
                />
              </Route>
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="signin" exact element={<SignIn />} key={1} />
                <Route path="signup" exact key={2} element={<SignUp />} />
                <Route
                  path="verifyemail"
                  exact
                  key={2}
                  element={<VerifyEmail />}
                />
              </Route>
              <Route path="/" element={<AuthLayout />}>
                <Route path="capture" element={<Capture />} />
                <Route path="history/:historyId" element={<ProductDetail />} />
              </Route>
            </>
          )}
        </Route>
        <Route element={<Authenticated />}>
          {subdomain ? (
            <>
              <Route
                path="/"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="/admin/dashboard" element={<AdminLayout />}>
                <Route
                  path="select-company"
                  exact
                  element={<SelectCompanyView />}
                />

                {/* Establishment Routes */}

                <Route
                  path="establishment/add"
                  exact
                  element={<AddEstablishment />}
                />
                <Route
                  path="establishment/:establishmentId"
                  exact
                  element={<DashboardView />}
                />
                <Route
                  path="establishment/:establishmentId/change"
                  exact
                  element={<AddEstablishment isEdit={true} />}
                />
                <Route
                  path="establishment/:establishmentId/profile"
                  exact
                  element={<ProfileEstablishment />}
                />

                {/* Parcel Routes */}

                <Route
                  path="establishment/:establishmentId/parcel/add"
                  exact
                  element={<AddParcel />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId"
                  exact
                  element={<ParcelView />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/change"
                  exact
                  element={<AddParcel isEdit={true} />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/profile"
                  exact
                  element={<ProfileParcel />}
                />

                {/* Event Routes */}

                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/event/add"
                  exact
                  element={<UpdateEvent />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/event/:eventId"
                  exact
                  element={<DetailEvent />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/event/:eventId/change"
                  exact
                  element={<AddEstablishment isEdit={true} />}
                />

                {/* Production Routes */}

                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/production/add"
                  exact
                  element={<UpdateProduction />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/production/:productionId"
                  exact
                  element={<ProfileProduction />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/production/:productionId/change"
                  exact
                  element={<UpdateProduction isEdit={true} />}
                />
                <Route
                  path="establishment/:establishmentId/parcel/:parcelId/production/:productionId/finish"
                  exact
                  element={<FinishProduction />}
                />

                {/* Certification Routes */}

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
            </>
          ) : (
            <Route path="*" element={() => <Navigate to="/" replace />} />
          )}
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
