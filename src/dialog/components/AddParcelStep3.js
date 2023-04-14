// Chakra imports
import {
  Button,
  Checkbox,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
// Custom components
import React, { useEffect, useState } from "react";
import { object, string } from "zod";
import { useDispatch, useSelector } from "react-redux";

import { BsFillCloudLightningRainFill } from "react-icons/bs";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import ChemicalTab from "./ChemicalTab.js";
import { FaPlus } from "react-icons/fa";
import FormInput from "components/Forms/FormInput";
import OtherTab from "./OtherTab.js";
import { RocketIcon } from "components/Icons/Icons";
import { SlChemistry } from "react-icons/sl";
import WeatherTab from "./WeatherTab.js";
import { setEstablishmentParcel } from "store/features/companySlice.js";
import { setForm } from "store/features/formSlice";
import { useCreateParcelMutation } from "store/features/productApi.js";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = object({
  contactNumber: string().min(1, "Contact Number is required"),
  address: string().min(1, "Address is required"),
});

const AddEventStep3 = ({ onClose }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");

  const { establishmentId } = useParams();

  const [
    createEvent,
    { data, error, isSuccess, isLoading },
  ] = useCreateParcelMutation();

  const dispatch = useDispatch();

  const currentParcel = useSelector((state) => state.form.currentForm?.parcel);

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const onSubmit = (data) => {
    createEvent({
      ...currentParcel,
      ...data,
      establishment: parseInt(establishmentId),
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        setEstablishmentParcel({
          parcel: data,
          establishmentId: parseInt(establishmentId),
        })
      );
      onClose();
    }
  }, [isSuccess, data]);

  return (
    <Card>
      <CardHeader mb="40px">
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          w="80%"
          mx="auto"
        >
          <Text color={textColor} fontSize="lg" fontWeight="bold" mb="4px">
            Do you want to certificate this parcel?
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            In the following inputs you must give detailed information in order
            to certify this parcel.
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          <Stack direction="column" spacing="20px">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <FormControl display="flex" alignItems="center" mb="25px">
                  <Switch id="remember-login" colorScheme="green" me="10px" />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    ms="1"
                    fontWeight="normal"
                  >
                    Yes, I want to certify this parcel
                  </FormLabel>
                </FormControl>
                <FormLabel color={textColor} fontSize="xs" fontWeight="bold">
                  Contact number
                </FormLabel>
                <FormInput
                  fontSize="xs"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="Contact number of the parcel"
                  name="contactNumber"
                  mb="25px"
                />
                <FormLabel color={textColor} fontSize="xs" fontWeight="bold">
                  Address
                </FormLabel>
                <FormInput
                  fontSize="xs"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="Address of the parcel"
                  name="address"
                />
                <Flex justify="space-between" width={"100%"}>
                  <Button
                    variant="no-hover"
                    bg={bgPrevButton}
                    alignSelf="flex-end"
                    mt="24px"
                    w={{ sm: "75px", lg: "100px" }}
                    h="35px"
                    onClick={() => prevTab.current.click()}
                  >
                    <Text fontSize="xs" color="gray.700" fontWeight="bold">
                      PREV
                    </Text>
                  </Button>
                  <Button
                    bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                    _hover={{
                      bg:
                        "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
                    }}
                    alignSelf="flex-end"
                    mt="24px"
                    w={{ sm: "75px", lg: "100px" }}
                    h="35px"
                    type="submit"
                  >
                    {isLoading ? (
                      <CircularProgress
                        isIndeterminate
                        value={1}
                        color="#313860"
                        size="25px"
                      />
                    ) : (
                      <Text fontSize="xs" color="#fff" fontWeight="bold">
                        SEND
                      </Text>
                    )}
                  </Button>
                </Flex>
              </form>
            </FormProvider>
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AddEventStep3;
