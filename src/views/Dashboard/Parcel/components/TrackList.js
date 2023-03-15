// Chakra imports
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import AddRecordModal from "dialog/AddRecordModal";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React from "react";
import TimelineRow from "components/Tables/TimelineRow";

const TrackList = ({ amount, data }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  return (
    <Card maxH="100%">
      <CardHeader p="22px 0px 35px 14px">
        <Flex direction="column">
          <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
            Current history
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            <Text fontWeight="bold" as="span" color="green.300">
              {`${amount}%`}
            </Text>{" "}
            this month.
          </Text>
        </Flex>
      </CardHeader>
      <CardBody ps="20px" pe="0px" mb="31px" position="relative">
        <Flex direction="column" width={"100%"}>
          {data.map((row, index, arr) => {
            return (
              <TimelineRow
                key={row.title}
                logo={row.logo}
                title={row.title}
                date={row.date}
                color={row.color}
                index={index}
                arrLength={arr.length}
              />
            );
          })}
        </Flex>
      </CardBody>
      <div style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}>
        <Button
          bg={bgButton}
          color="white"
          fontSize="xs"
          variant="no-hover"
          minW="100px"
          onClick={onOpen}
        >
          ADD EVENT
        </Button>
        <Button
          variant="outline"
          colorScheme="green"
          minW="110px"
          h="36px"
          fontSize="xs"
          px="1.5rem"
        >
          FINISH HISTORY
        </Button>
      </div>
      <AddRecordModal
        title={"Add new historical event"}
        name={"Add event"}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Card>
  );
};

export default TrackList;
