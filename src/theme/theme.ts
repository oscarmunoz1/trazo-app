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

import { CardBodyComponent } from './additions/card/CardBody';
import { CardComponent } from './additions/card/Card';
import { CardFooterComponent } from './additions/card/CardFooter';
import { CardHeaderComponent } from './additions/card/CardHeader';
import { MainPanelComponent } from './additions/layout/MainPanel';
import { PanelContainerComponent } from './additions/layout/PanelContainer';
import { PanelContentComponent } from './additions/layout/PanelContent';
import { badgeStyles } from './components/badge';
import { breakpoints } from './foundations/breakpoints';
import { buttonStyles } from './components/button';
import { drawerStyles } from './components/drawer';
import { extendTheme } from '@chakra-ui/react';
import { globalStyles } from './styles';
import { linkStyles } from './components/link';

// import { mode } from "@chakra-ui/theme-tools";
export default extendTheme(
  { breakpoints }, // Breakpoints
  globalStyles,
  buttonStyles, // Button styles
  badgeStyles, // Badge styles
  linkStyles, // Link styles
  drawerStyles, // Sidebar variant for Chakra's drawer
  CardComponent, // Card component
  CardBodyComponent, // Card Body component
  CardFooterComponent, // Card Footer component
  CardHeaderComponent, // Card Header component
  MainPanelComponent, // Main Panel component
  PanelContentComponent, // Panel Content component
  PanelContainerComponent // Panel Container component
);
