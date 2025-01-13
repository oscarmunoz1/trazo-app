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
import { useIntl } from "react-intl";

// Custom components

const formSchemaMainInfo = object({
  type: string().min(1, "Name is required"),
});

const WeatherTab = ({ onSubmitHandler, onPrev }) => {
  const intl = useIntl();
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
          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
            {intl.formatMessage({ id: 'app.type' })}
          </FormLabel>
          <ChakraSelect
            placeholder={intl.formatMessage({ id: 'app.selectOption' })}
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
            mt="4px"
            {...register("type")}
          >
            <option value="PL">{intl.formatMessage({ id: 'app.planting' })}</option>
            <option value="HA">{intl.formatMessage({ id: 'app.harvesting' })}</option>
            <option value="IR">{intl.formatMessage({ id: 'app.irrigation' })}</option>
            <option value="PR">{intl.formatMessage({ id: 'app.pruning' })}</option>
          </ChakraSelect>
          {errors.type && (
            <Text fontSize="sm" color="red.500" mt={"0.5rem"}>
              {errors.type.message}
            </Text>
          )}
          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
            {intl.formatMessage({ id: 'app.observations' })}
          </FormLabel>
          <Textarea
            fontSize="sm"
            ms="4px"
            borderRadius="15px"
            type="text"
            placeholder={intl.formatMessage({ id: 'app.descriptionOfTheEvent' })}
            mb="24px"
            size="lg"
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
                {intl.formatMessage({ id: 'app.prev' })}
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
                {intl.formatMessage({ id: 'app.next' })}
              </Text>
            </Button>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default WeatherTab;
