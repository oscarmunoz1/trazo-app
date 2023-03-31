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

const AddRecordStep2 = ({ prevTab }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("gray.300", "gray.700");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");

  const [checkboxes, setCheckboxes] = useState({
    design: false,
    code: false,
    develop: false,
  });
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
            <WeatherTab />
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
              variant="no-hover"
              bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
              alignSelf="flex-end"
              mt="24px"
              w={{ sm: "75px", lg: "100px" }}
              h="35px"
            >
              <Text fontSize="xs" color="#fff" fontWeight="bold">
                SEND
              </Text>
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AddRecordStep2;
