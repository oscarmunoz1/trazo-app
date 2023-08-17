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
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Icon,
  Progress,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

import React from "react";

function DashboardTableRow(props) {
  const { logo, name, members, budget, progression, color, onClick } = props;
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Tr
      _hover={{
        bg: "gray.100",
        "& td:first-of-type": {
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        },
        "& td:last-of-type": {
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
        },
      }}
      cursor="pointer"
      onClick={onClick}
    >
      <Td minWidth={{ sm: "250px" }} pl="0px">
        <Flex
          align="center"
          py=".8rem"
          minWidth="100%"
          flexWrap="nowrap"
          pl="20px"
        >
          <Icon as={logo} h={"24px"} w={"24px"} pe="5px" color={color} />
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
          >
            {name}
          </Text>
        </Flex>
      </Td>

      <Td>
        <AvatarGroup size="sm">
          {members.map((member) => {
            return (
              <Avatar
                name="Ryan Florence"
                key={member}
                src={member}
                _hover={{ zIndex: "3", cursor: "pointer" }}
              />
            );
          })}
        </AvatarGroup>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {budget}
        </Text>
      </Td>
      <Td>
        <Flex direction="column">
          <Text
            fontSize="md"
            color="green.300"
            fontWeight="bold"
            pb=".2rem"
          >{`${progression}%`}</Text>
          <Progress
            colorScheme={progression === 100 ? "green" : "cyan"}
            size="xs"
            value={progression}
            borderRadius="15px"
          />
        </Flex>
      </Td>
    </Tr>
  );
}

export default DashboardTableRow;
