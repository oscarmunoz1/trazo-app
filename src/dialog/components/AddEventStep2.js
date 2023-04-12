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
import React, { useState } from "react";
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
import { setForm } from "store/features/formSlice";

const AddRecordStep2 = ({ prevTab, nextTab }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("gray.300", "gray.700");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");

  const dispatch = useDispatch();

  const [checkBox, setCheckBox] = useState(null);

  const currentEvent = useSelector((state) => state.form.currentForm?.event);

  const handleNext = () => {
    if (checkBox === null) {
      return;
    }
    dispatch(setForm({ event: { ...currentEvent, event_type: checkBox } }));
    nextTab.current.click();
  };

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
            What kind of event do you want to create?
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            If the type of the event is not within the options, select the type
            Other and specify it in the next step.
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={{ sm: "20px", lg: "35px" }}
            alignSelf="center"
            justifySelf="center"
            mb="24px"
          >
            <Flex direction="column" align="center">
              <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                <Flex
                  w="100%"
                  h="100%"
                  borderRadius="12px"
                  justify="center"
                  transition=".5s all ease"
                  border="1px solid lightgray"
                  align="center"
                  bg={checkBox == 0 ? "green.400" : "#fff"}
                  _hover={{ opacity: "0.8" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setCheckBox(0);
                  }}
                >
                  <Checkbox display="none" />
                  <Icon
                    as={BsFillCloudLightningRainFill}
                    w="54px"
                    h="54px"
                    color={checkBox == 0 ? "#fff" : iconColor}
                  />
                </Flex>
              </FormLabel>
              <Text color={textColor} fontWeight="bold" fontSize="md">
                Weather
              </Text>
            </Flex>
            <Flex direction="column" align="center">
              <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                <Flex
                  w="100%"
                  h="100%"
                  borderRadius="12px"
                  justify="center"
                  transition=".5s all ease"
                  border="1px solid lightgray"
                  align="center"
                  bg={checkBox === 1 ? "green.400" : "#fff"}
                  _hover={{ opacity: "0.8" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setCheckBox(1);
                  }}
                >
                  <Checkbox display="none" />
                  <Icon
                    as={SlChemistry}
                    w="54px"
                    h="54px"
                    color={checkBox === 1 ? "#fff" : iconColor}
                  />
                </Flex>
              </FormLabel>
              <Text color={textColor} fontWeight="bold" fontSize="md">
                Chemical
              </Text>
            </Flex>
            <Flex direction="column" align="center">
              <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                <Flex
                  w="100%"
                  h="100%"
                  borderRadius="12px"
                  justify="center"
                  transition=".5s all ease"
                  border="1px solid lightgray"
                  align="center"
                  bg={checkBox === 2 ? "green.400" : "#fff"}
                  _hover={{ opacity: "0.8" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setCheckBox(2);
                  }}
                >
                  <Checkbox display="none" />
                  <Icon
                    as={RocketIcon}
                    w="54px"
                    h="54px"
                    color={checkBox === 2 ? "#fff" : iconColor}
                  />
                </Flex>
              </FormLabel>
              <Text color={textColor} fontWeight="bold" fontSize="md">
                Other
              </Text>
            </Flex>
          </Stack>

          <Flex justify="space-between">
            <Button
              variant="no-hover"
              bg={bgPrevButton}
              alignSelf="flex-end"
              mt="24px"
              w={{ sm: "75px", lg: "100px" }}
              h="35px"
              onClick={() => prevTab.current.click()}
            >
              <Text fontSize="xs" color="gray.700" fontWeight="bold">
                PREV
              </Text>
            </Button>
            <Button
              bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
              _hover={{
                bg: "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
              }}
              alignSelf="flex-end"
              mt="24px"
              w={{ sm: "75px", lg: "100px" }}
              h="35px"
              onClick={handleNext}
              disabled={checkBox === null}
            >
              <Text fontSize="xs" color="#fff" fontWeight="bold">
                NEXT
              </Text>
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AddRecordStep2;
