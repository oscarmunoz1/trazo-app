// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
// Custom components
import React, { useState } from "react";

import { FaPlus } from "react-icons/fa";
import Select from "react-select";

const OtherTab = (props) => {
  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Name
      </FormLabel>
      <Input
        fontSize="sm"
        ms="4px"
        borderRadius="15px"
        type="text"
        placeholder="Name of the product"
        mb="24px"
        size="lg"
      />
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Description
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

export default OtherTab;
