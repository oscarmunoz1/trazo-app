// Chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, useLocation, useMatch, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Card from "components/Card/Card.jsx";
// Custom icons
import { HomeIcon } from "components/Icons/Icons.jsx";
import MiniStatistics from "../Dashboard/components/MiniStatistics";
// assets
import { useSelector } from "react-redux";

export default function CertificationsView() {
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
      <Flex mt={"20px"} mb={"20px"} w={"100%"} minH={"500px"} gap="20px">
        <Card backgroundColor="#edf2f7">
          <Text fontSize={"lg"} fontWeight={"bold"} mb="20px">
            To certificate
          </Text>
          <Accordion allowToggle>
            {[1, 2, 3].map((item) => (
              <AccordionItem borderTopWidth={"0px"}>
                <Card mb="10px" borderLeftWidth="medium" borderLeftColor="red">
                  <AccordionButton borderRadius={"15px"}>
                    <Flex width={"100%"} justifyContent={"space-between"}>
                      <Text fontSize={"sm"} fontWeight={"500"} mb="10px">
                        Parcel 1
                      </Text>
                      <AccordionIcon />
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card backgroundColor="#edf2f7">
          <Text fontSize={"lg"} fontWeight={"bold"} mb="20px">
            In progress
          </Text>

          <Accordion allowToggle>
            {[1, 2, 3, 4, 5].map((item) => (
              <AccordionItem borderTopWidth={"0px"}>
                <Card
                  mb="10px"
                  borderLeftWidth="medium"
                  borderLeftColor="yellow.300"
                >
                  <AccordionButton borderRadius={"15px"}>
                    <Flex width={"100%"} justifyContent={"space-between"}>
                      <Text fontSize={"sm"} fontWeight={"500"} mb="10px">
                        Parcel 1
                      </Text>
                      <AccordionIcon />
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card backgroundColor="#edf2f7">
          <Text fontSize={"lg"} fontWeight={"bold"} mb="20px">
            Certificated
          </Text>

          <Accordion allowToggle>
            {[1, 2, 3, 4].map((item) => (
              <AccordionItem borderTopWidth={"0px"}>
                <Card
                  mb="10px"
                  borderLeftWidth="medium"
                  borderLeftColor="green.400"
                >
                  <AccordionButton borderRadius={"15px"}>
                    <Flex width={"100%"} justifyContent={"space-between"}>
                      <Text fontSize={"sm"} fontWeight={"500"} mb="10px">
                        Parcel 1
                      </Text>
                      <AccordionIcon />
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </Flex>
    </Flex>
  );
}
