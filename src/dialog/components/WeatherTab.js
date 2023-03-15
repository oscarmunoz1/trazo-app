// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
// Custom components
import React, { useState } from "react";

import { FaPlus } from "react-icons/fa";

const WeatherTab = (props) => {
  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Type
      </FormLabel>
      <Select
        placeholder="Select option"
        placeholderTextColor="red"
        css={{ "&::placeholder": { color: "red" } }}
        mb="24px"
        ml="4px"
        height={"3rem"}
        borderRadius={"15px"}
        fontSize={"0.875rem"}
      >
        <option value="option1">Rain</option>
        <option value="option2">Snow</option>
        <option value="option3">Hail</option>
      </Select>
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Volume
      </FormLabel>
      <Input
        fontSize="sm"
        ms="4px"
        borderRadius="15px"
        type="text"
        placeholder="Volume of the product"
        mb="24px"
        size="lg"
      />
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Time
      </FormLabel>
      <Input
        fontSize="sm"
        ms="4px"
        borderRadius="15px"
        type="text"
        placeholder="Area"
        mb="24px"
        size="lg"
      />
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Observation
      </FormLabel>
      <Textarea
        fontSize="sm"
        ms="4px"
        borderRadius="15px"
        type="text"
        placeholder="Description of the event"
        mb="24px"
        size="lg"
      />
    </FormControl>
  );
};

export default WeatherTab;
