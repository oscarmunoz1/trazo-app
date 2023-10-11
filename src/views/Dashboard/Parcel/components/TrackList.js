// Chakra imports
import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FaRegCheckCircle, FaRegDotCircle } from "react-icons/fa";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import TimelineRow from "components/Tables/TimelineRow";
import { setCurrentHistory } from "store/features/historySlice";
import { useGetCurrentHistoryQuery } from "store/api/historyApi";

const TrackList = ({ amount }) => {
  const textColor = useColorModeValue("gray.700", "white");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFinishModal,
    onOpen: onOpenFinishModal,
    onClose: onCloseFinishModal,
  } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentHistory = useSelector((state) => state.history.currentHistory);
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { establishmentId, parcelId } = useParams();

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetCurrentHistoryQuery(
    {
      companyId: currentCompany?.id,
      establishmentId,
      parcelId: parcelId || "",
    },
    {
      skip: !parcelId || !currentCompany || !establishmentId,
    }
  );

  useEffect(() => {
    if (data) dispatch(setCurrentHistory(data));
  }, [data]);

  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  const handleOnPrimaryClick = () => {
    if (!currentHistory?.product > 0) {
      navigate(
        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/add`
      );
    } else {
      navigate(
        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/add`
      );
    }
  };

  return (
    <Card maxH="100%" height={"fit-content;"}>
      <CardHeader p="0px 0px 35px 0px">
        <Flex direction="column" w="100%">
          <Flex p="0px" align="center" justify="space-between">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Current production
            </Text>
            <Menu isOpen={isOpen1} onClose={onClose1}>
              <MenuButton
                onClick={onOpen1}
                alignSelf="flex-start"
                disabled={!currentHistory?.product}
                cursor={!currentHistory?.product ? "default" : "pointer"}
              >
                <Icon
                  as={IoEllipsisVerticalSharp}
                  color="gray.400"
                  w="20px"
                  h="20px"
                />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() =>
                    navigate(
                      `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${currentHistory?.id}/change`
                    )
                  }
                >
                  <Flex
                    color={textColor}
                    cursor="pointer"
                    align="center"
                    p="4px"
                  >
                    {/* <Icon as={FaPencilAlt} me="4px" /> */}
                    <Text fontSize="sm" fontWeight="500">
                      EDIT
                    </Text>
                  </Flex>
                </MenuItem>
                <MenuItem>
                  <Flex color="red.500" cursor="pointer" align="center" p="4px">
                    {/* <Icon as={FaTrashAlt} me="4px" /> */}
                    <Text fontSize="sm" fontWeight="500">
                      DELETE
                    </Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex direction="column">
            {currentHistory?.product && (
              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                The production of the product{" "}
                <Text fontWeight="bold" as="span" color="green.300">
                  {`${currentHistory?.product}`}{" "}
                </Text>
                has been started on{" "}
                <Text fontWeight="bold" as="span" color="green.300">
                  {`${new Date(currentHistory?.start_date).toLocaleDateString(
                    "en-US"
                  )}`}{" "}
                </Text>
              </Text>
            )}
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody ps="20px" pe="0px" mb="31px" position="relative">
        <Flex direction="column" width={"100%"}>
          {currentHistory?.events?.map((event, index, arr) => {
            return (
              <TimelineRow
                key={event.id}
                logo={event.certified ? FaRegCheckCircle : FaRegDotCircle}
                title={event.type}
                date={new Date(event.date).toDateString()}
                color={event.certified ? "green.300" : "blue.400"}
                index={index}
                arrLength={arr.length}
                url={`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/${event.id}`}
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
                {currentHistory?.product
                  ? "No events yet, start by adding a new one."
                  : "No current production yet, start by starting a new one."}
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
          minW={!currentHistory?.product ? "135px" : "100px"}
          onClick={handleOnPrimaryClick}
        >
          {!currentHistory?.product ? "START PRODUCTION" : "ADD EVENT"}
        </Button>
        <Button
          variant="outline"
          colorScheme="green"
          minW="110px"
          h="36px"
          fontSize="xs"
          px="1.5rem"
          onClick={() =>
            navigate(
              `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${currentHistory?.id}/finish`
            )
          }
          disabled={
            currentHistory?.events && currentHistory?.events.length > 0
              ? false
              : true
          }
        >
          FINISH PRODUCTION
        </Button>
      </div>
    </Card>
  );
};

export default TrackList;
