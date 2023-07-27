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

// chakra imports
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
  useDisclosure,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  renderThumbDark,
  renderThumbLight,
  renderTrack,
  renderTrackRTL,
  renderView,
  renderViewRTL,
} from "components/Scrollbar/Scrollbar";

import { CreativeTimLogo } from "components/Icons/Icons";
import { FaCircle } from "react-icons/fa";
import { HSeparator } from "components/Separator/Separator";
/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
// ROUTES
import { HomeIcon } from "components/Icons/Icons";
import IconBox from "components/Icons/IconBox";
import Overview from "views/Pages/Profile/Overview/index";
import { Scrollbars } from "react-custom-scrollbars-2";
import { SidebarContext } from "contexts/SidebarContext";
import SidebarHelp from "./SidebarHelp";
import logo from "assets/img/traceit.png";
import { useSelector } from "react-redux";

function Sidebar(props) {
  // to check for active links and opened collapses
  let location = useLocation();

  // this is for the rest of the collapses

  const [dynamicRoutes, setDynamicRoutes] = useState([]);
  const [certificationsRoutes, setCertificationsRoutes] = useState([]);
  const [commercialDynamicRoutes, setCommercialDynamicRoutes] = useState([]);

  const establishments = useSelector(
    (state) => state.company.currentCompany?.establishments
  );
  const { sidebarWidth, setSidebarWidth, toggleSidebar } = React.useContext(
    SidebarContext
  );
  const mainPanel = React.useRef();

  let variantChange = "0.2s linear";

  const activeRoute = (regex) => {
    return regex.test(location.pathname);
  };

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
          layout: "/admin",
          isDashboard: true,
          regex: new RegExp(
            `^\\/admin\\/dashboard\\/establishment\\/${e.id}(\\/parcel\\/[0-9]+)?$`
          ),
          items: e?.parcels?.map((p) => {
            return {
              name: p.name,
              path: `/dashboard/establishment/${e.id}/parcel/${p.id}`,
              component: Overview,
              layout: "/admin",
              isDashboard: true,
              regex: new RegExp(
                `^\\/admin\\/dashboard\\/establishment\\/${e.id}\\/parcel\\/${p.id}$`
              ),
            };
          }),
        };
      });

    const certificationsRoutes = establishments && [
      {
        name: "Parcels",
        path: `/dashboard/establishment/${establishments[0].id}/certifications/parcels`,
        secondaryNavbar: true,
        layout: "/admin",
        regex: new RegExp(
          `^\\/admin\\/dashboard\\/establishment\\/${establishments[0].id}\\/certifications\\/parcels$`
        ),
      },
      {
        name: "Events",
        path: `/dashboard/establishment/${establishments[0].id}/certifications/events`,
        secondaryNavbar: true,
        layout: "/admin",
        regex: new RegExp(
          `^\\/admin\\/dashboard\\/establishment\\/${establishments[0].id}\\/certifications\\/events$`
        ),
      },
    ];

    const commercialDynamicRoutes =
      establishments &&
      establishments.map((e) => {
        return {
          name: e.name,
          path: `/dashboard/establishment/${e.id}/commercial`,
          establishmentId: e.id,
          authIcon: <HomeIcon color="inherit" />,
          regex: new RegExp(
            `^\\/admin\\/dashboard\\/establishment\\/${e.id}\\/commercial$`
          ),
          layout: "/admin",
          items: [],
        };
      });

    if (establishments) {
      setDynamicRoutes(dynamicRoutes);
      setCertificationsRoutes(certificationsRoutes);
      setCommercialDynamicRoutes(commercialDynamicRoutes);
    }
  }, [establishments]);

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = useColorModeValue("green.400", "green.400");
    let activeAccordionBg = useColorModeValue("white", "gray.700");
    let inactiveBg = useColorModeValue("white", "gray.700");
    let inactiveColorIcon = useColorModeValue("green.400", "green.400");
    let activeColorIcon = useColorModeValue("white", "white");
    let activeColor = useColorModeValue("gray.700", "white");
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
    // Here are all the props that may change depending on sidebar's state.(Opaque or transparent)
    if (sidebarVariant === "opaque") {
      activeBg = useColorModeValue("green.400", "green.400");
      inactiveBg = useColorModeValue("gray.100", "gray.600");
      activeColor = useColorModeValue("gray.700", "white");
      inactiveColor = useColorModeValue("gray.400", "gray.400");
      sidebarActiveShadow = "none";
    }
    return routes?.map((prop, index) => {
      if (prop.category) {
        return (
          <>
            <Text
              fontSize={sidebarWidth === 275 ? "md" : "xs"}
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
              key={index}
            >
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
                boxShadow={
                  activeRoute(prop.regex) && prop.icon
                    ? sidebarActiveShadow
                    : null
                }
                _hover={{
                  boxShadow:
                    activeRoute(prop.regex) && prop.icon
                      ? sidebarActiveShadow
                      : null,
                }}
                _focus={{
                  boxShadow: "none",
                }}
                borderRadius="15px"
                w={sidebarWidth === 275 ? "100%" : "77%"}
                px={prop.icon ? null : "0px"}
                py={prop.icon ? "12px" : null}
                bg={
                  activeRoute(prop.regex) && prop.icon
                    ? activeAccordionBg
                    : "transparent"
                }
              >
                {activeRoute(prop.regex) ? (
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    transition={variantChange}
                    mx={{
                      xl: "auto",
                    }}
                    px="0px"
                    borderRadius="15px"
                    w="100%"
                    _hover="none"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                      border: "none",
                    }}
                    _focus={{
                      transform: "none",
                      borderColor: "transparent",
                      border: "none",
                    }}
                  >
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={activeBg}
                          color={activeColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}
                        >
                          {prop.icon}
                        </IconBox>
                        <Text
                          color={activeColor}
                          my="auto"
                          fontSize="sm"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        >
                          {prop.name}
                        </Text>
                      </Flex>
                    ) : (
                      <HStack
                        spacing={sidebarWidth === 275 ? "22px" : "0px"}
                        ps={sidebarWidth === 275 ? "10px" : "0px"}
                        ms={sidebarWidth === 275 ? "0px" : "8px"}
                      >
                        <Icon
                          as={FaCircle}
                          w="10px"
                          color="green.400"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        />
                        {prop.establishmentId ? (
                          <NavLink color="red" to={prop.layout + prop.path}>
                            <Text color={activeColor} my="auto" fontSize="sm">
                              {sidebarWidth === 275 ? prop.name : prop.name[0]}
                            </Text>
                          </NavLink>
                        ) : (
                          <Text color={activeColor} my="auto" fontSize="sm">
                            {sidebarWidth === 275 ? prop.name : prop.name[0]}
                          </Text>
                        )}
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
                      xl: "auto",
                    }}
                    px="0px"
                    borderRadius="15px"
                    w="100%"
                    _hover="none"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      borderColor: "transparent",
                      boxShadow: "none",
                    }}
                  >
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={inactiveBg}
                          color={inactiveColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}
                          boxShadow={sidebarActiveShadow}
                          _hover={{ boxShadow: sidebarActiveShadow }}
                        >
                          {prop.icon}
                        </IconBox>
                        <Text
                          color={inactiveColor}
                          my="auto"
                          fontSize="sm"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        >
                          {prop.name}
                        </Text>
                      </Flex>
                    ) : (
                      <HStack
                        spacing={sidebarWidth === 275 ? "26px" : "0px"}
                        ps={sidebarWidth === 275 ? "10px" : "0px"}
                        ms={sidebarWidth === 275 ? "0px" : "8px"}
                      >
                        <Icon
                          as={FaCircle}
                          w="6px"
                          color="green.400"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        />
                        {prop.establishmentId ? (
                          <NavLink color="red" to={prop.layout + prop.path}>
                            <Text
                              color={inactiveColor}
                              my="auto"
                              fontSize="md"
                              fontWeight="normal"
                            >
                              {sidebarWidth === 275 ? prop.name : prop.name[0]}
                            </Text>
                          </NavLink>
                        ) : (
                          <Text
                            color={inactiveColor}
                            my="auto"
                            fontSize="md"
                            fontWeight="normal"
                          >
                            {sidebarWidth === 275 ? prop.name : prop.name[0]}
                          </Text>
                        )}
                      </HStack>
                    )}
                  </Button>
                )}
                <AccordionIcon
                  color="gray.400"
                  display={
                    prop.icon
                      ? sidebarWidth === 275
                        ? "block"
                        : "none"
                      : "block"
                  }
                  transform={
                    prop.icon
                      ? null
                      : sidebarWidth === 275
                      ? null
                      : "translateX(-70%)"
                  }
                />
              </AccordionButton>
              <AccordionPanel
                pe={prop.icon ? null : "0px"}
                pb="8px"
                ps={prop.icon ? null : sidebarWidth === 275 ? null : "8px"}
              >
                {(dynamicRoutes ||
                  certificationsRoutes ||
                  commercialDynamicRoutes) && (
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
                    transition={variantChange}
                  >
                    {prop.icon}
                  </IconBox>
                  <Text
                    color={
                      activeRoute(prop.regex) ? activeColor : inactiveColor
                    }
                    fontWeight={activeRoute(prop.regex) ? "bold" : "normal"}
                    fontSize="sm"
                  >
                    {prop.name}
                  </Text>
                </HStack>
              </Box>
            ) : (
              <ListItem>
                <HStack
                  spacing={
                    sidebarWidth === 275
                      ? activeRoute(prop.regex)
                        ? "22px"
                        : "26px"
                      : "8px"
                  }
                  py="5px"
                  px={sidebarWidth === 275 ? "10px" : "0px"}
                >
                  <Icon
                    as={FaCircle}
                    w={activeRoute(prop.regex) ? "10px" : "6px"}
                    color="green.400"
                    display={sidebarWidth === 275 ? "block" : "none"}
                  />
                  <Text
                    color={
                      activeRoute(prop.regex) ? activeColor : inactiveColor
                    }
                    fontWeight={activeRoute(prop.regex) ? "bold" : "normal"}
                  >
                    {sidebarWidth === 275 ? prop.name : prop.name[0]}
                  </Text>
                </HStack>
              </ListItem>
            )}
          </NavLink>
        );
      }
    });
  };

  const createAccordionLinks = (routes) => {
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let activeColor = useColorModeValue("gray.700", "white");
    return routes?.map((prop, index) => {
      return (
        <NavLink to={prop.layout + prop.path}>
          <ListItem
            pt="5px"
            ms={sidebarWidth === 275 ? "26px" : "0px"}
            key={index}
          >
            <Text
              mb="4px"
              color={activeRoute(prop.regex) ? activeColor : inactiveColor}
              fontWeight={activeRoute(prop.regex) ? "bold" : "normal"}
              fontSize="sm"
            >
              {sidebarWidth === 275 ? prop.name : prop.name[0]}
            </Text>
          </ListItem>
        </NavLink>
      );
    });
  };
  const { logoText, routes, sidebarVariant } = props;
  let isWindows = navigator.platform.startsWith("Win");

  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = "none";
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";
  if (sidebarVariant === "opaque") {
    sidebarBg = useColorModeValue("white", "gray.700");
    sidebarRadius = "16px";
    sidebarMargins = "16px 0px 16px 16px";
  }
  let brand = (
    <Box pt={"25px"} mb="12px">
      <Link
        href={`${process.env.PUBLIC_URL}/#/`}
        target="_blank"
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px"
      >
        <Image
          src={logo}
          alt="traceit logo"
          height="30px"
          paddingRight="10px"
          href=""
        />
      </Link>
      <HSeparator />
    </Box>
  );
  let links = <>{createLinks(routes)}</>;
  let sidebarContent = (
    <Box>
      <Box mb="20px">{brand}</Box>
      <Stack direction="column" mb="40px">
        <Box>{links}</Box>
      </Stack>
      <SidebarHelp sidebarWidth={sidebarWidth} />
    </Box>
  );

  // SIDEBAR
  return (
    <Box
      ref={mainPanel}
      onMouseEnter={
        toggleSidebar
          ? () => setSidebarWidth(sidebarWidth === 120 ? 275 : 120)
          : null
      }
      onMouseLeave={
        toggleSidebar
          ? () => setSidebarWidth(sidebarWidth === 275 ? 120 : 275)
          : null
      }
    >
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w={`${sidebarWidth}px`}
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
        >
          {isWindows ? (
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={useColorModeValue(
                renderThumbLight,
                renderThumbDark
              )}
              renderView={renderView}
            >
              {sidebarContent}
            </Scrollbars>
          ) : (
            <Box id="sidebarScrollRemove" overflowY="scroll" height="100vh">
              {sidebarContent}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
