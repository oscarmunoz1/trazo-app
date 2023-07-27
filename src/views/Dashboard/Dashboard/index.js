// Chakra imports
import {
  Button,
  Flex,
  Grid,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  HomeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  dashboardTableData,
  establishmentData,
  parcelsData,
  timelineData,
} from "variables/general";

import ActiveUsers from "./components/ActiveUsers";
import BarChart from "components/Charts/BarChart";
import Card from "components/Card/Card.js";
import CardWithBackground from "./components/CardWithBackground";
import CardWithImage from "components/Card/CardWithImage";
import CarouselHorizontal from "components/Carousel/CarouselHorizontal";
import { FaPlus } from "react-icons/fa";
import LineChart from "components/Charts/LineChart";
import MiniStatistics from "./components/MiniStatistics";
import SalesOverview from "./components/SalesOverview";
import bgImage from "assets/img/basic-auth.png";
// assets
import imageFarm from "assets/img/imageFarm.png";
import logoChakra from "assets/svg/logo-white.svg";
import { useSelector } from "react-redux";

export default function DashboardView() {
  const { establishmentId } = useParams();
  const navigate = useNavigate();
  const [currentEstablishmentId, setCurrentEstablishmentId] = useState(null);
  const [establishment, setEstablishment] = useState(null);

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
      setEstablishment(establishment);
    }
  }, [establishmentId, establishments]);

  const toggleAddEstablishment = () => {
    navigate("/admin/dashboard/establishment/add");
  };

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
            <NavLink to={`/admin/dashboard/establishment/${prop.id}`}>
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
        <Button
          p="0px"
          w="95px"
          h="95px"
          bg="transparent"
          color="gray.500"
          borderRadius="15px"
          onClick={toggleAddEstablishment}
        >
          <Flex
            direction="column"
            justifyContent="center"
            align="center"
            h="120px"
          >
            <Icon as={FaPlus} w="15px" h="15px" mb="10px" />
            <Text fontSize="md" fontWeight="bold">
              New
            </Text>
          </Flex>
        </Button>
      </SimpleGrid>

      <Grid
        templateColumns={{ md: "1fr", lg: "1.8fr 1.2fr" }}
        templateRows={{ md: "1fr auto", lg: "1fr" }}
        my="26px"
        gap="24px"
      >
        {establishment ? (
          <CardWithImage
            title={"Establishment Profile"}
            name={establishment?.name}
            description={establishment?.description}
            state={establishment?.state}
            city={establishment?.city}
            zone={establishment?.zone}
            readMoreLink={`/admin/dashboard/establishment/${establishment?.id}/profile`}
            image={
              <Image
                src={
                  establishment?.image
                    ? `http://localhost:8000${establishment?.image}`
                    : bgImage
                }
                alt="establishment image"
                width="100%"
                height="100%"
                objectFit={"cover"}
                borderRadius="15px"
              />
            }
          />
        ) : (
          <Card minH="290px" bg={cardColor} />
        )}

        {establishment ? (
          <CardWithBackground
            backgroundImage={imageFarm}
            title={"Work with certifications"}
            description={
              "traceit works with registered and accredited professionals who, through an electronic signature, certify that a certain event occurred in a certain way."
            }
          />
        ) : (
          <Card minH="290px" bg={cardColor} />
        )}
      </Grid>
      <CarouselHorizontal
        title={"Parcels"}
        description={"Establishment Parcels "}
        data={establishment?.parcels}
      />
    </Flex>
  );
}
