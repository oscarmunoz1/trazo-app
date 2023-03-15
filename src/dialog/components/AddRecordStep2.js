// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from "@chakra-ui/react";

import ChemicalTab from "./ChemicalTab.js";
import { FaPlus } from "react-icons/fa";
import OtherTab from "./OtherTab.js";
// Custom components
import React from "react";
import WeatherTab from "./WeatherTab.js";

const AddRecordStep2 = (props) => {
  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Select the kind of event to record
      </FormLabel>
      <Tabs size="md" variant="enclosed">
        <TabList tabsColor="red">
          <Tab>Weather</Tab>
          <Tab>Chemical</Tab>
          <Tab>Other</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WeatherTab />
          </TabPanel>
          <TabPanel>
            <ChemicalTab />
          </TabPanel>
          <TabPanel>
            <OtherTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <FormControl
        display="flex"
        alignItems="center"
        mb="24px"
        justifyContent={"flex-end"}
      >
        <Switch id="remember-login" colorScheme="green" me="10px" />
        <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
          Ask for certificate
        </FormLabel>
      </FormControl>
    </FormControl>
  );
};

export default AddRecordStep2;
