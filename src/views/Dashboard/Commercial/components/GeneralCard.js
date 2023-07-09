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

// Chakra imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsStarFill, BsStarHalf } from "react-icons/bs";

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";
import avatar4 from "assets/img/avatars/avatar4.png";

const GeneralCard = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgSalaryCard = useColorModeValue("gray.50", "gray.600");

  return (
    <Card>
      <CardHeader mb="16px">
        <Flex justify="space-between" align="center" w={"100%"}>
          <Flex>
            <Avatar
              src={avatar4}
              w="40px"
              h="40px"
              mr="15px"
              borderRadius="12px"
            />
            <Flex direction="column">
              <Text color={textColor} fontSize="md" fontWeight="bold">
                Esthera Jackson
              </Text>
              <Text color="gray.400" fontSize="sm" fontWeight="normal">
                2h ago
              </Text>
            </Flex>
          </Flex>
          <Stack direction="row" color="yellow.400" spacing="2px">
            <Icon as={BsStarFill} w="12px" h="12px" />
            <Icon as={BsStarFill} w="12px" h="12px" />
            <Icon as={BsStarFill} w="12px" h="12px" />
            <Icon as={BsStarFill} w="12px" h="12px" />
            <Icon as={BsStarHalf} w="12px" h="12px" />
          </Stack>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          <Flex direction="column">
            <Text color={textColor} fontSize="md" fontWeight="400" mb="4px">
              It was a really nice product. I love the quality so much. I will
              buy it again! Thank you for the service.
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="normal">
              Apple - Parcel #1 - 21/03/2021
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default GeneralCard;
