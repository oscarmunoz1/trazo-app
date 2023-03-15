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

const AddRecordStep1 = (props) => {
  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Product name
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
        Area
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
        Application method
      </FormLabel>
      <Input
        fontSize="sm"
        ms="4px"
        borderRadius="15px"
        type="text"
        placeholder="Name of the event"
        mb="24px"
        size="lg"
      />
    </FormControl>
  );
};

export default AddRecordStep1;
