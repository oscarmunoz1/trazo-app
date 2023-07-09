// Chakra imports
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, useLocation, useMatch, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  barChartDataCharts1,
  barChartOptionsCharts1,
  lineBarChartData,
  lineBarChartOptions,
} from "variables/charts";

import BarChart from "components/Charts/BarChart";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { HomeIcon } from "components/Icons/Icons.js";
import { IoIosArrowDown } from "react-icons/io";
import LineBarChart from "components/Charts/LineBarChart";
import LineChart from "components/Charts/LineChart";
import MiniStatistics from "../Dashboard/components/MiniStatistics";
import Reviews from "./components/Reviews";
import SalesByCountry from "./components/SalesByCountry";
import SalesOverview from "./components/SalesOverview";
import { scansData } from "variables/general";
import { useSelector } from "react-redux";

// Custom icons
// assets

export default function CommercialView() {
  const textColor = useColorModeValue("gray.700", "white");
  const { establishmentId } = useParams();

  const [currentEstablishmentId, setCurrentEstablishmentId] = useState(null);
  const [establishment, setEstablishment] = useState(null);
  const [currentView, setCurrentView] = useState(null);

  const cardColor = useColorModeValue("white", "gray.700");

  const establishments = useSelector(
    (state) => state.company.currentCompany?.establishments
  );

  // to check for active links and opened collapses
  let location = useLocation();

  const iconBoxInside = useColorModeValue("white", "white");
  let mainText = useColorModeValue("gray.700", "gray.200");

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName, isDashboard = false) => {
    if (isDashboard) {
      return location.pathname.startsWith(routeName) ? "active" : "";
    }
    return location.pathname === routeName ? "active" : "";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let establishment;
    if (establishments) {
      establishment = establishments.filter(
        (establishment) => establishment.id.toString() === establishmentId
      )[0];
      setCurrentEstablishmentId(establishmentId);
      setEstablishment(establishment);
    }
  }, [establishmentId, establishments]);

  const parcelsMatch = useMatch("certifications/parcels");
  const eventsMatch = useMatch("certifications/events");

  useEffect(() => {
    if (parcelsMatch) {
      setCurrentView("parcels");
    } else if (eventsMatch) {
      setCurrentView("events");
    } else {
      setCurrentView("parcels");
    }
  }, [parcelsMatch, eventsMatch]);

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <Text
        color={mainText}
        href="#"
        bg="inherit"
        borderRadius="inherit"
        fontWeight="bold"
        padding="10px"
      >
        Establishments
      </Text>
      <SimpleGrid columns={{ sm: 2, md: 3, xl: 4 }} spacing="24px">
        {establishments ? (
          establishments.map((prop, key) => (
            <NavLink
              to={`/admin/dashboard/establishment/${prop.id}/certifications/${currentView}`}
            >
              <MiniStatistics
                key={key}
                isSelected={prop.id === establishment?.id}
                title={prop.name}
                amount={`${prop.city || prop.zone || ""}, ${prop.state}`}
                percentage={55}
                icon={<HomeIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
              />
            </NavLink>
          ))
        ) : (
          <Card minH="115px" bg={cardColor} />
        )}
      </SimpleGrid>
      <Flex
        mt={"20px"}
        mb={"20px"}
        w={"100%"}
        gap="20px"
        flexDirection={"column"}
      >
        <Flex flexDirection={"column"}>
          <Flex
            direction={{ sm: "column", md: "row" }}
            justify="space-between"
            align="center"
            w="100%"
          >
            <Flex gap="24px">
              <Flex flexDirection={"column"}>
                <Stack
                  direction="row"
                  spacing="10px"
                  alignSelf={{ sm: "flex-start", lg: "flex-end" }}
                >
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IoIosArrowDown />}
                      color="gray.700"
                      w="155px"
                      h="35px"
                      bg="#fff"
                      fontSize="xs"
                    >
                      ALL PARCELS
                    </MenuButton>
                    <MenuList>
                      <MenuItem color="gray.500">All</MenuItem>
                      <MenuDivider />
                      <MenuItem color="gray.500">Parcel #1</MenuItem>
                      <MenuItem color="gray.500">Parcel #2</MenuItem>
                      <MenuItem color="gray.500">Parcel #3</MenuItem>
                    </MenuList>
                  </Menu>
                </Stack>
              </Flex>
              <Flex flexDirection={"column"}>
                <Stack
                  direction="row"
                  spacing="10px"
                  alignSelf={{ sm: "flex-start", lg: "flex-end" }}
                >
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IoIosArrowDown />}
                      color="gray.700"
                      w="155px"
                      h="35px"
                      bg="#fff"
                      fontSize="xs"
                    >
                      ALL PRODUCTS
                    </MenuButton>
                    <MenuList>
                      <MenuItem color="gray.500">All</MenuItem>
                      <MenuDivider />
                      <MenuItem color="gray.500">Banana</MenuItem>
                      <MenuItem color="gray.500">Potato</MenuItem>
                      <MenuItem color="gray.500">Apple</MenuItem>
                    </MenuList>
                  </Menu>
                </Stack>
              </Flex>
              <Flex flexDirection={"column"}>
                <Stack
                  direction="row"
                  spacing="10px"
                  alignSelf={{ sm: "flex-start", lg: "flex-end" }}
                >
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IoIosArrowDown />}
                      color="gray.700"
                      w="155px"
                      h="35px"
                      bg="#fff"
                      fontSize="xs"
                    >
                      ALL PRODUCTIONS
                    </MenuButton>
                    <MenuList>
                      <MenuItem color="gray.500">All</MenuItem>
                      <MenuDivider />
                      <MenuItem color="gray.500">20/03/2021</MenuItem>
                      <MenuItem color="gray.500">20/07/2021</MenuItem>
                      <MenuItem color="gray.500">20/09/2021</MenuItem>
                    </MenuList>
                  </Menu>
                </Stack>
              </Flex>
            </Flex>
            <Stack
              direction="row"
              spacing="10px"
              alignSelf={{ sm: "flex-start", lg: "flex-end" }}
            >
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<IoIosArrowDown />}
                  color="gray.700"
                  w="125px"
                  h="35px"
                  bg="#fff"
                  fontSize="xs"
                >
                  THIS WEEK
                </MenuButton>
                <MenuList>
                  <MenuItem color="gray.500">This week</MenuItem>
                  <MenuItem color="gray.500">This month</MenuItem>
                  <MenuItem color="gray.500">This year</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
          {/* <Card px="0px">
            <CardBody overflowX={{ sm: "scroll", "2xl": "hidden" }}> */}
          {/* <Grid
              gap={{ sm: "50px", "2xl": "70px" }}
              templateColumns={{ sm: "repeat(12, 1fr)", lg: "repeat(12, 1fr)" }}
            > */}

          {/* </Grid> */}
          {/* </CardBody>
          </Card> */}
        </Flex>
        <Flex flexDirection={"row"} gap="24px">
          <Flex flex={1}>
            <SalesByCountry
              title={"Scans"}
              labels={["Date", "Product", "Location", "Parcel", "Comment"]}
              salesData={scansData}
            />
          </Flex>
          <Flex flexDirection={"column"} flex={2} gap={"24px"}>
            {/* <SalesOverview
              title={"Numbers of scans and sales"}
              percentage={5}
              chart={
                <LineChart
                  chartData={lineChartDataDefault}
                  chartOptions={lineChartOptionsDefault}
                />
              }
            /> */}
            <Flex flex={1}>
              <Card px="0px" pb="0px">
                <CardHeader mb="34px" px="22px">
                  <Text color={textColor} fontSize="lg" fontWeight="bold">
                    Numbers of scans and sales
                  </Text>
                </CardHeader>
                <CardBody h="100%">
                  <Box w="100%" h="100%">
                    <LineBarChart
                      chartData={lineBarChartData}
                      chartOptions={lineBarChartOptions}
                    />
                  </Box>
                </CardBody>
              </Card>
            </Flex>
            <Flex flex={1}>
              <Card px="0px" pb="0px" minH="390px">
                <CardHeader mb="34px" px="22px">
                  <Text color={textColor} fontSize="lg" fontWeight="bold">
                    Products reputation ⭐️
                  </Text>
                </CardHeader>
                <CardBody h="100%">
                  <Box w="100%" h="100%">
                    <BarChart
                      chartData={barChartDataCharts1}
                      chartOptions={barChartOptionsCharts1}
                    />
                  </Box>
                </CardBody>
              </Card>
            </Flex>
          </Flex>
        </Flex>
        <Flex gap={"20px"}>
          <Reviews />
          {/* <Card px="0px" pb="0px" minH={"350px"}>
            <CardHeader mb="34px" px="22px">
              <Text color={textColor} fontSize="lg" fontWeight="bold">
                Line chart with gradient
              </Text>
            </CardHeader>
            <CardBody h="100%">
              <Box w="100%" h="100%">
                <LineChart
                  chartData={lineChartDataCharts2}
                  chartOptions={lineChartOptionsCharts2}
                />
              </Box>
            </CardBody>
          </Card>
          <Card px="0px" pb="0px" minH={"350px"}>
            <CardHeader mb="34px" px="22px">
              <Text color={textColor} fontSize="lg" fontWeight="bold">
                Line chart with gradient
              </Text>
            </CardHeader>
            <CardBody h="100%">
              <Box w="100%" h="100%">
                <LineChart
                  chartData={lineChartDataCharts22}
                  chartOptions={lineChartOptionsCharts2}
                />
              </Box>
            </CardBody>
          </Card> */}
        </Flex>
      </Flex>
    </Flex>
  );
}
