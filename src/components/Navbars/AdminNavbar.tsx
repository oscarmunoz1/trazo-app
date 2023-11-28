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

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

import AdminNavbarLinks from './AdminNavbarLinks';
import PropTypes from 'prop-types';
import { SidebarContext } from 'contexts/SidebarContext';

type AdminNavbarProps = {
  brandText: string;
  variant: string;
  secondary: boolean;
  fixed: boolean;
  children: React.ReactNode;
  onOpen: () => void;
  logoText: string;
};

export default function AdminNavbar(props: AdminNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { sidebarWidth } = useContext(SidebarContext);
  const { variant, children, fixed, secondary, brandText, onOpen, ...rest } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue('gray.700', 'gray.200');
  let secondaryText = useColorModeValue('gray.400', 'gray.200');
  let navbarPosition = 'absolute';
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(21px)';
  let navbarShadow = 'none';
  let navbarBg = 'none';
  let navbarBorder = 'transparent';
  let secondaryMargin = '0px';
  let paddingS = '15px';
  let paddingX = '15px';
  if (props.fixed === true)
    if (scrolled === true) {
      navbarPosition = 'fixed';
      navbarShadow = useColorModeValue('0px 7px 23px rgba(0, 0, 0, 0.05)', 'none');
      navbarBg = useColorModeValue(
        'linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
        'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
      );
      navbarBorder = useColorModeValue('#FFFFFF', 'rgba(255, 255, 255, 0.31)');
      navbarFilter = useColorModeValue('none', 'drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))');
    }
  if (props.secondary) {
    navbarBackdrop = 'none';
    navbarPosition = 'absolute';
    mainText = 'white';
    secondaryText = 'white';
    secondaryMargin = '22px';
    paddingS = '40px';
    paddingX = '30px';
  }
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  window.addEventListener('scroll', changeNavbar);
  return (
    <Flex
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      borderRadius="16px"
      display="flex"
      minH="75px"
      left={''}
      right={'30px'}
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      px={{
        sm: paddingX,
        md: '30px'
      }}
      ps={{
        sm: paddingS,
        md: '20px'
      }}
      pt="8px"
      top="18px"
      w={{
        sm: 'calc(100vw - 30px)',
        xl: `calc(100vw - 75px - ${sidebarWidth}px)`
      }}>
      <Flex
        w="100%"
        flexDirection={{
          sm: 'column',
          md: 'row'
        }}
        alignItems={{ xl: 'center' }}>
        <Box mb={{ sm: '8px', md: '0px' }}>
          <Breadcrumb>
            <BreadcrumbItem color={mainText}>
              <BreadcrumbLink href="/admin/dashboard/" color={secondaryText}>
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={mainText}>
              <BreadcrumbLink href="#" color={mainText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func
};
