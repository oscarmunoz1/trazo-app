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

// import
// To be changed
// import Tables from "views/Dashboard/Tables.jsx";
import {
  CartIcon,
  DocumentIcon,
  HomeIcon,
  PersonIcon,
  StatsIcon,
} from "components/Icons/Icons";

import { BsFillClipboardCheckFill } from "react-icons/bs";

const dashRoutes = [
  {
    name: "Home",
    path: "/dashboard/establishment",
    icon: <HomeIcon color="inherit" />,
    authIcon: <HomeIcon color="inherit" />,
    layout: "/admin",
    collapse: true,
    isHome: true,
    isDashboard: true,
    regex: /^\/admin\/dashboard\/establishment\/[0-9]+(\/parcel\/[0-9]+)?$/,
  },
  {
    name: "Commercial Info",
    path: "/dashboard/establishment",
    icon: <BsFillClipboardCheckFill color="inherit" />,
    authIcon: <BsFillClipboardCheckFill color="inherit" />,
    layout: "/admin",
    collapse: true,
    isCommercial: true,
    regex: /^\/admin\/dashboard\/establishment\/[0-9]+\/commercial$/,
  },
  // {
  //   name: "Certifications",
  //   path: "/dashboard/certifications",
  //   icon: <BsFillClipboardCheckFill color="inherit" />,
  //   authIcon: <BsFillClipboardCheckFill color="inherit" />,
  //   layout: "/admin",
  //   collapse: true,
  //   isCertifications: true,
  //   regex: /^\/admin\/dashboard\/establishment\/[0-9]+\/certifications(\/parcels)?(\/events)?$/,
  //   items: [
  //     {
  //       name: "Parcels",
  //       path: "/dashboard/establishment/certifications/parcels",
  //       secondPath: (id) =>
  //         `/dashboard/establishment/${id}/certifications/parcels`,
  //       secondaryNavbar: true,
  //       layout: "/admin",
  //       regex: /^\/admin\/dashboard\/establishment\/[0-9]+\/certifications\/parcels$/,
  //     },
  //     {
  //       name: "Events",
  //       path: "/dashboard/establishment/certifications/events",
  //       secondPath: (id) =>
  //         `/dashboard/establishment/${id}/certifications/events`,
  //       secondaryNavbar: true,
  //       layout: "/admin",
  //       regex: /^\/admin\/dashboard\/establishment\/[0-9]+\/certifications\/events$/,
  //     },
  //   ],
  // },
  // {
  //   name: "Ecommerce",
  //   path: "/ecommerce",
  //   icon: <CartIcon color="inherit" />,
  //   collapse: true,

  //   items: [
  //     {
  //       name: "Products",
  //       path: "/products",
  //       collapse: true,
  //       authIcon: <DocumentIcon color="inherit" />,
  //       items: [
  //         {
  //           name: "New Product",
  //           component: NewProduct,
  //           secondaryNavbar: true,
  //           path: "/ecommerce/products/new-product",
  //           layout: "/admin",
  //         },
  //         {
  //           name: "Edit Product",
  //           component: EditProduct,
  //           path: "/ecommerce/products/edit-product",
  //           layout: "/admin",
  //         },
  //         {
  //           name: "Product Page",
  //           component: ProductPage,
  //           path: "/ecommerce/products/product-page",
  //           layout: "/admin",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Orders",
  //       path: "/orders",
  //       collapse: true,
  //       authIcon: <StatsIcon color="inherit" />,
  //       items: [
  //         {
  //           name: "Order List",
  //           component: OrderList,
  //           path: "/ecommerce/orders/order-list",
  //           layout: "/admin",
  //         },
  //         {
  //           name: "Order Details",
  //           component: OrderDetails,
  //           path: "/ecommerce/orders/order-details",
  //           layout: "/admin",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Authentication",
  //   path: "/authentication",
  //   icon: <PersonIcon color="inherit" />,
  //   collapse: true,
  //   items: [
  //     {
  //       name: "Sign In",
  //       path: "/authentication/sign-in",
  //       collapse: true,
  //       authIcon: <DocumentIcon color="inherit" />,
  //       items: [
  //         {
  //           name: "Basic",
  //           secondaryNavbar: true,
  //           component: SignInBasic,
  //           path: "/authentication/sign-in/basic",
  //           layout: "/auth",
  //         },
  //         {
  //           name: "Cover",
  //           component: SignInCover,
  //           path: "/authentication/sign-in/cover",
  //           layout: "/auth",
  //         },
  //         {
  //           name: "Illustration",
  //           component: SignInIllustration,
  //           path: "/authentication/sign-in/illustration",
  //           layout: "/auth",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Sign Up",
  //       path: "/authentication/sign-up",
  //       collapse: true,
  //       authIcon: <DocumentIcon color="inherit" />,
  //       items: [
  //         {
  //           name: "Basic",
  //           secondaryNavbar: true,
  //           component: SignUpBasic,
  //           path: "/authentication/sign-up/basic",
  //           layout: "/auth",
  //         },
  //         {
  //           name: "Cover",
  //           component: SignUpCover,
  //           path: "/authentication/sign-up/cover",
  //           layout: "/auth",
  //         },
  //         {
  //           name: "Illustration",
  //           component: SignUpIllustration,
  //           path: "/authentication/sign-up/illustration",
  //           layout: "/auth",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default dashRoutes;
