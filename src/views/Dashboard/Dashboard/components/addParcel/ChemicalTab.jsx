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
import { useIntl } from "react-intl";

import { FaPlus } from "react-icons/fa";
import Select from "react-select";

const AddRecordStep1 = (props) => {
  const intl = useIntl();
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
        placeholder={intl.formatMessage({ id: 'app.nameOfTheProduct' })}
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
        placeholder={intl.formatMessage({ id: 'app.volumeOfTheProduct' })}
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
        placeholder={intl.formatMessage({ id: 'app.area' })}
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
        placeholder={intl.formatMessage({ id: 'app.nameOfTheEvent' })}
        mb="24px"
        size="lg"
      />
    </FormControl>
  );
};

export default AddRecordStep1;
