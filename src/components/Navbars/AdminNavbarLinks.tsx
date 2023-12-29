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

// Chakra Icons
import { BellIcon, SearchIcon } from '@chakra-ui/icons';
// Chakra Imports
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
// Custom Icons
import { ProfileIcon, SettingsIcon } from 'components/Icons/Icons';
import React, { useEffect } from 'react';

// Custom Components
import { ItemContent } from 'components/Menu/ItemContent';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import SidebarResponsive from 'components/Sidebar/SidebarResponsive';
// Assets
import avatar1 from 'assets/img/avatars/avatar1.png';
import avatar2 from 'assets/img/avatars/avatar2.png';
import avatar3 from 'assets/img/avatars/avatar3.png';
import { clearCurrentCompany } from 'store/features/companySlice';
import { clearUser } from 'store/features/userSlice';
import { logout as logoutAction } from 'store/features/authSlice';
import routes from 'routes.tsx';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from 'store/api/authApi';
import { useNavigate } from 'react-router-dom';

type HeaderLinksProps = {
  variant?: string;
  fixed?: boolean;
  secondary?: boolean;
  onOpen?: () => void;
  logoText?: string;
  children?: React.ReactNode;
};

export default function HeaderLinks(props: HeaderLinksProps) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Chakra Color Mode
  let mainTeal = useColorModeValue('green.400', 'green.400');
  let inputBg = useColorModeValue('white', 'gray.800');
  let mainText = useColorModeValue('gray.700', 'gray.200');
  let navbarIcon = useColorModeValue('gray.500', 'gray.200');
  let searchIcon = useColorModeValue('gray.700', 'gray.200');

  const [logout, { isLoading, isSuccess, error, isError }] = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(logoutAction());
      dispatch(clearCurrentCompany());
      dispatch(clearUser());
      setTimeout(() => {
        navigate('/auth/signin', { replace: true });
      }, 1);
    }
  }, [dispatch, isSuccess, navigate]);

  if (secondary) {
    navbarIcon = 'white';
    mainText = 'white';
  }
  const settingsRef = React.useRef();
  return (
    <Flex pe={{ sm: '0px', md: '16px' }} w={{ sm: '100%', md: 'auto' }} alignItems="center">
      <InputGroup
        cursor="pointer"
        bg={inputBg}
        borderRadius="15px"
        w={{
          sm: '60%',
          md: '200px'
        }}
        me={{ sm: 'auto', md: '20px' }}
        _focus={{
          borderColor: { mainTeal }
        }}
        _active={{
          borderColor: { mainTeal }
        }}>
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent'
              }}
              _focus={{
                boxShadow: 'none'
              }}
              icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}></IconButton>
          }
        />
        <Input
          fontSize="xs"
          py="11px"
          color={mainText}
          placeholder="Type here..."
          borderRadius="inherit"
        />
      </InputGroup>
      {/* <NavLink to="/auth/signin"> */}
      <Button
        ms="0px"
        px="0px"
        me={{ sm: '2px', md: '16px' }}
        color={navbarIcon}
        variant="transparent-with-icon"
        leftIcon={<ProfileIcon color={navbarIcon} w="22px" h="22px" me="0px" />}
        onClick={handleLogout}>
        <Text display={{ sm: 'none', md: 'flex' }}>Sign Out</Text>
      </Button>
      {/* </NavLink> */}
      <SidebarResponsive
        logoText={props.logoText}
        secondary={props.secondary}
        routes={routes}
        // logo={logo}
        {...rest}
      />
      <SettingsIcon
        cursor="pointer"
        me="16px"
        ref={settingsRef}
        onClick={props.onOpen}
        color={navbarIcon}
        w="18px"
        h="18px"
      />
      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w="18px" h="18px" />
        </MenuButton>
        <MenuList p="16px 8px">
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="13 minutes ago"
                info="from Alicia"
                boldInfo="New Message"
                aName="Alicia"
                aSrc={avatar1}
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="2 days ago"
                info="by Josh Henry"
                boldInfo="New Album"
                aName="Josh Henry"
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="3 days ago"
                info="Payment succesfully completed!"
                boldInfo=""
                aName="Kara"
                aSrc={avatar3}
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func
};
