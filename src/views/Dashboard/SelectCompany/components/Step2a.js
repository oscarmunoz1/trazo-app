// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { dashboardTableData, timelineData } from "variables/general";
import { object, string } from "zod";

// assets
import { AiFillSetting } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardWithImage from "components/Card/CardWithImage";
import Editor from "components/Editor/Editor";
import { FaCube } from "react-icons/fa";
import FormInput from "components/Forms/FormInput";
import IconBox from "components/Icons/IconBox";
import { MdModeEdit } from "react-icons/md";
import { RocketIcon } from "components/Icons/Icons";
import avatar4 from "assets/img/avatars/avatar4.png";
import imageMap from "assets/img/imageMap.png";
import parcel1 from "assets/img/ImageParcel1.png";
import { setForm } from "store/features/formSlice";
import { useDispatch } from "react-redux";
import { useGetParcelQuery } from "store/features/productApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = object({
  name: string().min(1, "Name is required"),
  country: string().min(1, "Country is required"),
  address: string().min(1, "Address is required"),
  city: string().min(1, "City is required"),
  state: string().min(1, "State is required"),
  description: string(),
});

export default function Step2a({ onSubmitHandler }) {
  const textColor = useColorModeValue("gray.700", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
  const iconColor = useColorModeValue("gray.300", "gray.700");

  const dispatch = useDispatch();

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const onSubmit = (data) => {
    dispatch(setForm({ establishment: data }));
    onSubmitHandler();
  };

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
            Now let's create the first establishment
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            Let us know the name of your establishment and the address where it
            is located so that then we can start to create your first parcel.
          </Text>
        </Flex>
      </CardHeader>
      <CardBody justifyContent={"center"}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "75%" }}>
            <Flex direction="column" w="100%">
              <Flex direction={{ sm: "column", md: "row" }} w="100%">
                <Box
                  position="relative"
                  minW={{ sm: "200px", xl: "240px" }}
                  h={{ sm: "110px", xl: "150px" }}
                  m={{ sm: "5px", md: "10px", xl: "50px" }}
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
                    <Flex direction={"column"} grow={"1"}>
                      <FormLabel
                        color={textColor}
                        fontSize="xs"
                        fontWeight="bold"
                        pt="15px"
                      >
                        Name
                      </FormLabel>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        placeholder="Name of the company"
                        name="name"
                      />
                      <FormLabel
                        color={textColor}
                        fontSize="xs"
                        fontWeight="bold"
                        pt="15px"
                      >
                        Address
                      </FormLabel>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        placeholder="Address of the company"
                        name="address"
                      />
                    </Flex>
                  </FormControl>
                </Stack>
              </Flex>
              <FormControl mb="25px">
                <FormLabel
                  color={textColor}
                  fontSize="xs"
                  fontWeight="bold"
                  pt="15px"
                >
                  Country
                </FormLabel>
                <FormInput
                  fontSize="xs"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="Country of the company"
                  name="country"
                />
                <Flex direction={"row"} width={"100%"} gap="20px" pt="15px">
                  <Flex direction={"column"} flexGrow={"1"}>
                    <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                      City
                    </FormLabel>
                    <FormInput
                      fontSize="xs"
                      ms="4px"
                      borderRadius="15px"
                      type="text"
                      placeholder="City of the company"
                      name="city"
                    />
                  </Flex>
                  <Flex direction={"column"} flexGrow={"1"}>
                    <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                      State
                    </FormLabel>
                    <FormInput
                      fontSize="xs"
                      ms="4px"
                      borderRadius="15px"
                      type="text"
                      placeholder="State of the company"
                      name="state"
                    />
                  </Flex>
                </Flex>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold" pt="15px">
                  Description
                </FormLabel>
                <FormInput
                  fontSize="xs"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="Description of the company"
                  name="description"
                />
              </FormControl>

              <Flex justify="space-between">
                <Button
                  variant="no-hover"
                  bg={bgPrevButton}
                  alignSelf="flex-end"
                  mt="24px"
                  w={{ sm: "75px", lg: "100px" }}
                  h="35px"
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
            </Flex>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
