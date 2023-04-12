// Chakra imports
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BsFillCloudLightningRainFill } from "react-icons/bs";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import ChemicalTab from "./ChemicalTab.js";
import { FaPlus } from "react-icons/fa";
import OtherTab from "./OtherTab.js";
import { RocketIcon } from "components/Icons/Icons";
import { SlChemistry } from "react-icons/sl";
import WeatherTab from "./WeatherTab.js";
import { setEventToHistory } from "store/features/historySlice.js";
import { setForm } from "store/features/formSlice";
import { useCreateEventMutation } from "store/features/historyApi.js";

const AddEventStep3 = ({ onClose }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("gray.300", "gray.700");

  const [
    createEvent,
    { data, error, isSuccess, isLoading },
  ] = useCreateEventMutation();

  const dispatch = useDispatch();

  const currentEvent = useSelector((state) => state.form.currentForm?.event);

  const currentParcelId = useSelector(
    (state) => state.product.currentParcel?.id
  );

  const onSubmit = (data) => {
    dispatch(setForm({ event: { ...currentEvent, ...data } }));
    createEvent({ ...currentEvent, ...data, parcel: currentParcelId });
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setEventToHistory(data));
      onClose();
    }
  }, [isSuccess, data]);

  return (
    <Card>
      <CardHeader mb="40px">
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          w="80%"
          mx="auto"
        >
          <Text color={textColor} fontSize="lg" fontWeight="bold" mb="4px">
            What is the event about?
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            In the following Inputs you must give detailed information about the
            event.
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          <Stack direction="column" spacing="20px">
            <WeatherTab onSubmitHandler={onSubmit} isLoading={isLoading} />
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AddEventStep3;
