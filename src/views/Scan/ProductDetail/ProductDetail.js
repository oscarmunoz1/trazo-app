// Chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  ListItem,
  Progress,
  Select,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { FaRegCheckCircle, FaRegDotCircle } from "react-icons/fa";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { TypeOf, object, string } from "zod";

import BgSignUp from "assets/img/basic-auth.png";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
// import CameraCard from "./components/CameraCard";
import FormInput from "components/Forms/FormInput";
import ImageParcel1 from "assets/img/ImageParcel1.png";
import ProfileInformation from "./components/ProfileInformation";
import TimelineRow from "components/Tables/TimelineRow";
import productPage1 from "assets/img/ProductImage1.png";
import productPage2 from "assets/img/ProductImage2.png";
import productPage3 from "assets/img/ProductImage3.png";
import productPage4 from "assets/img/ProductImage4.png";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "store/features/authApi";
import { zodResolver } from "@hookform/resolvers/zod";

// Assets

const registerSchema = object({
  first_name: string().min(1, "Full name is required").max(100),
  last_name: string().min(1, "Full name is required").max(100),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  password2: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.password2, {
  path: ["password2"],
  message: "Passwords do not match",
});

function Capture() {
  const titleColor = useColorModeValue("green.300", "green.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("green.200", "rgba(255, 255, 255, 0.5)");
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(productPage1);

  const methods = useForm({
    resolver: zodResolver(registerSchema),
  });

  const currentHistory = [
    {
      id: 60,
      name: "La Primavera",
      description: "<p>x</p>",
      date: "2023-07-16T15:48:00Z",
      image: null,
      certified: false,
      index: 1,
      type: "HW",
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null,
    },
    {
      id: 61,
      name: "La Primavera",
      description: "<p>x</p>",
      date: "2023-07-16T15:48:00Z",
      image: null,
      certified: false,
      index: 1,
      type: "HW",
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null,
    },
    {
      id: 62,
      name: "La Primavera",
      description: "<p>x</p>",
      date: "2023-07-16T15:48:00Z",
      image: null,
      certified: false,
      index: 1,
      type: "HW",
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null,
    },
    {
      id: 64,
      name: "La Primavera",
      description: "<p>x</p>",
      date: "2023-07-16T15:48:00Z",
      image: null,
      certified: false,
      index: 1,
      type: "HW",
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null,
    },
  ];

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const [
    registerUser,
    { isLoading, isSuccess, error, isError },
  ] = useSignUpMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/auth/verifyemail");
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (values) => {
    registerUser(values);
  };

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
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
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
          Welcome!
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "25%" }}
        >
          Here you can find all the information about the product you scanned.
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Card
          mt={{ md: "75px" }}
          w={{ sm: "100%", md: "98%", lg: "95%" }}
          p={{ sm: "16px", md: "32px", lg: "48px" }}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px"
        >
          <CardHeader mb="42px">
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              Product Details
            </Text>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              <Flex
                direction={{ sm: "column", lg: "row" }}
                mb={{ sm: "42px", lg: "84px" }}
              >
                <Flex
                  direction="column"
                  me={{ lg: "70px", xl: "120px" }}
                  mb={{ sm: "24px", lg: "0px" }}
                >
                  <Box
                    w={{ sm: "275px", md: "670px", lg: "450px", xl: "600px" }}
                    h={{ sm: "200px", md: "500px", lg: "330px", xl: "500px" }}
                    mb="26px"
                    mx={{ sm: "auto", lg: "0px" }}
                  >
                    <Image
                      src={currentImage}
                      w="100%"
                      h="100%"
                      borderRadius="15px"
                    />
                  </Box>
                  <Stack
                    direction="row"
                    spacing={{ sm: "20px", md: "35px", lg: "20px" }}
                    mx="auto"
                    mb={{ sm: "24px", lg: "0px" }}
                  >
                    <Box
                      w={{ sm: "36px", md: "90px", lg: "60px" }}
                      h={{ sm: "36px", md: "90px", lg: "60px" }}
                    >
                      <Image
                        src={productPage1}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                    <Box
                      w={{ sm: "36px", md: "90px", lg: "60px" }}
                      h={{ sm: "36px", md: "90px", lg: "60px" }}
                    >
                      <Image
                        src={productPage2}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                    <Box
                      w={{ sm: "36px", md: "90px", lg: "60px" }}
                      h={{ sm: "36px", md: "90px", lg: "60px" }}
                    >
                      <Image
                        src={productPage3}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                    <Box
                      w={{ sm: "36px", md: "90px", lg: "60px" }}
                      h={{ sm: "36px", md: "90px", lg: "60px" }}
                    >
                      <Image
                        src={productPage4}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                    <Box
                      w={{ sm: "36px", md: "90px", lg: "60px" }}
                      h={{ sm: "36px", md: "90px", lg: "60px" }}
                    >
                      <Image
                        src={productPage2}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                  </Stack>
                </Flex>
                <Flex direction="column">
                  <Text
                    color={textColor}
                    fontSize="3xl"
                    fontWeight="bold"
                    mb="12px"
                  >
                    Orange
                  </Text>
                  <Stack
                    direction="row"
                    spacing="12px"
                    color="orange.300"
                    mb="30px"
                  >
                    <Icon as={BsStarFill} w="26px" h="26px" />
                    <Icon as={BsStarFill} w="26px" h="26px" />
                    <Icon as={BsStarFill} w="26px" h="26px" />
                    <Icon as={BsStarFill} w="26px" h="26px" />
                    <Icon as={BsStarHalf} w="26px" h="26px" />
                  </Stack>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    Company
                  </Text>
                  <Text
                    color={textColor}
                    fontWeight="bold"
                    fontSize="3xl"
                    mb="12px"
                  >
                    La Primavera
                  </Text>
                  <Badge
                    colorScheme="green"
                    w="95px"
                    h="28px"
                    mb="40px"
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    CERTIFIED
                  </Badge>
                  <ProfileInformation
                    title={"Product Information"}
                    country={"Uruguay"}
                    description={
                      "Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                    }
                    establishment={"La Esperanza"}
                    parcel={"Parcel #1"}
                    email={"esthera@simmmple.com"}
                    location={"United States"}
                  />

                  <Flex direction="column" width={"100%"}>
                    <Text
                      fontSize="lg"
                      color={textColor}
                      fontWeight="bold"
                      pb="24px"
                    >
                      Events
                    </Text>
                    {currentHistory?.map((event, index, arr) => {
                      return (
                        <TimelineRow
                          key={event.id}
                          logo={
                            event.certified ? FaRegCheckCircle : FaRegDotCircle
                          }
                          title={event.name}
                          date={new Date(event.date).toDateString()}
                          color={event.certified ? "green.300" : "blue.400"}
                          index={index}
                          arrLength={arr.length}
                          isLast={index === arr.length - 1}
                        />
                      );
                    })}
                  </Flex>

                  <Button
                    variant="no-hover"
                    bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                    w={{ sm: "240px", md: "100%", lg: "240px" }}
                    h="50px"
                    mx={{ sm: "auto", md: "0px" }}
                    color="#fff"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    I BOUGHT IT
                  </Button>
                </Flex>
              </Flex>
              <Text fontSize="lg" color={textColor} fontWeight="bold" mb="24px">
                Similar Products
              </Text>
              <Box w="100%">
                <Table variant="simple" w="100%">
                  <Thead>
                    <Tr>
                      <Th
                        color="gray.400"
                        fontSize="xs"
                        paddingInlineStart={"0"}
                      >
                        Name
                      </Th>
                      <Th color="gray.400" fontSize="xs">
                        Review
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td minW="300px" paddingInlineStart={"0"}>
                        <Flex align="center">
                          <Box w="40px" h="40px" me="14px">
                            <Image
                              src={productPage2}
                              w="100%"
                              h="100%"
                              borderRadius="12px"
                            />
                          </Box>
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Christopher Knight Home
                          </Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Stack direction="row" color="gray.700" spacing="2px">
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarHalf} w="10px" h="10px" />
                        </Stack>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td paddingInlineStart={"0"}>
                        <Flex align="center">
                          <Box w="40px" h="40px" me="14px">
                            <Image
                              src={productPage3}
                              w="100%"
                              h="100%"
                              borderRadius="12px"
                            />
                          </Box>
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Bar Height Swivel Barstool
                          </Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Stack direction="row" color="gray.700" spacing="2px">
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                        </Stack>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td paddingInlineStart={"0"}>
                        <Flex align="center">
                          <Box w="40px" h="40px" me="14px">
                            <Image
                              src={productPage4}
                              w="100%"
                              h="100%"
                              borderRadius="12px"
                            />
                          </Box>
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Signature Design by Ashley
                          </Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Stack direction="row" color="gray.700" spacing="2px">
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                        </Stack>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td paddingInlineStart={"0"} border="none">
                        <Flex align="center">
                          <Box w="40px" h="40px" me="14px">
                            <Image
                              src={productPage2}
                              w="100%"
                              h="100%"
                              borderRadius="12px"
                            />
                          </Box>
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Modern Square
                          </Text>
                        </Flex>
                      </Td>
                      <Td border="none">
                        <Stack direction="row" color="gray.700" spacing="2px">
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarFill} w="10px" h="10px" />
                          <Icon as={BsStarHalf} w="10px" h="10px" />
                        </Stack>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}

export default Capture;
