/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import I18n from 'i18n/I18n';
import { Provider } from 'react-redux';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { store } from './store';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

const root = createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <I18n>
        <SubscriptionProvider>
          <App />
        </SubscriptionProvider>
      </I18n>
    </BrowserRouter>
  </Provider>
);
