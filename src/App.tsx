import { CONSUMER, PRODUCER, SUPERUSER } from './config';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AddEstablishment from 'views/Dashboard/Dashboard/Establishment/AddEstablishment';
import AddParcel from 'views/Dashboard/Dashboard/Parcel/AddParcel';
import AdminLayout from 'layouts/Admin';
import AuthLayout from 'layouts/Auth';
import Authenticated from './utils/protections/Authenticated';
import Capture from 'views/Scan/Capture/Capture';
import CertificationsView from 'views/Dashboard/Certifications';
import CheckAuth from './utils/protections/CheckAuth';
import CommercialView from 'views/Dashboard/Commercial';
import DashboardView from 'views/Dashboard/Dashboard';
import DetailEvent from 'views/Dashboard/Dashboard/Event/DetailEvent';
import FinishProduction from 'views/Dashboard/Dashboard/Production/FinishProduction';
import NotAuthenticated from './utils/protections/NotAuthenticated';
import ParcelView from 'views/Dashboard/Parcel';
import Pricing from 'views/Pages/Pricing/index';
import ProductDetail from 'views/Scan/ProductDetail/ProductDetail';
import ProductReview from 'views/Scan/ProductReview/ProductReview';
import ProfileEstablishment from 'views/Dashboard/Dashboard/Establishment/ProfileEstablishment';
import ProfileParcel from 'views/Dashboard/Dashboard/Parcel/ProfileParcel';
import ProfileProduction from 'views/Dashboard/Dashboard/Production/ProfileProduction';
import ProfileUser from 'views/Dashboard/Dashboard/User/ProfileUser';
import React from 'react';
import SelectCompanyView from 'views/Dashboard/Dashboard/Company/AddCompany';
import SettingsView from 'views/Dashboard/Settings';
import SignIn from 'views/Authentication/SignIn/SignInIllustration';
import SignInApp from 'views/Authentication/SignIn/SignInBasic';
import SignUp from 'views/Authentication/SignUp/SignUpBasic';
import Unauthorized from './views/Applications/DataTables/index';
import UpdateEvent from 'views/Dashboard/Dashboard/Event/UpdateEvent';
import UpdateProduction from 'views/Dashboard/Dashboard/Production/UpdateProduction';
import VerifyEmail from './views/Authentication/SignUp/VerifyEmail';
import { useSelector } from 'react-redux';
import VerifyEmailConsumer from 'views/Authentication/SignUp/VerifyEmailConsumer';
import SignInConsumer from 'views/Authentication/SignIn/SignInConsumer';
import SignUpConsumer from 'views/Authentication/SignUp/SignUpConsumer';
import AdminConsumerLayout from 'layouts/AdminConsumer';
import ConsumerDashboardView from 'views/Dashboard/ConsumerDashboard';
import ScannedProductsView from 'views/Dashboard/ScannedProducts';
import ReviewsListView from 'views/Dashboard/ReviewsList';

const App = () => {
  const location = useLocation();
  const [subdomain, setSubDomain] = useState<string>('');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoadingAuth = useSelector((state) => state.auth.isLoading);
  const currentUser = useSelector((state) => state.userState.user);

  useEffect(() => {
    const host = window.location.host;
    const arr = host
      .split('.')
      .slice(0, host.includes(import.meta.env.VITE_APP_BASE_DOMAIN) ? -1 : -2);

    if (arr.length > 0) {
      if (arr[0] === 'app') {
        setSubDomain('producer');
      } else if (arr[0] === 'consumer') {
        setSubDomain('consumer');
      } else {
        setSubDomain('');
      }
    }
  }, []);

  return (
    <Routes>
      <Route element={<CheckAuth />}>
        <Route element={<AuthLayout />}>
          {subdomain === 'producer' ? (
            <>
              <Route path="/auth">
                <Route path="signin" exact element={<SignInApp />} key={1} />
                <Route path="signup" exact key={2} element={<SignUp />} />
                <Route path="verifyemail" exact key={2} element={<VerifyEmail />} />
              </Route>
              <Route path="*" exact element={<Navigate to="/admin/dashboard" replace />} />
            </>
          ) : subdomain === 'consumer' ? (
            <>
              <Route path="/auth">
                <Route path="signin" exact element={<SignInConsumer />} key={1} />
                <Route path="signup" exact key={2} element={<SignUpConsumer />} />
                <Route path="verifyemail" exact key={2} element={<VerifyEmail />} />
              </Route>
              <Route path="*" exact element={<Navigate to="/admin/dashboard/scans" replace />} />
            </>
          ) : (
            <>
              <Route path="/auth">
                <Route path="signin" exact element={<SignIn />} key={1} />
                <Route path="signup" exact key={2} element={<SignUp />} />
                <Route path="verifyemail" exact key={2} element={<VerifyEmail />} />
              </Route>
              <Route path="*" exact element={<Navigate to="/pricing" replace />} />
            </>
          )}
          <Route path="/capture" element={<Capture />} />
          <Route path="/production/:productionId" exact element={<ProductDetail />} />
        </Route>
        {subdomain === 'producer' && (
          <Route element={<Authenticated allowedRoles={[PRODUCER, SUPERUSER]} />}>
            <>
              <Route path="/admin/dashboard" element={<AdminLayout />}>
                <Route path="select-company" exact element={<SelectCompanyView />} />

                {/* Profile Routes */}

                <Route path="profile" exact element={<ProfileUser />} />

                {/* Establishment Routes */}

                <Route path="establishment/add" exact element={<AddEstablishment />} />
                <Route path="establishment/:establishmentId" exact element={<DashboardView />} />
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
              </Route>
            </>
          </Route>
        )}
        {subdomain === 'producer' && (
          <Route
            element={
              <Authenticated allowedRoles={[PRODUCER, SUPERUSER]} mustBeCompanyAdmin={true} />
            }>
            {subdomain && (
              <>
                {/* Company Routes */}
                <Route path="/admin/dashboard" element={<AdminLayout />}>
                  <Route path="settings" exact element={<SettingsView />} />
                </Route>
              </>
            )}
          </Route>
        )}
        {subdomain === 'consumer' && (
          <Route element={<Authenticated allowedRoles={[CONSUMER]} />}>
            <Route path="/admin/dashboard/*" element={<AdminConsumerLayout />}>
              <Route index element={<Navigate to="scans" replace />} />
              <Route path="scans" element={<ScannedProductsView />} />
              <Route path="reviews" element={<ReviewsListView />} />
            </Route>
            <Route path="capture" element={<Capture />} />
            <Route path="production/:productionId" element={<ProductDetail />} />
            <Route path="production/:productionId/review/:scanId" element={<ProductReview />} />
          </Route>
        )}
        <Route element={<NotAuthenticated />}>
          {subdomain === 'producer' ? (
            <>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="signin" exact element={<SignInApp />} key={1} />
                <Route path="signup" exact key={2} element={<SignUp />} />
                <Route path="verifyemail" exact key={2} element={<VerifyEmail />} />
              </Route>
            </>
          ) : subdomain === 'consumer' ? (
            <>
              <Route path="/capture" element={<Capture />} />
              <Route path="/production/:productionId" exact element={<ProductDetail />} />
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="signin" exact element={<SignIn />} key={1} />
                <Route path="signup" exact key={2} element={<SignUp />} />
                <Route path="verifyemail" exact key={2} element={<VerifyEmail />} />
              </Route>
            </>
          ) : (
            <Route path="*" element={() => <Navigate to="/" replace />} />
          )}
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/pricing" exact element={<Pricing />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
