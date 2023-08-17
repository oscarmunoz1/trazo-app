// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { TypeOf, object, string } from "zod";
import { useLocation, useNavigate } from "react-router-dom";

import BgSignUp from "assets/img/basic-auth.png";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import EditParcel from "../components/forms/EditParcel";
import FormInput from "components/Forms/FormInput";
import NewParcel from "../components/forms/NewParcel";
import { useSignUpMutation } from "store/features/authApi";
import { zodResolver } from "@hookform/resolvers/zod";

function AddParcel({ isEdit = false }) {
  const titleColor = useColorModeValue("green.300", "green.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("green.200", "rgba(255, 255, 255, 0.5)");
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        borderRadius={{ md: "15px" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mt={{ md: "100px" }}
        marginInlineStart={"25px"}
        marginInlineEnd={"25px"}
      ></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        pt={"55px"}
      >
        <Text fontSize="4xl" color="white" fontWeight="bold">
          {isEdit ? "Edit the selected Parcel" : "Add a new Parcel"}
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "25%" }}
        >
          {isEdit
            ? "Modify the form below to edit the selected parcel."
            : "Complete the form below to add a new parcel to your establishment."}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        {isEdit ? <EditParcel /> : <NewParcel />}
      </Flex>
    </Flex>
  );
}

export default AddParcel;
