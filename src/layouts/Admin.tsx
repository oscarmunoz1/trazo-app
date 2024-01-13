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

import 'assets/css/pud-dashboard-styles.css';
import 'react-quill/dist/quill.snow.css'; // ES6
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Chakra imports
import { ChakraProvider, Portal, useDisclosure } from '@chakra-ui/react';
import { Outlet, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// Layout components
import AdminNavbar from 'components/Navbars/AdminNavbar';
import Configurator from 'components/Configurator/Configurator';
import FixedPlugin from 'components/FixedPlugin/FixedPlugin';
import Footer from 'components/Footer/Footer.tsx';
import { HomeIcon } from 'components/Icons/Icons';
// Custom components
import MainPanel from 'components/Layout/MainPanel';
import Overview from 'views/Pages/Profile/Overview/index';
import PanelContainer from 'components/Layout/PanelContainer';
import PanelContent from 'components/Layout/PanelContent';
import { RootState } from 'store/index';
import Sidebar from 'components/Sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { Route as TypeRoute } from '../types/common';
// import { dynamicRoutes } from "components/Sidebar/Sidebar";
import routes from '../routes';
// Custom Chakra theme
import theme from 'theme/theme';
import { useSelector } from 'react-redux';

export default function Dashboard(props: any) {
  const { ...rest } = props;
  // states and functions
  const [sidebarVariant, setSidebarVariant] = useState('transparent');
  const [fixed, setFixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(275);

  const [dynamicRoutes, setDynamicRoutes] = useState([]);
  const establishments = useSelector(
    (state: RootState) => state.company.currentCompany?.establishments
  );

  // functions for changing the states from components

  useEffect(() => {
    const dynamicRoutes =
      establishments &&
      establishments.map((e) => {
        return {
          name: e.name,
          path: `/dashboard/establishment/${e.id}`,
          collapse: true,
          establishmentId: e.id,
          authIcon: <HomeIcon color="inherit" />,
          regex: /^\/dashboard\/establishment\/[0-9]+(\/parcel\/[0-9]+)?$/,
          layout: '/admin',
          items: e?.parcels?.map((p) => {
            return {
              name: p.name,
              path: `/dashboard/establishment/${e.id}/parcel/${p.id}`,
              component: Overview,
              layout: '/admin',
              regex: /^\/dashboard\/establishment\/[0-9]+\/parcel\/[0-9]+$/
            };
          })
        };
      });
    if (establishments) {
      setDynamicRoutes(dynamicRoutes);
    }
  }, [establishments]);

  // ref for main panel div
  const mainPanel = React.createRef();

  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };

  const getActiveRoute = (routes: TypeRoute[]): string => {
    let activeRoute = 'Home';
    for (let i = 0; i < routes?.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(
          routes[i].isDashboard ? dynamicRoutes : routes[i].items
        );
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(
          routes[i].isDashboard ? dynamicRoutes : routes[i].items
        );
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes: TypeRoute[]): boolean => {
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
        if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].secondaryNavbar ? true : false;
        }
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes: TypeRoute[]): (React.ReactElement | null)[] => {
    return routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
      }
      // if (prop.isCommercial) {
      //   return getRoutes(dynamicRoutes);
      // }
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  type HTMLDocumentElement = HTMLElement & {
    dir: string;
    layout: string;
  };

  const htmlDocumentElement = document.documentElement as HTMLDocumentElement;

  htmlDocumentElement.dir = 'ltr';
  htmlDocumentElement.layout = 'admin';
  // Chakra Color Mode
  return (
    <ChakraProvider theme={theme} resetCss={false} overflow="scroll">
      <SidebarContext.Provider
        value={{
          sidebarWidth,
          setSidebarWidth,
          toggleSidebar,
          setToggleSidebar
        }}>
        <Sidebar
          routes={routes}
          logoText={''}
          display="none"
          sidebarVariant={sidebarVariant}
          {...rest}
        />
        <MainPanel
          ref={mainPanel}
          w={{
            base: '100%',
            xl: `calc(100% - ${sidebarWidth}px)`
          }}>
          <Portal padding="0">
            <AdminNavbar
              onOpen={onOpen}
              brandText={getActiveRoute(routes)}
              secondary={getActiveNavbar(routes)}
              fixed={fixed}
              {...rest}
            />
          </Portal>

          {getRoute() ? (
            <PanelContent
              paddingInlineStart={{ base: '0px', lg: '15px' }}
              paddingInlineEnd={{ base: '0px', lg: '15px' }}>
              <PanelContainer padding={{ base: '0px', lg: '30px 15px' }}>
                <Outlet />
              </PanelContainer>
            </PanelContent>
          ) : null}
          <Footer />
          <Portal>
            <FixedPlugin fixed={fixed} onOpen={onOpen} />
          </Portal>
          <Configurator
            secondary={getActiveNavbar(routes)}
            isOpen={isOpen}
            onClose={onClose}
            isChecked={fixed}
            onSwitch={(value) => {
              setFixed(value);
            }}
            onOpaque={() => setSidebarVariant('opaque')}
            onTransparent={() => setSidebarVariant('transparent')}
          />
        </MainPanel>
      </SidebarContext.Provider>
    </ChakraProvider>
  );
}
