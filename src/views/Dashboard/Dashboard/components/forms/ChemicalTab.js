// Chakra imports
import {
  Button,
  Select as ChakraSelect,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import React, { useState } from "react";
import { number, object, string } from "zod";

import { FaPlus } from "react-icons/fa";
import FormInput from "components/Forms/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";

// Custom components

const formSchemaMainInfo = object({
  type: string().min(1, "Name is required"),
  product_name: string().min(1, "Product Name is required"),
  commercial_name: string().min(1, "Commercial Name is required"),
  volume: string().min(1, "Volume is required"),
  area: string().min(1, "Area is required"),
  observations: string(),
  way_of_application: string().min(1, "Way of application is required"),
});

const ChemicalTab = ({ onSubmitHandler, onPrev }) => {
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("gray.300", "gray.700");

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo),
  });

  const {
    reset: mainInfoReset,
    handleSubmit: mainInfoSubmit,
    errors: mainInfoErrors,
    formState: { errors, isSubmitSuccessful },
    register,
  } = mainInfoMethods;

  return (
    <FormProvider {...mainInfoMethods}>
      <form
        onSubmit={mainInfoSubmit(onSubmitHandler)}
        style={{ width: "100%" }}
      >
        <Flex direction="column" w="100%">
          <Flex gap={"20px"}>
            <Flex flexDir={"column"} flex={1}>
              <FormLabel
                pl="12px"
                ms="4px"
                fontSize="xs"
                fontWeight="bold"
                mb={"4px"}
              >
                Type
              </FormLabel>
              <ChakraSelect
                placeholder="Select option"
                placeholderTextColor="red"
                css={{ "&::placeholder": { color: "red" } }}
                mb={errors.type ? "12px" : "24px"}
                borderColor={errors.type && "red.500"}
                boxShadow={errors.type && "0 0 0 1px red.500"}
                borderWidth={errors.type && "2px"}
                ml="4px"
                height={"40px"}
                borderRadius={"15px"}
                fontSize={"0.875rem"}
                {...register("type")}
              >
                <option value="FE">Fertilizer</option>
                <option value="PE">Pesticide</option>
                <option value="FU">Fungicide</option>
                <option value="HE">Herbicide</option>
              </ChakraSelect>
              {errors.type && (
                <Text fontSize="sm" color="red.500" mt={"0.5rem"}>
                  {errors.type.message}
                </Text>
              )}
            </Flex>
            <Flex flex={1}>
              <FormInput
                fontSize="xs"
                label="Way of application"
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder="Way of application"
                mb="24px"
                name="way_of_application"
              />
            </Flex>
          </Flex>
          <Flex gap={"20px"}>
            <FormInput
              label="Product Name"
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="Name of the product"
              mb="24px"
              name="product_name"
              fontSize="xs"
            />

            <FormInput
              fontSize="xs"
              label="Commercial Name"
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="Commercial Name of the product"
              mb="24px"
              name="commercial_name"
            />
          </Flex>
          <Flex gap={"20px"}>
            <FormInput
              fontSize="xs"
              label="Volume"
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="Volume of the product"
              mb="24px"
              name="volume"
            />
            <FormInput
              fontSize="xs"
              label="Area"
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="Area of application"
              mb="24px"
              name="area"
            />
          </Flex>

          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
            Observations
          </FormLabel>
          <Textarea
            fontSize="xs"
            ms="4px"
            borderRadius="15px"
            type="text"
            placeholder="Description of the event"
            mb="24px"
            name="observations"
            {...register("observations")}
          />
          <Flex justify="space-between">
            <Button
              variant="no-hover"
              bg={bgPrevButton}
              alignSelf="flex-end"
              mt="24px"
              w={{ sm: "75px", lg: "100px" }}
              h="35px"
              onClick={onPrev}
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
              w="100px"
              h="35px"
              type="submit"
            >
              <Text fontSize="xs" color="#fff" fontWeight="bold">
                NEXT
              </Text>
            </Button>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default ChemicalTab;
