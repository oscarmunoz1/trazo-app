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

const OtherTab = (props) => {
  const intl = useIntl();
  return (
    <FormControl>
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        {intl.formatMessage({ id: 'app.name' })}
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
        {intl.formatMessage({ id: 'app.description' })}
      </FormLabel>
      <Textarea
        fontSize="sm"
        ms="4px"
        borderRadius="15px"
        type="text"
        placeholder={intl.formatMessage({ id: 'app.descriptionOfTheEvent' })}
        mb="24px"
        size="lg"
      />
    </FormControl>
  );
};

export default OtherTab;
