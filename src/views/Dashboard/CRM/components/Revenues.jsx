import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import { FaRegCalendarAlt } from "react-icons/fa";
import React from "react";
import TransactionRow from "components/Tables/TransactionRow";
import { revenueCRM } from "variables/general";

const Revenues = ({ title, date }) => {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card>
      <CardHeader mb="12px">
        <Flex direction="column" w="100%">
          <Flex
            direction={{ sm: "column", lg: "row" }}
            justify={{ sm: "center", lg: "space-between" }}
            align={{ sm: "center" }}
            w="100%"
            my={{ md: "12px" }}
          >
            <Text
              color={textColor}
              fontSize={{ sm: "lg", md: "xl", lg: "lg" }}
              fontWeight="bold"
            >
              {title}
            </Text>
            <Flex align="center">
              <Icon
                as={FaRegCalendarAlt}
                color="gray.400"
                fontSize="md"
                me="6px"
              ></Icon>
              <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                {date}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%" justify="center">
          {revenueCRM.map((row, index) => {
            return (
              <TransactionRow
                name={row.name}
                logo={row.logo}
                date={row.date}
                price={row.price}
                key={index}
              />
            );
          })}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Revenues;
