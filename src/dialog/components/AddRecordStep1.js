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

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed
      ? { ...base, backgroundColor: "gray", borderRadius: "10px" }
      : { ...base, borderRadius: "10px" };
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #E2E8F0",
    borderRadius: "15px",
    boxShadow: "none",
    outline: "2px solid transparent",
    minHeight: "50px",
  }),
};

const orderOptions = (values) => {
  return values
    .filter((v) => v.isFixed)
    .concat(values.filter((v) => !v.isFixed));
};

const AddRecordStep1 = (props) => {
  const options = [
    { value: "Parcel #1", label: "Parcel #1", isFixed: true },
    { value: "Parcel #2", label: "Parcel #2" },
    { value: "Parcel #3", label: "Parcel #3" },
    { value: "Parcel #4", label: "Parcel #4" },
    { value: "Parcel #5", label: "Parcel #5" },
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [value, setValue] = useState(
    orderOptions(options.filter((v) => v.isFixed))
  );

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = options.filter((v) => v.isFixed);
        break;
    }
    setValue(orderOptions(newValue));
  };

  return (
    <FormControl>
      <Flex direction="row" justifyContent="space-between">
        <Flex direction={"column"} grow={"1"} pr={"32px"}>
          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
            Name
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
          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
            Date
          </FormLabel>
          <Input
            placeholder="Select Date and Time"
            borderRadius="15px"
            ms="4px"
            type="datetime-local"
            mb="24px"
            fontSize={"0.875rem;"}
            size="lg"
          />
        </Flex>
        <Button
          p="0px"
          bg="transparent"
          color="gray.500"
          border="1px solid lightgray"
          borderRadius="15px"
          minWidth={"40%"}
          minHeight="200px"
          maxW={"300px"}
        >
          <Flex direction="column" justifyContent="center" align="center">
            <Icon as={FaPlus} fontSize="lg" mb="12px" />
            <Text fontSize="lg" fontWeight="bold">
              Add a photo
            </Text>
          </Flex>
        </Button>
      </Flex>
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
      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
        Select the others Parcels to which the event was applied
      </FormLabel>
      <Select
        value={value}
        isMulti
        styles={styles}
        isClearable={value.some((v) => !v.isFixed)}
        name="colors"
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={onChange}
        options={options}
      />
    </FormControl>
  );
};

export default AddRecordStep1;
