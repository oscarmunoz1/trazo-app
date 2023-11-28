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

import "assets/css/pud-dashboard-styles.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Chakra imports
import { Box, ChakraProvider, Portal } from "@chakra-ui/react";
import { Outlet, Route } from "react-router-dom";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar";
import Footer from "components/Footer/Footer";
import React from "react";
import theme from "theme/theme.js";

export default function Pages(props) {
  const { ...rest } = props;
  // ref for the wrapper div
  const wrapper = React.createRef();
  const dynamicRoutes = [];
  React.useEffect(() => {
    document.body.style.overflow = "unset";
    // Specify how to clean up after this effect:
    return function cleanup() {};
  });
  const getActiveRoute = (routes) => {
    let activeRoute = "Home";
    for (let i = 0; i < routes?.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes?.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(
          routes[i].isDashboard ? dynamicRoutes : routes[i].items
        );
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(
          routes[i].isDashboard ? dynamicRoutes : routes[i].items
        );
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].secondaryNavbar;
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      if (prop.collapse) {
        return getRoutes(prop.isDashboard ? dynamicRoutes : prop.items);
      }
      if (prop.category) {
        return getRoutes(prop.isDashboard ? dynamicRoutes : prop.items);
      } else {
        return null;
      }
    });
  };
  const navRef = React.useRef();
  document.documentElement.dir = "ltr";
  document.documentElement.layout = "auth";
  return (
    <ChakraProvider theme={theme} resetCss={false} w="100%">
      <Box ref={navRef} w="100%">
        <Portal containerRef={navRef}>
          <AuthNavbar secondary={false} logoText="traceit" />
        </Portal>
        <Box w="100%">
          <Box ref={wrapper} w="100%">
            <Outlet />
          </Box>
        </Box>
        <Box px="24px" mx="auto" width="1044px" maxW="100%">
          <Footer />
        </Box>
      </Box>
    </ChakraProvider>
  );
}
