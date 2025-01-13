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
// Custom components
import React, { useState } from "react";
import { number, object, string } from "zod";

import { FaPlus } from "react-icons/fa";
import FormInput from "components/Forms/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntl } from 'react-intl';

const formSchemaMainInfo = object({
  type: string().min(1, "Name is required"),
  lower_temperature: string()
    .optional()
    .transform((val) => Number(val)),
  way_of_protection: string().optional(),
  water_deficit: string()
    .optional()
    .transform((val) => Number(val)),
  weight: string()
    .optional()
    .transform((val) => Number(val)),
  diameter: string()
    .optional()
    .transform((val) => Number(val)),
  duration: string()
    .optional()
    .transform((val) => Number(val)),
  highest_temperature: string()
    .optional()
    .transform((val) => Number(val)),
  start_date: string().optional(),
  end_date: string().optional(),
  observation: string().optional(),
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
    watch,
    errors: mainInfoErrors,
    formState: { errors, isSubmitSuccessful },
    register,
  } = mainInfoMethods;

  const type = watch("type", "");

  const onSubmit = (data) => {
    switch (type) {
      case "FR":
        data = {
          type: data.type,
          lower_temperature: data.lower_temperature,
          way_of_protection: data.way_of_protection,  
          observation: data.observation,
        };
        break;
      case "DR":
        data = {
          type: data.type,
          water_deficit: data.water_deficit,
          observation: data.observation,
        };
        break;
      case "HA":
        data = {
          type: data.type,
          weight: data.weight,
          diameter: data.diameter,
          duration: data.duration,
          way_of_protection: data.way_of_protection,
          observation: data.observation,
        };
        break;
      case "HT":
        data = {
          type: data.type,
          highest_temperature: data.highest_temperature,
          start_date: data.start_date,
          end_date: data.end_date,
          observation: data.observation,
        };
        break;
      default:
        data = {
          type: data.type,
          observation: data.observation,
        };
        break;
    }

    onSubmitHandler(data);
  };

  return (
    <FormProvider {...mainInfoMethods}>
      <form onSubmit={mainInfoSubmit(onSubmit)} style={{ width: "100%" }}>
        <Flex direction="column" w="100%">
          <Flex gap={"20px"}>
            <Flex flexDir={"column"} flexGrow={1}>
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
                <option value="FR">{intl.formatMessage({ id: 'app.frost' })}</option>
                <option value="DR">{intl.formatMessage({ id: 'app.drought' })}</option>
                <option value="HA">{intl.formatMessage({ id: 'app.hailstorms' })}</option>
                <option value="HT">{intl.formatMessage({ id: 'app.highTemperatures' })}</option>
                <option value="TS">{intl.formatMessage({ id: 'app.tropicalStorm' })}</option>
                <option value="HW">{intl.formatMessage({ id: 'app.highWinds' })}</option>
                <option value="HH">{intl.formatMessage({ id: 'app.highHumidity' })}</option>
                <option value="LH">{intl.formatMessage({ id: 'app.lowHumidity' })}</option>
              </ChakraSelect>
              {errors.type && (
                <Text fontSize="sm" color="red.500" mt={"0.5rem"}>
                  {errors.type.message}
                </Text>
              )}
            </Flex>
          </Flex>
          {type === "FR" ? (
            <Flex gap={"20px"}>
              <FormInput
                fontSize="xs"
                label={intl.formatMessage({ id: 'app.lowerTemperature' })}
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder={intl.formatMessage({ id: 'app.temperature' })}
                mb="24px"
                name="lower_temperature"
              />
              <FormInput
                fontSize="xs"
                label={intl.formatMessage({ id: 'app.wayOfProtection' })}
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder={intl.formatMessage({ id: 'app.notNet' })}
                mb="24px"
                name="way_of_protection"
              />
            </Flex>
          ) : type === "DR" ? (
            <Flex gap={"20px"}>
              <FormInput
                fontSize="xs"
                label={intl.formatMessage({ id: 'app.accumulatedWaterDeficit' })}
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder={intl.formatMessage({ id: 'app.waterDeficit' })}
                mb="24px"
                name="water_deficit"
              />
            </Flex>
          ) : type === "HA" ? (
            <>
              <Flex gap={"20px"}>
                <FormInput
                  fontSize="xs"
                  label={intl.formatMessage({ id: 'app.averageWeightOfHailstones' })}
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'app.weight' })}
                  mb="24px"
                  name="weight"
                />
                <FormInput
                  fontSize="xs"
                  label={intl.formatMessage({ id: 'app.averageDiameterOfHailstones' })}
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'app.diameter' })}
                  mb="24px"
                  name="diameter"
                />
              </Flex>
              <Flex gap={"20px"}>
                <FormInput
                  fontSize="xs"
                  label={intl.formatMessage({ id: 'app.duration' })}
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'app.duration' })}
                  mb="24px"
                  name="duration"
                />
                <FormInput
                  fontSize="xs"
                  label={intl.formatMessage({ id: 'app.wayOfProtection' })}
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'app.wayOfProtection' })}
                  mb="24px"
                  name="way_of_protection"
                />
              </Flex>
            </>
          ) : type === "HT" ? (
            <Flex gap={"20px"} direction={"column"}>
              <FormInput
                fontSize="xs"
                label={intl.formatMessage({ id: 'app.highestTemperature' })}
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder={intl.formatMessage({ id: 'app.temperature' })}
                mb="24px"
                name="highest_temperature"
              />
              <Flex flexDir={"column"}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  {intl.formatMessage({ id: 'app.timePeriod' })}
                </FormLabel>
                <Flex flexDir={"row"} width={"100%"} gap={"20px"}>
                  <Flex flexDir={"column"} flexGrow={1}>
                    <FormLabel
                      ms="4px"
                      fontSize="xs"
                      fontWeight="bold"
                      mb={"0"}
                      textAlign={"end"}
                    >
                      {intl.formatMessage({ id: 'app.from' })}
                    </FormLabel>
                    <FormInput
                      fontSize="xs"
                      ms="4px"
                      borderRadius="15px"
                      type="datetime-local"
                      name="start_date"
                      placeholder={intl.formatMessage({ id: 'app.selectDateAndTime' })}
                      mb="24px"
                    />
                  </Flex>
                  <Flex flexDir={"column"} flexGrow={1}>
                    <FormLabel
                      ms="4px"
                      fontSize="xs"
                      fontWeight="bold"
                      mb={"0"}
                      textAlign={"end"}
                    >
                      {intl.formatMessage({ id: 'app.to' })}
                    </FormLabel>
                    <FormInput
                      fontSize="xs"
                      ms="4px"
                      borderRadius="15px"
                      type="datetime-local"
                      name="end_date"
                      placeholder={intl.formatMessage({ id: 'app.selectDateAndTime' })}
                      mb="24px"
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}

          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
            {intl.formatMessage({ id: 'app.observations' })}
          </FormLabel>
          <Textarea
            fontSize="sm"
            ms="4px"
            borderRadius="15px"
            type="text"
            placeholder={intl.formatMessage({ id: 'app.description' })}
            mb="24px"
            size="lg"
            name="observation"
            {...register("observation")}
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
