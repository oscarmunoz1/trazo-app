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
import React, { useEffect, useRef, useState } from "react";
import {
  barChartDataCharts1,
  barChartOptionsCharts1,
  lineBarChartData,
  lineBarChartOptions,
} from "variables/charts";
import {
  useGetEstablishmentHistoriesQuery,
  useGetEstablishmentProductsQuery,
  useGetEstablishmentScansVsSalesChartInfoQuery,
} from "store/features/productApi";

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
import SalesOverview from "./components/SalesOverview";
import ScansList from "./components/ScansList";
import { historyApi } from "store/features/historyApi";
import { productApi } from "store/features/productApi";
import { scansData } from "variables/general";
import { useGetScansByEstablishmentQuery } from "store/features/historyApi";
import { useSelector } from "react-redux";

// Custom icons
// assets

export default function CommercialView() {
  const textColor = useColorModeValue("gray.700", "white");
  const { establishmentId } = useParams();
  const chartRef = useRef(null);
  const [filters, setFilters] = useState({
    parcel: null,
    product: null,
    production: null,
    period: { id: "week", name: "This week" },
  });
  const [currentEstablishmentId, setCurrentEstablishmentId] = useState(null);
  const [establishment, setEstablishment] = useState(null);
  const [currentView, setCurrentView] = useState(null);

  const cardColor = useColorModeValue("white", "gray.700");

  const establishments = useSelector(
    (state) => state.company.currentCompany?.establishments
  );

  const { data: dataEstablishmentScans } = useGetScansByEstablishmentQuery(
    {
      establishmentId: currentEstablishmentId,
      period: filters.period.id,
      productId: filters.product?.id,
      parcelId: filters.parcel?.id,
      productionId: filters.production?.id,
    },
    { skip: !currentEstablishmentId || !filters?.period }
  );

  const {
    data: dataEstablishmentScansVsSaleInfo,
    isFetching,
  } = useGetEstablishmentScansVsSalesChartInfoQuery(
    {
      establishmentId: currentEstablishmentId,
      periodId: filters.period.id,
      productId: filters.product?.id,
      parcelId: filters.parcel?.id,
      productionId: filters.production?.id,
    },
    { skip: !currentEstablishmentId || !filters?.period }
  );

  const [
    fetchScansByEstablishment,
    { data: filteredScans, isLoading: isLoadingScans },
  ] = historyApi.endpoints.getScansByEstablishment.useLazyQuery();

  const [
    getEstablishmentProducts,
    { data: establishmentProducts, isLoading: isLoadingEstablishmentProducts },
  ] = productApi.endpoints.getEstablishmentProducts.useLazyQuery();

  // to check for active links and opened collapses
  let location = useLocation();

  const iconBoxInside = useColorModeValue("white", "white");
  let mainText = useColorModeValue("gray.700", "gray.200");

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
      setFilters({
        parcel: null,
        product: null,
        production: null,
        period: { id: "week", name: "This week" },
      });
    }
  }, [establishmentId, establishments]);

  const { data: dataProducts } = useGetEstablishmentProductsQuery(
    { establishmentId: currentEstablishmentId },
    { skip: !currentEstablishmentId }
  );

  const { data: dataHistories } = useGetEstablishmentHistoriesQuery(
    {
      establishmentId: currentEstablishmentId,
      periodId: filters.period?.id,
      parcelId: filters.parcel?.id,
      productId: filters.product?.id,
    },
    {
      skip:
        !currentEstablishmentId ||
        !filters?.period ||
        !filters?.parcel ||
        !filters?.product,
    }
  );

  const onParcelFilterChange = (parcel) => {
    setFilters({
      ...filters,
      parcel: parcel ? { id: parcel.id, name: parcel.name } : null,
    });
    getEstablishmentProducts({
      establishmentId: currentEstablishmentId,
      parcelId: parcel?.id,
    });
  };

  const onProductFilterChange = (product) => {
    setFilters({
      ...filters,
      product: product ? { id: product.id, name: product.name } : null,
    });
  };

  const onProductionFilterChange = (production) => {
    console.log(production);
    setFilters({
      ...filters,
      production: production
        ? { id: production.id, period: production.period }
        : null,
    });
  };

  const onPeriodFilterChange = (period) => {
    setFilters({
      ...filters,
      period: period ? { id: period.id, name: period.name } : null,
    });
  };

  useEffect(() => {
    if (dataEstablishmentScansVsSaleInfo && chartRef.current) {
      chartRef.current.chart.updateSeries([
        {
          name: "Scans",
          type: "bar",
          data: dataEstablishmentScansVsSaleInfo?.scans_vs_sales?.series,
        },
        {
          name: "Sales",
          type: "line",
          data: dataEstablishmentScansVsSaleInfo?.scans_vs_sales?.series.map(
            (series) => (series > 2 ? series - 2 : 0)
          ),
        },
      ]);
      chartRef.current.chart.updateOptions({
        ...lineBarChartOptions,
        xaxis: {
          ...lineBarChartOptions.xaxis,
          categories: dataEstablishmentScansVsSaleInfo?.scans_vs_sales?.options?.map(
            (option) => option.toString()
          ),
        },
      });
    }
  }, [dataEstablishmentScansVsSaleInfo]);

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
              to={`/admin/dashboard/establishment/${prop.id}/commercial/`}
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
                      width="fit-content"
                      h="35px"
                      bg="#fff"
                      minW="155px"
                      fontSize="xs"
                    >
                      {filters.parcel ? filters.parcel.name : "ALL PARCELS"}
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => onParcelFilterChange(null)}
                        color="gray.500"
                      >
                        All Parcels
                      </MenuItem>
                      <MenuDivider />
                      {establishment &&
                        establishment.parcels.map((parcel) => (
                          <MenuItem
                            onClick={() => onParcelFilterChange(parcel)}
                            color="gray.500"
                          >
                            {parcel.name}
                          </MenuItem>
                        ))}
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
                      width="fit-content"
                      h="35px"
                      bg="#fff"
                      minW="155px"
                      fontSize="xs"
                    >
                      {filters.product ? filters.product.name : "ALL PRODUCTS"}
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => onProductFilterChange(null)}
                        color="gray.500"
                      >
                        All Products
                      </MenuItem>
                      <MenuDivider />
                      {filters?.parcel
                        ? establishmentProducts &&
                          establishmentProducts.map((product) => (
                            <MenuItem
                              onClick={() => onProductFilterChange(product)}
                              color="gray.500"
                            >
                              {product.name}
                            </MenuItem>
                          ))
                        : dataProducts &&
                          dataProducts.map((product) => (
                            <MenuItem
                              onClick={() => onProductFilterChange(product)}
                              color="gray.500"
                            >
                              {product.name}
                            </MenuItem>
                          ))}
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
                      minW="155px"
                      h="35px"
                      bg="#fff"
                      fontSize="xs"
                      width="fit-content"
                      disabled={
                        filters.product == null || filters.parcel == null
                      }
                    >
                      {filters.production
                        ? filters.production.period
                        : "ALL PRODUCTIONS"}
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => onProductionFilterChange(null)}
                        color="gray.500"
                      >
                        All Productions
                      </MenuItem>
                      <MenuDivider />
                      {dataHistories &&
                        dataHistories.map((history) => (
                          <MenuItem
                            onClick={() => onProductionFilterChange(history)}
                            color="gray.500"
                          >
                            {history.period}
                          </MenuItem>
                        ))}
                      {/* <MenuItem color="gray.500">20/03/2021</MenuItem>
                      <MenuItem color="gray.500">20/07/2021</MenuItem>
                      <MenuItem color="gray.500">20/09/2021</MenuItem> */}
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
                  width="fit-content"
                  minW="125px"
                >
                  {filters.period.name.toUpperCase()}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      onPeriodFilterChange({ id: "week", name: "This week" })
                    }
                    color="gray.500"
                  >
                    This week
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      onPeriodFilterChange({ id: "month", name: "This month" })
                    }
                    color="gray.500"
                  >
                    This month
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      onPeriodFilterChange({ id: "year", name: "This year" })
                    }
                    color="gray.500"
                  >
                    This year
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
        <Flex flexDirection={"row"} gap="24px">
          <Flex flex={2}>
            <ScansList
              title={"Scans"}
              labels={["Date", "Product", "Location", "Parcel", "Comment"]}
              scansData={dataEstablishmentScans}
            />
          </Flex>
          <Flex flexDirection={"column"} flex={1.5} gap={"24px"}>
            <Flex flex={1}>
              <Card px="0px" pb="0px" height="346px">
                <CardHeader mb="34px" px="22px">
                  <Text color={textColor} fontSize="lg" fontWeight="bold">
                    Numbers of scans and sales
                  </Text>
                </CardHeader>
                <CardBody h="100%">
                  <Box w="100%" h="100%">
                    {isFetching ? (
                      <p>hola</p>
                    ) : (
                      <LineBarChart
                        chartRef={chartRef}
                        chartData={lineBarChartData.map((data) => {
                          if (data.name === "Sales") {
                            return {
                              name: data.name,
                              type: data.type,
                              data: dataEstablishmentScansVsSaleInfo?.scans_vs_sales?.series.map(
                                (serie) => (serie > 2 ? serie - 2 : 0)
                              ),
                            };
                          }
                          return {
                            name: data.name,
                            type: data.type,
                            data:
                              dataEstablishmentScansVsSaleInfo?.scans_vs_sales
                                .series,
                          };
                        })}
                        chartOptions={{
                          ...lineBarChartOptions,
                          xaxis: {
                            ...lineBarChartOptions.xaxis,
                            categories: dataEstablishmentScansVsSaleInfo?.scans_vs_sales?.options?.map(
                              (option) => option.toString()
                            ),
                          },
                        }}
                      />
                    )}
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
