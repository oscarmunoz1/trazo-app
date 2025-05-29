import AddEstablishment from 'views/Dashboard/Dashboard/Establishment/AddEstablishment';
import DashboardView from 'views/Dashboard/Dashboard';
import ProfileEstablishment from 'views/Dashboard/Dashboard/Establishment/ProfileEstablishment';
import CarbonDashboard from 'views/Dashboard/Dashboard/Establishment/CarbonDashboard';
import IoTDashboard from 'views/Dashboard/Dashboard/Establishment/IoTDashboard';
import React from 'react';
import { Route } from 'react-router-dom';

const EstablishmentRoutes = () => (
  <>
    <Route path="establishment/add" exact element={<AddEstablishment />} />
    <Route path="establishment/:establishmentId" exact element={<DashboardView />} />
    <Route
      path="establishment/:establishmentId/change"
      exact
      element={<AddEstablishment isEdit={true} />}
    />
    <Route path="establishment/:establishmentId/profile" exact element={<ProfileEstablishment />} />
    <Route path="establishment/:establishmentId/carbon" exact element={<CarbonDashboard />} />
    <Route path="establishment/:establishmentId/iot" exact element={<IoTDashboard />} />
  </>
);

export default EstablishmentRoutes;
