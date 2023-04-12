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
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { dashboardTableData, timelineData } from "variables/general";
import { object, string } from "zod";
import {
  setCompany,
  setCompanyEstablishment,
} from "store/features/companySlice";
import {
  useCreateCompanyMutation,
  useCreateEstablishmentMutation,
} from "store/features/companyApi";
import { useDispatch, useSelector } from "react-redux";

// assets
import { AiFillSetting } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardWithImage from "components/Card/CardWithImage";
import { FaCube } from "react-icons/fa";
import IconBox from "components/Icons/IconBox";
import { MdModeEdit } from "react-icons/md";
import { RocketIcon } from "components/Icons/Icons";
import Step0 from "./components/Step0";
import Step1a from "./components/Step1a";
import Step2a from "./components/Step2a";
import avatar4 from "assets/img/avatars/avatar4.png";
import { clearForm } from "store/features/formSlice";
import { createCompany } from "store/features/companyApi";
import imageMap from "assets/img/imageMap.png";
import imageParcel1 from "assets/img/ImageParcel1.png";
import { setUserCompany } from "store/features/user.slice";
import { useGetParcelQuery } from "store/features/productApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = object({
  companyName: string().min(1, "Name is required"),
  companyCountry: string().min(1, "Country is required"),
  companyAddress: string().min(1, "Address is required"),
  companyCity: string().min(1, "City is required"),
  companyState: string().min(1, "State is required"),
  companyDescription: string(),
  establishmentName: string().min(1, "Name is required"),
  establishmentCountry: string().min(1, "Country is required"),
  establishmentAddress: string().min(1, "Address is required"),
  establishmentCity: string().min(1, "City is required"),
  establishmentState: string().min(1, "State is required"),
  establishmentDescription: string(),
});

export default function SelectCompany() {
  const textColor = useColorModeValue("gray.700", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
  const iconColor = useColorModeValue("gray.300", "gray.700");
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const [option, setOption] = useState("");

  const dispatch = useDispatch();

  const currentCompany = useSelector(
    (state) => state.form.currentForm?.company
  );

  const currentEstablishment = useSelector(
    (state) => state.form.currentForm?.establishment
  );

  const [
    createCompany,
    {
      data: dataCompany,
      error: errorCompany,
      isSuccess: isSuccessCompany,
      isLoading: isLoadingCompany,
    },
  ] = useCreateCompanyMutation();

  const [
    createEstablishment,
    {
      data: dataEstablishment,
      error: errorEstablishment,
      isSuccess: isSuccessEstablishment,
      isLoading: isLoadingEstablishment,
    },
  ] = useCreateEstablishmentMutation();

  const handleNext = () => {
    setStep(step + 1);
  };

  const onSubmitHandler = () => {
    createCompany(currentCompany);
  };

  useEffect(() => {
    if (isSuccessCompany) {
      dispatch(setCompany(dataCompany));
      const { id, name } = dataCompany;
      dispatch(setUserCompany({ id, name }));
      createEstablishment({ ...currentEstablishment, company: dataCompany.id });
    }
  }, [isSuccessCompany]);

  useEffect(() => {
    if (isSuccessEstablishment) {
      dispatch(setCompanyEstablishment(dataEstablishment));
      dispatch(clearForm());
      navigate(`/admin/dashboard/establishment/${dataEstablishment.id}`);
    }
  }, [isSuccessEstablishment]);

  return (
    <Flex
      direction="column"
      minH="100vh"
      align="center"
      pt={{ sm: "125px", lg: "75px" }}
      w={{ sm: "100%", md: "100%", lg: "100%" }}
      mx="auto"
    >
      <Flex
        direction="column"
        textAlign="center"
        mb={{ sm: "25px", md: "45px" }}
      >
        <Text
          color={textColor}
          fontSize={{ sm: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight="bold"
          mb="8px"
        >
          Create or join a Company
        </Text>
        <Text
          color="gray.400"
          fontWeight="normal"
          fontSize={{ sm: "sm", md: "lg" }}
        >
          Create a new company or join an existing one
        </Text>
      </Flex>

      {/* <form onSubmit={handleSubmit(onSubmitHandler)}> */}
      <FormControl>
        {step === 1 && (
          <Step0
            option={option}
            handleChange={setOption}
            handleNext={handleNext}
          />
        )}
        {step === 2 && option === "create" && (
          <Step1a
            onSubmitStep1={handleNext}
            image={image}
            setImage={setImage}
          />
        )}
        {step === 3 && option === "create" && (
          <Step2a onSubmitHandler={onSubmitHandler} />
        )}
      </FormControl>
      {/* </form> */}

      {/* <Card>
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
        <CardBody>
          <Flex direction="column" w="100%">
            <Flex direction={{ sm: "column", md: "row" }} w="100%" mb="24px">
              <Box
                position="relative"
                minW={{ sm: "110px", xl: "150px" }}
                h={{ sm: "110px", xl: "150px" }}
                mx={{ sm: "auto", md: "40px", xl: "85px" }}
                mb={{ sm: "25px" }}
              >
                <Avatar src={avatar4} w="100%" h="100%" borderRadius="12px" />
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
                  <FormLabel color={textColor} fontSize="xs" fontWeight="bold">
                    First Name
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    placeholder="eg. Michael"
                    fontSize="xs"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColor} fontSize="xs" fontWeight="bold">
                    Last Name
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    placeholder="eg. Jackson"
                    fontSize="xs"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColor} fontSize="xs" fontWeight="bold">
                    Email Address
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    placeholder="eg. example@address.com"
                    fontSize="xs"
                  />
                </FormControl>
              </Stack>
            </Flex>
            <Button
              variant="no-hover"
              bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
              alignSelf="flex-end"
              mt="24px"
              w={{ sm: "75px", lg: "100px" }}
              h="35px"
              onClick={() => accountTab.current.click()}
            >
              <Text fontSize="xs" color="#fff" fontWeight="bold">
                NEXT
              </Text>
            </Button>
          </Flex>
        </CardBody>
      </Card> */}

      {/* <Card>
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
              What kind of event are you going to record?
            </Text>
            <Text color="gray.400" fontWeight="normal" fontSize="sm">
              If it is not within the options, you can select the other option
              and specify in the next step.
            </Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex direction="column" w="100%">
            <Stack
              direction={{ sm: "column", md: "row" }}
              spacing={{ sm: "20px", lg: "35px" }}
              alignSelf="center"
              justifySelf="center"
              mb="24px"
            >
              <Flex direction="column" align="center">
                <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                  <Flex
                    w="100%"
                    h="100%"
                    borderRadius="12px"
                    justify="center"
                    transition=".5s all ease"
                    border="1px solid lightgray"
                    align="center"
                    bg={checkboxes.design ? "green.400" : "#fff"}
                    _hover={{ opacity: "0.8" }}
                  >
                    <Checkbox
                      onChange={() =>
                        setCheckboxes((prevCheckboxes) => {
                          return {
                            ...prevCheckboxes,
                            design: !prevCheckboxes.design,
                          };
                        })
                      }
                      display="none"
                    />
                    <Icon
                      as={AiFillSetting}
                      w="54px"
                      h="54px"
                      color={checkboxes.design ? "#fff" : iconColor}
                    />
                  </Flex>
                </FormLabel>
                <Text color={textColor} fontWeight="bold" fontSize="md">
                  Design
                </Text>
              </Flex>
              <Flex direction="column" align="center">
                <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                  <Flex
                    w="100%"
                    h="100%"
                    borderRadius="12px"
                    justify="center"
                    transition=".5s all ease"
                    border="1px solid lightgray"
                    align="center"
                    bg={checkboxes.code ? "green.400" : "#fff"}
                    _hover={{ opacity: "0.8" }}
                  >
                    <Checkbox
                      onChange={() =>
                        setCheckboxes((prevCheckboxes) => {
                          return {
                            ...prevCheckboxes,
                            code: !prevCheckboxes.code,
                          };
                        })
                      }
                      display="none"
                    />
                    <Icon
                      as={FaCube}
                      w="54px"
                      h="54px"
                      color={checkboxes.code ? "#fff" : iconColor}
                    />
                  </Flex>
                </FormLabel>
                <Text color={textColor} fontWeight="bold" fontSize="md">
                  Code
                </Text>
              </Flex>
              <Flex direction="column" align="center">
                <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                  <Flex
                    w="100%"
                    h="100%"
                    borderRadius="12px"
                    justify="center"
                    transition=".5s all ease"
                    border="1px solid lightgray"
                    align="center"
                    bg={checkboxes.develop ? "green.400" : "#fff"}
                    _hover={{ opacity: "0.8" }}
                  >
                    <Checkbox
                      onChange={() =>
                        setCheckboxes((prevCheckboxes) => {
                          return {
                            ...prevCheckboxes,
                            develop: !prevCheckboxes.develop,
                          };
                        })
                      }
                      display="none"
                    />
                    <Icon
                      as={RocketIcon}
                      w="54px"
                      h="54px"
                      color={checkboxes.develop ? "#fff" : iconColor}
                    />
                  </Flex>
                </FormLabel>
                <Text color={textColor} fontWeight="bold" fontSize="md">
                  Develop
                </Text>
              </Flex>
            </Stack>

            <Flex justify="space-between">
              <Button
                variant="no-hover"
                bg={bgPrevButton}
                alignSelf="flex-end"
                mt="24px"
                w={{ sm: "75px", lg: "100px" }}
                h="35px"
                onClick={() => aboutTab.current.click()}
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
                onClick={() => addressTab.current.click()}
              >
                <Text fontSize="xs" color="#fff" fontWeight="bold">
                  NEXT
                </Text>
              </Button>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
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
              Are you living in a nice area?
            </Text>
            <Text color="gray.400" fontWeight="normal" fontSize="sm">
              One thing I love about the later sunsets is the chance to go for a
              walk through the neighborhood woods before dinner
            </Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex direction="column" w="100%">
            <Stack direction="column" spacing="20px">
              <FormControl>
                <FormLabel color={textColor} fontWeight="bold" fontSize="xs">
                  Address 1
                </FormLabel>
                <Input
                  borderRadius="15px"
                  placeholder="eg. Street 120"
                  fontSize="xs"
                />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor} fontWeight="bold" fontSize="xs">
                  Address 2
                </FormLabel>
                <Input
                  borderRadius="15px"
                  placeholder="eg. Street 220"
                  fontSize="xs"
                />
              </FormControl>
              <Grid
                templateColumns={{ sm: "1fr 1fr", lg: "2fr 1fr 1fr" }}
                gap="30px"
              >
                <FormControl gridColumn={{ sm: "1 / 3", lg: "auto" }}>
                  <FormLabel color={textColor} fontWeight="bold" fontSize="xs">
                    City
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    placeholder="eg. Tokyo"
                    fontSize="xs"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColor} fontWeight="bold" fontSize="xs">
                    State
                  </FormLabel>
                  <Input borderRadius="15px" placeholder="..." fontSize="xs" />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColor} fontWeight="bold" fontSize="xs">
                    ZIP
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    placeholder="7 letters"
                    fontSize="xs"
                  />
                </FormControl>
              </Grid>
            </Stack>
            <Flex justify="space-between">
              <Button
                variant="no-hover"
                bg={bgPrevButton}
                alignSelf="flex-end"
                mt="24px"
                w={{ sm: "75px", lg: "100px" }}
                h="35px"
                onClick={() => accountTab.current.click()}
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
              >
                <Text fontSize="xs" color="#fff" fontWeight="bold">
                  SEND
                </Text>
              </Button>
            </Flex>
          </Flex>
        </CardBody> 
      </Card>*/}
    </Flex>
  );
}
