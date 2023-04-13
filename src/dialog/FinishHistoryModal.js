/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
// Custom components
import React, { useEffect, useRef, useState } from "react";
import { number, object, string } from "zod";

import { FaPlus } from "react-icons/fa";
import FormInput from "components/Forms/FormInput";
import { setCurrentHistory } from "../store/features/historySlice";
import { useDispatch } from "react-redux";
import { useFinishCurrentHistoryMutation } from "store/features/historyApi.js";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = object({
  production_amount: string()
    .min(1, "Production amount is required")
    .transform((val) => Number(val)),
  lot_id: string().min(1, "Lot ID is required"),
  finish_date: string().min(1, "Lot ID is required"),
  observation: string().optional(),
});

const FinishHistoryModal = ({ title, onClose, isOpen }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");

  const dispatch = useDispatch();

  const currentParcelId = useSelector(
    (state) => state.product.currentParcel?.id
  );

  const [
    finishCurrentHistory,
    { data, error, isSuccess, isLoading },
  ] = useFinishCurrentHistoryMutation();

  const handleAddEvent = () => {
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCurrentHistory(null));
      onClose();
    }
  }, [isSuccess]);

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
    finishCurrentHistory({ parcelId: currentParcelId, historyData: data });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ sm: "80%", md: "50%" }}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Flex gap={"20px"}>
                  <Flex flexDir={"column"} flexGrow={1}>
                    <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                      Production amount
                    </FormLabel>
                    <FormInput
                      fontSize="sm"
                      ms="4px"
                      borderRadius="15px"
                      type="text"
                      placeholder="Volume of the product"
                      mb="24px"
                      size="lg"
                      name="production_amount"
                    />
                  </Flex>
                  <Flex flexDir={"column"} flexGrow={1}>
                    <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                      Lot number
                    </FormLabel>
                    <FormInput
                      fontSize="sm"
                      ms="4px"
                      borderRadius="15px"
                      type="text"
                      placeholder="Area"
                      mb="24px"
                      size="lg"
                      name="lot_id"
                    />
                  </Flex>
                </Flex>
                <Flex flexDir={"column"}>
                  <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                    Finish date
                  </FormLabel>
                  <FormInput
                    fontSize="xs"
                    ms="4px"
                    borderRadius="15px"
                    type="datetime-local"
                    name="finish_date"
                    placeholder="Select date and time"
                    mb="24px"
                  />
                </Flex>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Observations
                </FormLabel>
                <Textarea
                  fontSize="sm"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="Description of the event"
                  mb="24px"
                  size="lg"
                  {...register("observation")}
                />
                <Flex justifyContent={"flex-end"}>
                  <Button
                    variant="no-hover"
                    bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
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
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishHistoryModal;
