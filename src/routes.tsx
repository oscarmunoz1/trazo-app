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

import { BsFillClipboardCheckFill } from 'react-icons/bs';
import { HomeIcon } from 'components/Icons/Icons';
import { Route } from 'types/common';

const dashRoutes: Route[] = [
  {
    name: 'Home',
    path: '/dashboard/establishment',
    icon: <HomeIcon color="inherit" />,
    authIcon: <HomeIcon color="inherit" />,
    layout: '/admin',
    collapse: true,
    isHome: true,
    isDashboard: true,
    regex: /^\/admin\/dashboard\/establishment\/[0-9]+(\/parcel\/[0-9]+)?$/,
    items: []
  },
  {
    name: 'Commercial Info',
    path: '/dashboard/establishment',
    icon: <BsFillClipboardCheckFill color="inherit" />,
    authIcon: <BsFillClipboardCheckFill color="inherit" />,
    layout: '/admin',
    collapse: true,
    isCommercial: true,
    regex: /^\/admin\/dashboard\/establishment\/[0-9]+\/commercial$/,
    items: []
  }
];

export default dashRoutes;
