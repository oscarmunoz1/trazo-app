import { CONSUMER, PRODUCER, SUPERUSER } from './config';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';

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
import { routeConfig } from './routes/config';
import SubscriptionRequired from './utils/protections/SubscriptionRequired';
import DashboardPricing from 'views/Dashboard/Dashboard/Pricing';
import SubscriptionSuccess from 'views/Dashboard/Dashboard/Subscription/SubscriptionSuccess';
import StripeSuccessRedirect from 'views/Dashboard/Dashboard/Subscription/StripeSuccessRedirect';
import PlanUsage from 'views/Dashboard/PlanUsage';
import Billing from 'views/Pages/Account/Billing';
import NoSubscriptionRedirect from './utils/protections/NoSubscriptionRedirect';
import NewProduction from 'views/Dashboard/Dashboard/components/forms/NewProduction';
import CarbonDashboard from 'views/Dashboard/Dashboard/Establishment/CarbonDashboard';
import IoTDashboard from 'views/Dashboard/Dashboard/Establishment/IoTDashboard';

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
      if (arr[0] === 'app') setSubDomain('producer');
      else if (arr[0] === 'consumer') setSubDomain('consumer');
      else setSubDomain('');
    }
  }, []);

  if (!subdomain) {
    return null; // or a loading spinner
  }

  const config = routeConfig[subdomain];

  if (!config) {
    return <Navigate to="/pricing" replace />;
  }

  console.log(config);

  return (
    <Routes>
      {/* Public Pricing Page - Available without authentication */}
      <Route path="/pricing" element={<AuthLayout />}>
        <Route index element={<Pricing />} />
      </Route>

      <Route element={<CheckAuth />}>
        {/* Public Routes */}
        <Route element={<NotAuthenticated />}>
          <Route element={<AuthLayout />}>
            <Route path={config?.auth.path}>
              <Route path="signin" element={config?.auth.signin && <config.auth.signin />} />
              <Route path="signup" element={config?.auth.signup && <config.auth.signup />} />
              <Route
                path="verifyemail"
                element={config?.auth.verifyEmail && <config.auth.verifyEmail />}
              />
            </Route>
          </Route>
        </Route>

        {/* Protected Routes */}
        {subdomain === 'producer' && (
          <Route element={<Authenticated allowedRoles={config.protected.roles} />}>
            <Route path={config.protected.path} element={<AdminLayout />}>
              {/* Routes accessible without subscription */}
              <Route path="select-company" element={<SelectCompanyView />} />
              <Route path="pricing" element={<DashboardPricing />} />
              <Route path="account/billing" element={<Billing />} />
              <Route path="stripe-success" element={<StripeSuccessRedirect />} />

              {/* Routes requiring subscription */}
              <Route element={<SubscriptionRequired />}>
                <Route
                  index
                  element={
                    <NoSubscriptionRedirect>
                      <DashboardView />
                    </NoSubscriptionRedirect>
                  }
                />
                <Route path="profile" element={<ProfileUser />} />
                <Route path="establishment/add" element={<AddEstablishment />} />
                <Route
                  path="establishment/:establishmentId"
                  exact
                  element={
                    <NoSubscriptionRedirect>
                      <DashboardView />
                    </NoSubscriptionRedirect>
                  }
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
                  element={<UpdateEvent isEdit={true} />}
                />
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
                <Route path="settings" exact element={<SettingsView />} />
                <Route path="subscription/success" element={<SubscriptionSuccess />} />
                <Route path="plan-usage" element={<PlanUsage />} />
                <Route
                  path="establishment/:establishmentId/carbon"
                  exact
                  element={
                    <NoSubscriptionRedirect>
                      <CarbonDashboard />
                    </NoSubscriptionRedirect>
                  }
                />
                <Route
                  path="establishment/:establishmentId/iot"
                  exact
                  element={
                    <NoSubscriptionRedirect>
                      <IoTDashboard />
                    </NoSubscriptionRedirect>
                  }
                />
              </Route>
            </Route>
          </Route>
        )}

        {subdomain === 'consumer' && (
          <>
            <Route element={<AuthLayout />}>
              <Route path="/production/:productionId" element={<ProductDetail />} />
            </Route>
            <Route element={<Authenticated allowedRoles={config.protected.roles} />}>
              <Route path={config.protected.path} element={<AdminConsumerLayout />}>
                {/* Consumer routes */}
                <Route index element={<Navigate to="scans" replace />} />
                <Route path="scans" element={<ScannedProductsView />} />
                <Route path="reviews" element={<ReviewsListView />} />
                <Route path="production/:productionId/review/:scanId" element={<ProductReview />} />
              </Route>
            </Route>
          </>
        )}

        {/* Default redirect based on subdomain */}
        <Route path="*" element={<Navigate to={config?.defaultRedirect || '/pricing'} replace />} />
      </Route>
    </Routes>
  );
};

export default App;
