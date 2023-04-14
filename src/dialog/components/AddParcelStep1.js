// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
// Custom components
import React, { useEffect, useRef, useState } from "react";
import { object, string } from "zod";
import { useDispatch, useSelector } from "react-redux";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import Editor from "components/Editor/Editor";
import { FaPlus } from "react-icons/fa";
import FormInput from "components/Forms/FormInput";
import IconBox from "components/Icons/IconBox";
import { MdModeEdit } from "react-icons/md";
import Select from "react-select";
import parcel1 from "assets/img/ImageParcel1.png";
import { setForm } from "store/features/formSlice";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

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
    minHeight: "43px",
  }),
};

const orderOptions = (values) => {
  return values
    .filter((v) => v.isFixed)
    .concat(values.filter((v) => !v.isFixed));
};

const formSchema = object({
  name: string().min(1, "Name is required"),
  area: string().min(1, "Area is required"),
  product: string().min(1, "Product is required"),
  description: string().optional(),
});

const AddParcelStep1 = ({ onClose, isOpen, nextTab, onSubmit }) => {
  const dispatch = useDispatch();

  const onSubmitStep1 = (data) => {
    dispatch(setForm({ parcel: data }));
    onSubmit();
  };

  const textColor = useColorModeValue("gray.700", "white");

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isSubmitSuccessful },
  } = methods;

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
            Let's start with the basic information
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            Let us know your name and email address. Use an address you don't
            mind other users contacting you at
          </Text>
        </Flex>
      </CardHeader>
      <CardBody justifyContent="center">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitStep1)}
            style={{ width: "100%" }}
          >
            <Flex direction="column" w="100%">
              <Flex direction={{ sm: "column", md: "row" }} w="100%">
                <Box
                  position="relative"
                  minW={{ sm: "200px", xl: "240px" }}
                  h={{ sm: "110px", xl: "150px" }}
                  mx={{ sm: "5px", md: "10px", xl: "20px" }}
                  mb={{ sm: "25px" }}
                >
                  <Avatar src={parcel1} w="100%" h="100%" borderRadius="12px" />
                  <IconBox
                    bg="#fff"
                    h="35px"
                    w="35px"
                    boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.06)"
                    position="absolute"
                    right="-10px"
                    bottom="-10px"
                    cursor="pointer"
                  >
                    <Icon as={MdModeEdit} w="15px" h="15px" color="#333" />
                  </IconBox>
                </Box>
                <Stack direction="column" spacing="20px" w="100%">
                  <FormControl>
                    <Flex direction={"column"} grow={"1"} pr={"32px"}>
                      <FormLabel
                        color={textColor}
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        Name
                      </FormLabel>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        placeholder="Name of the parcel"
                        name="name"
                      />
                      <FormLabel
                        color={textColor}
                        pt={"16px"}
                        ms="4px"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        Product
                      </FormLabel>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        name="product"
                        placeholder="Product of the parcel"
                      />
                    </Flex>
                  </FormControl>
                </Stack>
              </Flex>
              <FormControl mb="25px">
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Description
                </FormLabel>
                <Editor />
              </FormControl>
              <FormControl>
                <FormLabel
                  color={textColor}
                  pt={"16px"}
                  ms="4px"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  Area
                </FormLabel>
                <FormInput
                  fontSize="xs"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  name="area"
                  placeholder="Area of the parcel"
                />
              </FormControl>

              <Button
                variant="no-hover"
                bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                alignSelf="flex-end"
                mt="24px"
                w={{ sm: "75px", lg: "100px" }}
                h="35px"
                // onClick={() => nextTab.current.click()}
                type="submit"
              >
                <Text fontSize="xs" color="#fff" fontWeight="bold">
                  NEXT
                </Text>
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export default AddParcelStep1;
