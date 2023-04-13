// Chakra imports
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FaRegCheckCircle, FaRegDotCircle } from "react-icons/fa";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AddEventModal from "dialog/AddEventModal";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import FinishHistoryModal from "dialog/FinishHistoryModal";
import TimelineRow from "components/Tables/TimelineRow";
import { setCurrentHistory } from "store/features/historySlice";
import { useGetCurrentHistoryQuery } from "store/features/historyApi";
import { useParams } from "react-router-dom";

const TrackList = ({ amount }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFinishModal,
    onOpen: onOpenFinishModal,
    onClose: onCloseFinishModal,
  } = useDisclosure();
  const dispatch = useDispatch();

  const currentHistory = useSelector((state) => state.history.currentHistory);

  const { parcelId } = useParams();

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetCurrentHistoryQuery(parcelId || "", {
    skip: parcelId === undefined,
  });

  useEffect(() => {
    if (data) dispatch(setCurrentHistory(data));
  }, [data]);

  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  return (
    <Card maxH="100%" height={"fit-content;"}>
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
          {currentHistory?.events?.map((event, index, arr) => {
            return (
              <TimelineRow
                key={event.id}
                logo={event.certified ? FaRegCheckCircle : FaRegDotCircle}
                title={event.name}
                date={new Date(event.date).toDateString()}
                color={event.certified ? "green.300" : "blue.400"}
                index={index}
                arrLength={arr.length}
              />
            );
          })}
          {!currentHistory?.events?.length > 0 && (
            <Flex width={"100%"} height={"70px"}>
              <Text
                display={"flex"}
                fontSize={"md"}
                fontWeight={"300"}
                justifyContent={"center"}
                alignItems={"center"}
                textAlign={"center"}
              >
                No current history yet, start by adding a new event.
              </Text>
            </Flex>
          )}
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
          onClick={onOpenFinishModal}
          disabled={
            currentHistory?.events && currentHistory?.events.length > 0
              ? false
              : true
          }
        >
          FINISH HISTORY
        </Button>
      </div>
      <AddEventModal
        title={"Add new historical event"}
        name={"Add event"}
        isOpen={isOpen}
        onClose={onClose}
      />
      <FinishHistoryModal
        title={"Finish history"}
        name={"Add last information"}
        isOpen={isOpenFinishModal}
        onClose={onCloseFinishModal}
      />
    </Card>
  );
};

export default TrackList;
