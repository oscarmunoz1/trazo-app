import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { FaCircle } from 'react-icons/fa';
import { HSeparator } from 'components/Separator/Separator';
/*eslint-disable*/
import { HamburgerIcon } from '@chakra-ui/icons';
// ROUTES
import { HomeIcon } from 'components/Icons/Icons';
import IconBox from 'components/Icons/IconBox';
import Overview from 'views/Pages/Profile/Overview/index';
import { RootState } from 'store/index';
import SidebarHelp from './SidebarHelp';
import logo from 'assets/img/traceit.png';
import { useSelector } from 'react-redux';

type SidebarResponsiveProps = {
  display: string;
  logoText: string;
  routes: any;
  sidebarVariant: string;
  secondary: boolean;
};

function SidebarResponsive(props: SidebarResponsiveProps) {
  const [dynamicRoutes, setDynamicRoutes] = useState([]);
  const [certificationsRoutes, setCertificationsRoutes] = useState([]);
  const [commercialDynamicRoutes, setCommercialDynamicRoutes] = useState([]);
  // this is for the rest of the collapses
  //  BRAND
  //  Chakra Color Mode
  let hamburgerColor = useColorModeValue('gray.500', 'gray.200');
  let variantChange = '0.2s linear';
  // verifies if routeName is the one active (in browser input)

  // to check for active links and opened collapses
  let location = useLocation();

  const establishments = useSelector(
    (state: RootState) => state.company.currentCompany?.establishments
  );

  const mainPanel = React.useRef();
  const btnRef = React.useRef();
  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          layout: '/admin',
          isDashboard: true,
          regex: new RegExp(
            `^\\/admin\\/dashboard\\/establishment\\/${e.id}(\\/parcel\\/[0-9]+)?$`
          ),
          items: e?.parcels?.map((p) => {
            return {
              name: p.name,
              path: `/dashboard/establishment/${e.id}/parcel/${p.id}`,
              component: Overview,
              layout: '/admin',
              isDashboard: true,
              regex: new RegExp(
                `^\\/admin\\/dashboard\\/establishment\\/${e.id}\\/parcel\\/${p.id}$`
              )
            };
          })
        };
      });

    const certificationsRoutes = establishments && [
      {
        name: 'Parcels',
        path: `/dashboard/establishment/${establishments[0].id}/certifications/parcels`,
        secondaryNavbar: true,
        layout: '/admin',
        // regex: /^\/admin\/dashboard\/establishment\/[0-9]+\/certifications\/parcels$/,
        regex: new RegExp(
          `^\\/admin\\/dashboard\\/establishment\\/${establishments[0].id}\\/certifications\\/parcels$`
        )
      },
      {
        name: 'Events',
        path: `/dashboard/establishment/${establishments[0].id}/certifications/events`,
        secondaryNavbar: true,
        layout: '/admin',
        regex: new RegExp(
          `^\\/admin\\/dashboard\\/establishment\\/${establishments[0].id}\\/certifications\\/events$`
        )
      }
    ];

    const commercialDynamicRoutes =
      establishments &&
      establishments.map((e) => {
        return {
          name: e.name,
          path: `/dashboard/establishment/${e.id}/commercial`,
          establishmentId: e.id,
          authIcon: <HomeIcon color="inherit" />,
          regex: new RegExp(`^\\/admin\\/dashboard\\/establishment\\/${e.id}\\/commercial$`),
          layout: '/admin',
          items: []
        };
      });

    if (establishments) {
      setDynamicRoutes(dynamicRoutes);
      setCertificationsRoutes(certificationsRoutes);
      setCommercialDynamicRoutes(commercialDynamicRoutes);
    }
  }, [establishments]);

  const activeRoute = (regex) => {
    return regex.test(location.pathname);
  };

  const createAccordionLinks = (routes) => {
    let inactiveColor = useColorModeValue('gray.400', 'gray.400');
    let activeColor = useColorModeValue('gray.700', 'white');
    return routes?.map((prop, index) => {
      return (
        <NavLink to={prop.layout + prop.path}>
          <ListItem pt="5px" ms="26px" key={index}>
            <Text
              color={activeRoute(prop.regex) ? activeColor : inactiveColor}
              fontWeight={activeRoute(prop.regex) ? 'bold' : 'normal'}
              fontSize="sm">
              {prop.name}
            </Text>
          </ListItem>
        </NavLink>
      );
    });
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = useColorModeValue('green.400', 'green.400');
    let activeAccordionBg = useColorModeValue('white', 'gray.700');
    let inactiveBg = useColorModeValue('white', 'gray.700');
    let inactiveColorIcon = useColorModeValue('green.400', 'green.400');
    let activeColorIcon = useColorModeValue('white', 'white');
    let activeColor = useColorModeValue('gray.700', 'white');
    let inactiveColor = useColorModeValue('gray.400', 'gray.400');
    // Here are all the props that may change depending on sidebar's state.(Opaque or transparent)
    if (sidebarVariant === 'opaque') {
      inactiveBg = useColorModeValue('gray.100', 'gray.600');
      activeColor = useColorModeValue('gray.700', 'white');
      inactiveColor = useColorModeValue('gray.400', 'gray.400');
    }
    return routes?.map((prop, index) => {
      if (prop.category) {
        return (
          <>
            <Text
              fontSize={'md'}
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: '10px',
                xl: '16px'
              }}
              py="12px"
              key={index}>
              {prop.name}
            </Text>
            {createLinks(prop.items)}
          </>
        );
      }
      if (prop.collapse) {
        return (
          <Accordion allowToggle>
            <AccordionItem border="none">
              <AccordionButton
                display="flex"
                align="center"
                justify="center"
                key={index}
                borderRadius="15px"
                _focus={{ boxShadow: 'none' }}
                _hover={{ boxShadow: 'none' }}
                px={prop.icon ? null : '0px'}
                py={prop.icon ? '12px' : null}
                bg={activeRoute(prop.regex) && prop.icon ? activeAccordionBg : 'transparent'}>
                {activeRoute(prop.regex) ? (
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    transition={variantChange}
                    mx={{
                      xl: 'auto'
                    }}
                    px="0px"
                    borderRadius="15px"
                    _hover="none"
                    w="100%"
                    _active={{
                      bg: 'inherit',
                      transform: 'none',
                      borderColor: 'transparent'
                    }}>
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={activeBg}
                          color={activeColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}>
                          {prop.icon}
                        </IconBox>
                        {prop.establishmentId ? (
                          <NavLink color="red" to={prop.layout + prop.path}>
                            <Text color={activeColor} my="auto" fontSize="sm" display={'block'}>
                              {prop.name}
                            </Text>
                          </NavLink>
                        ) : (
                          <Text color={activeColor} my="auto" fontSize="sm" display={'block'}>
                            {prop.name}
                          </Text>
                        )}
                      </Flex>
                    ) : (
                      <HStack spacing={'22px'} ps="10px" ms="0px">
                        <Icon as={FaCircle} w="10px" color="green.400" />
                        <Text color={activeColor} my="auto" fontSize="sm">
                          {prop.name}
                        </Text>
                      </HStack>
                    )}
                  </Button>
                ) : (
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    mx={{
                      xl: 'auto'
                    }}
                    px="0px"
                    borderRadius="15px"
                    _hover="none"
                    w="100%"
                    _active={{
                      bg: 'inherit',
                      transform: 'none',
                      borderColor: 'transparent'
                    }}
                    _focus={{
                      boxShadow: 'none'
                    }}>
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={inactiveBg}
                          color={inactiveColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}>
                          {prop.icon}
                        </IconBox>
                        <Text color={inactiveColor} my="auto" fontSize="sm">
                          {prop.name}
                        </Text>
                      </Flex>
                    ) : (
                      <HStack spacing={'26px'} ps={'10px'} ms={'0px'}>
                        <Icon as={FaCircle} w="6px" color="green.400" />
                        {prop.establishmentId ? (
                          <NavLink color="red" to={prop.layout + prop.path}>
                            <Text color={inactiveColor} my="auto" fontSize="md" fontWeight="normal">
                              {prop.name}
                            </Text>
                          </NavLink>
                        ) : (
                          <Text color={inactiveColor} my="auto" fontSize="md" fontWeight="normal">
                            {prop.name}
                          </Text>
                        )}
                      </HStack>
                    )}
                  </Button>
                )}
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pe={prop.icon ? null : '0px'} pb="8px">
                {(dynamicRoutes || certificationsRoutes || commercialDynamicRoutes) && (
                  <List>
                    {
                      prop.icon
                        ? createLinks(
                            prop.isDashboard && !prop.items
                              ? dynamicRoutes
                              : prop.isCertifications
                              ? certificationsRoutes
                              : prop.isCommercial
                              ? commercialDynamicRoutes
                              : prop.items
                          ) // for bullet accordion links
                        : createAccordionLinks(
                            prop.isDashboard && !prop.items
                              ? dynamicRoutes
                              : prop.isCertifications
                              ? certificationsRoutes
                              : prop.isCommercial
                              ? commercialDynamicRoutes
                              : prop.items
                          ) // for non-bullet accordion links
                    }
                  </List>
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      } else {
        return (
          <NavLink to={prop.layout + prop.path}>
            {prop.icon ? (
              <Box>
                <HStack spacing="14px" py="15px" px="15px">
                  <IconBox
                    bg="green.400"
                    color="white"
                    h="30px"
                    w="30px"
                    transition={variantChange}>
                    {prop.icon}
                  </IconBox>
                  <Text
                    color={activeRoute(prop.regex) ? activeColor : inactiveColor}
                    fontWeight={activeRoute(prop.regex) ? 'bold' : 'normal'}
                    fontSize="sm">
                    {prop.name}
                  </Text>
                </HStack>
              </Box>
            ) : (
              <ListItem>
                <HStack spacing="22px" py="5px" px="10px">
                  <Icon
                    as={FaCircle}
                    w={activeRoute(prop.regex) ? '10px' : '6px'}
                    color="green.400"
                  />
                  <Text
                    color={activeRoute(prop.regex) ? activeColor : inactiveColor}
                    fontWeight={activeRoute(prop.regex) ? 'bold' : 'normal'}>
                    {prop.name}
                  </Text>
                </HStack>
              </ListItem>
            )}
          </NavLink>
        );
      }
    });
  };

  const { logoText, routes } = props;

  var links = <>{createLinks(routes)}</>;

  if (props.secondary === true) {
    hamburgerColor = 'white';
  }
  var brand = (
    <Box pt={'35px'} mb="8px">
      <Link
        href={`${import.meta.env.VITE_APP_BASE_URL}`}
        target="_blank"
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px">
        <Image src={logo} alt="trood image" height="30px" paddingRight="10px" href="" />
      </Link>
      <HSeparator />
    </Box>
  );

  // Color variables
  return (
    <Box ref={mainPanel} display={props.display}>
      <Box display={{ sm: 'block', xl: 'none' }}>
        <>
          <HamburgerIcon
            color={hamburgerColor}
            w="18px"
            h="18px"
            me="16px"
            ref={btnRef}
            colorScheme="teal"
            cursor="pointer"
            onClick={onOpen}
          />
          <Drawer placement={'left'} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
            <DrawerOverlay />
            <DrawerContent
              w="250px"
              maxW="250px"
              ms={{
                sm: '16px'
              }}
              my={{
                sm: '16px'
              }}
              borderRadius="16px">
              <DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
              <DrawerBody maxW="250px" px="1rem">
                <Box maxW="100%" h="100vh">
                  <Box mb="20px">{brand}</Box>
                  <Stack direction="column" mb="40px">
                    <Box>{links}</Box>
                  </Stack>
                  <SidebarHelp />
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      </Box>
    </Box>
  );
}

export default SidebarResponsive;
