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

import { BsCircleFill, BsFillCloudLightningRainFill } from "react-icons/bs";
// Chakra imports
import {
  Button,
  Select as ChakraSelect,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { clearForm, setForm } from "store/features/formSlice";
import { object, string } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardWithMap from "../CardWithMap";
import Editor from "components/Editor/Editor";
import FormInput from "components/Forms/FormInput";
import Header from "views/Pages/Profile/Overview/components/Header";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import { RocketIcon } from "components/Icons/Icons";
import Select from "react-select";
import { SlChemistry } from "react-icons/sl";
import { WeatherTab } from "./WeatherTab";
import { addCompanyEstablishment } from "store/features/companySlice";
import avatar4 from "assets/img/avatars/avatar4.png";
import imageMap from "assets/img/imageMap.png";
import { useCreateEstablishmentMutation } from "store/api/companyApi";
import { useCreateEventMutation } from "store/api/historyApi";
import { useDropzone } from "react-dropzone";
import { useGoogleMap } from "@react-google-maps/api";
import { zodResolver } from "@hookform/resolvers/zod";

// Custom components
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
    minHeight: "40px",
    fontSize: "0.75rem;",
    marginLeft: "4px",
  }),
};

const formSchemaBasic = object({
  name: string().min(1, "Name is required"),
  date: string().min(1, "Date is required"),
});

const formSchemaMainInfo = object({
  type: string().min(1, "Name is required"),
});

const formSchemaDescription = object({
  description: string().min(1, "Description is required"),
});

const formSchemaSocials = object({
  facebook: string(),
  instagram: string(),
});

const formSchemaMedia = object({});

const formSchema = object({
  name: string().min(1, "Name is required"),
  country: string().min(1, "Country is required"),
  state: string().min(1, "State is required"),
  city: string().min(1, "City is required"),
  zone: string(),
  description: string().min(1, "Description is required"),
  facebook: string(),
  instagram: string(),
});

const orderOptions = (values) => {
  return values
    ?.filter((v) => v.isFixed)
    .concat(values.filter((v) => !v.isFixed));
};

function NewEstablishment() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
  const bgColor = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("gray.300", "gray.700");
  const bgActiveButton = useColorModeValue("gray.200", "gray.700");
  const bgButtonGroup = useColorModeValue("gray.50", "gray.600");
  const bgTimesIcon = useColorModeValue("gray.700", "gray.500");
  // const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState(null);

  const currentEvent = useSelector((state) => state.form.currentForm?.event);
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { parcelId, establishmentId } = useParams();

  const [activeBullets, setActiveBullets] = useState({
    basic: true,
    mainInfo: false,
    description: false,
    media: false,
  });

  const basicTab = useRef();
  const mainInfoTab = useRef();
  const descriptionTab = useRef();
  const mediaTab = useRef();

  const { getRootProps, getInputProps } = useDropzone();

  const parcels = useSelector((state) =>
    state.company.currentCompany?.establishments.reduce(
      (res_parcels, establishment) => {
        const establishmentParcels = establishment.parcels.map((parcel) => {
          if (parcel.id === Number(parcelId)) {
            return {
              value: parcel.id,
              label: parcel.name,
              isFixed: true,
            };
          }
          return {
            value: parcel.id,
            label: parcel.name,
          };
        });
        return res_parcels.concat(establishmentParcels);
      },
      []
    )
  );

  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic),
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = basicMethods;

  const onSubmitBasic = (data) => {
    dispatch(
      setForm({
        event: {
          ...data,
          parcels: value.map((v) => v.value),
          event_type: activeButton,
        },
      })
    );
    mainInfoTab.current.click();
  };

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo),
  });

  const {
    reset: mainInfoReset,
    handleSubmit: mainInfoSubmit,
    errors: mainInfoErrors,
    register,
  } = mainInfoMethods;

  const onSubmitMainInfo = (data) => {
    dispatch(
      setForm({
        event: {
          ...currentEvent,
          type: data.type,
        },
      })
    );
    descriptionTab.current.click();
  };

  const descriptionMethods = useForm({
    resolver: zodResolver(formSchemaDescription),
  });

  const {
    reset: descriptionReset,
    handleSubmit: descriptionSubmit,
  } = descriptionMethods;

  const onSubmitDescription = (data) => {
    console.log(data);
    dispatch(
      setForm({
        event: {
          ...currentEvent,
          description: data.description,
        },
      })
    );
    mediaTab.current.click();
  };

  const mediaMethods = useForm({
    resolver: zodResolver(formSchemaMedia),
  });

  const { reset: mediaReset, handleSubmit: mediaSubmit } = mediaMethods;

  const [
    createEvent,
    { data, error, isSuccess, isLoading },
  ] = useCreateEventMutation();

  const onSubmitMedia = (data) => {
    console.log(data);

    createEvent({
      ...currentEvent,
      company: currentCompany.id,
      parcel: parseInt(parcelId),
    });
    // createEstablishment({
    //   ...currentEvent,
    //   ...(data?.facebook && { facebook: data.facebook }),
    //   ...(data?.instagram && { instagram: data.instagram }),
    //   company: currentCompany.id,
    // });
  };

  useEffect(() => {
    if (isSuccess) {
      // dispatch(addCompanyEstablishment(dataEstablishment));
      dispatch(clearForm());
      navigate(
        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`
      );
    }
  }, [isSuccess]);

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = parcels.filter((v) => v.isFixed);
        break;
    }
    setValue(orderOptions(newValue));
  };

  useEffect(() => {
    if (parcels && value === null) {
      setValue(parcels.filter((v) => v.isFixed));
    }
  }, [parcels]);

  return (
    <Flex
      direction="column"
      bg={bgColor}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px"
    >
      <Tabs variant="unstyled" mt="24px" alignSelf="center">
        <TabList display="flex" align="center">
          <Tab
            ref={basicTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                basic: true,
                mainInfo: false,
                description: false,
                media: false,
              })
            }
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: "80px", md: "195px" },
                height: "3px",
                bg: activeBullets.mainInfo ? textColor : "gray.200",
                left: { sm: "12px", md: "35px" },
                top: {
                  sm: activeBullets.basic ? "6px" : "4px",
                  md: null,
                },
                position: "absolute",
                bottom: activeBullets.basic ? "40px" : "38px",

                transition: "all .3s ease",
              }}
            >
              <Icon
                as={BsCircleFill}
                color={activeBullets.basic ? textColor : "gray.300"}
                w={activeBullets.basic ? "16px" : "12px"}
                h={activeBullets.basic ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.basic ? { textColor } : "gray.300"}
                fontWeight={activeBullets.basic ? "bold" : "normal"}
                transition="all .3s ease"
                _hover={{ color: textColor }}
                display={{ sm: "none", md: "block" }}
              >
                1. Basic
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={mainInfoTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                basic: true,
                mainInfo: true,
                description: false,
                media: false,
              })
            }
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: "80px", md: "195px" },
                height: "3px",
                bg: activeBullets.description ? textColor : "gray.200",
                left: { sm: "12px", md: "50px" },
                top: {
                  sm: activeBullets.mainInfo ? "6px" : "4px",
                  md: null,
                },
                position: "absolute",
                bottom: activeBullets.mainInfo ? "40px" : "38px",

                transition: "all .3s ease",
              }}
            >
              <Icon
                as={BsCircleFill}
                color={activeBullets.mainInfo ? textColor : "gray.300"}
                w={activeBullets.mainInfo ? "16px" : "12px"}
                h={activeBullets.mainInfo ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.mainInfo ? { textColor } : "gray.300"}
                fontWeight={activeBullets.mainInfo ? "bold" : "normal"}
                display={{ sm: "none", md: "block" }}
              >
                2. Main Info
              </Text>
            </Flex>
          </Tab>

          <Tab
            ref={descriptionTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                basic: true,
                mainInfo: true,
                description: true,
                media: false,
              })
            }
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: "80px", md: "200px" },
                height: "3px",
                bg: activeBullets.media ? textColor : "gray.200",
                left: { sm: "12px", md: "46px" },
                top: {
                  sm: activeBullets.description ? "6px" : "4px",
                  md: null,
                },
                position: "absolute",
                bottom: activeBullets.description ? "40px" : "38px",

                transition: "all .3s ease",
              }}
            >
              <Icon
                as={BsCircleFill}
                color={activeBullets.description ? textColor : "gray.300"}
                w={activeBullets.description ? "16px" : "12px"}
                h={activeBullets.description ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.description ? { textColor } : "gray.300"}
                fontWeight={activeBullets.description ? "bold" : "normal"}
                transition="all .3s ease"
                _hover={{ color: textColor }}
                display={{ sm: "none", md: "block" }}
              >
                3. Description
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={mediaTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                basic: true,
                mainInfo: true,
                description: true,
                media: true,
              })
            }
          >
            <Flex direction="column" justify="center" align="center">
              <Icon
                as={BsCircleFill}
                color={activeBullets.media ? textColor : "gray.300"}
                w={activeBullets.media ? "16px" : "12px"}
                h={activeBullets.media ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.media ? { textColor } : "gray.300"}
                fontWeight={activeBullets.media ? "bold" : "normal"}
                transition="all .3s ease"
                _hover={{ color: textColor }}
                display={{ sm: "none", md: "block" }}
              >
                4. Media
              </Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels mt="24px" maxW={{ md: "90%", lg: "100%" }} mx="auto">
          <TabPanel maxW="800px">
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Basic
                </Text>
              </CardHeader>

              <CardBody>
                <FormProvider {...basicMethods}>
                  <form
                    onSubmit={handleSubmit(onSubmitBasic)}
                    style={{ width: "100%" }}
                  >
                    <Stack direction="column" spacing="20px" w="100%">
                      <Stack
                        direction={{ sm: "column", md: "row" }}
                        spacing="30px"
                      >
                        <FormControl>
                          <FormInput
                            name="name"
                            label="Name"
                            placeholder="Event name"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            fontSize="xs"
                            label="Date"
                            type="datetime-local"
                            name="date"
                            placeholder="Select date and time"
                          />
                        </FormControl>
                      </Stack>
                      <Flex>
                        <FormControl>
                          <FormLabel
                            pl={"12px"}
                            fontSize="xs"
                            fontWeight="bold"
                            mb={"4px"}
                          >
                            Select the others Parcels to which the event was
                            applied
                          </FormLabel>
                          <Select
                            // value={parcels?.filter((v) => v.isFixed)}
                            value={value}
                            isMulti
                            styles={styles}
                            isClearable={value?.some((v) => !v.isFixed)}
                            name="colors"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={onChange}
                            options={parcels}
                          />
                        </FormControl>
                      </Flex>
                      <Flex
                        direction="column"
                        justify="center"
                        textAlign="center"
                        w="80%"
                        mx="auto"
                        mt="10px"
                      >
                        <FormLabel
                          ms="4px"
                          fontSize="xs"
                          fontWeight="bold"
                          mb="4px"
                          pl="12px"
                        >
                          What kind of event do you want to create?
                        </FormLabel>
                      </Flex>
                      <Flex w={"100%"} justifyContent={"center"}>
                        <Flex
                          bg={bgButtonGroup}
                          borderRadius="12px"
                          w={"fit-content"}
                        >
                          <Button
                            variant="no-hover"
                            w="135px"
                            h="40px"
                            fontSize="xs"
                            boxShadow={
                              activeButton === 0
                                ? "0px 2px 5.5px rgba(0, 0, 0, 0.06)"
                                : "none"
                            }
                            bg={
                              activeButton === 0
                                ? bgActiveButton
                                : "transparent"
                            }
                            onClick={() => setActiveButton(0)}
                          >
                            WEATHER
                          </Button>
                          <Button
                            variant="no-hover"
                            w="135px"
                            h="40px"
                            fontSize="xs"
                            boxShadow={
                              activeButton === 1
                                ? "0px 2px 5.5px rgba(0, 0, 0, 0.06)"
                                : "none"
                            }
                            bg={
                              activeButton === 1
                                ? bgActiveButton
                                : "transparent"
                            }
                            onClick={() => setActiveButton(1)}
                          >
                            CHEMICAL
                          </Button>
                          <Button
                            variant="no-hover"
                            w="135px"
                            h="40px"
                            fontSize="xs"
                            boxShadow={
                              activeButton === 2
                                ? "0px 2px 5.5px rgba(0, 0, 0, 0.06)"
                                : "none"
                            }
                            bg={
                              activeButton === 2
                                ? bgActiveButton
                                : "transparent"
                            }
                            onClick={() => setActiveButton(2)}
                          >
                            OTHER
                          </Button>
                        </Flex>
                      </Flex>

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
                    </Stack>
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CardHeader mb="22px">
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Event Info
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...mainInfoMethods}>
                  <form
                    onSubmit={mainInfoSubmit(onSubmitMainInfo)}
                    style={{ width: "100%" }}
                  >
                    <Flex direction="column" w="100%">
                      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
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
                        height={"3rem"}
                        borderRadius={"15px"}
                        fontSize={"0.875rem"}
                        {...register("type")}
                      >
                        <option value="FR">Frost</option>
                        <option value="DR">Drought</option>
                        <option value="HW">Heat Wave</option>
                        <option value="TS">Tropical Storm</option>
                        <option value="HW">High Winds</option>
                        <option value="HH">High Humidity</option>
                        <option value="LH">Low Humidity</option>
                      </ChakraSelect>
                      {errors.type && (
                        <Text fontSize="sm" color="red.500" mt={"0.5rem"}>
                          {errors.type.message}
                        </Text>
                      )}
                      <Flex gap={"20px"}>
                        <Flex flexDir={"column"} flexGrow={1}>
                          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                            Temperature
                          </FormLabel>
                          <FormInput
                            fontSize="sm"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder="Volume of the product"
                            mb="24px"
                            size="lg"
                            name="temperature"
                          />
                        </Flex>
                        <Flex flexDir={"column"} flexGrow={1}>
                          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                            Humidity
                          </FormLabel>
                          <FormInput
                            fontSize="sm"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder="Area"
                            mb="24px"
                            size="lg"
                            name="humidity"
                          />
                        </Flex>
                      </Flex>
                      <Flex flexDir={"column"}>
                        <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                          Time Period
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
                              From
                            </FormLabel>
                            <FormInput
                              fontSize="xs"
                              ms="4px"
                              borderRadius="15px"
                              type="datetime-local"
                              name="startDate"
                              placeholder="Select date and time"
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
                              To
                            </FormLabel>
                            <FormInput
                              fontSize="xs"
                              ms="4px"
                              borderRadius="15px"
                              type="datetime-local"
                              name="endDate"
                              placeholder="Select date and time"
                              mb="24px"
                            />
                          </Flex>
                        </Flex>
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
                        >
                          <Text
                            fontSize="xs"
                            color="gray.700"
                            fontWeight="bold"
                          >
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
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Description
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...descriptionMethods}>
                  <form
                    onSubmit={descriptionSubmit(onSubmitDescription)}
                    style={{ width: "100%" }}
                  >
                    <Flex direction="column" w="100%">
                      <Stack direction="column" spacing="20px" w="100%">
                        <Editor />
                      </Stack>
                      <Flex justify="space-between">
                        <Button
                          variant="no-hover"
                          bg={bgPrevButton}
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          onClick={() => mainInfoTab.current.click()}
                        >
                          <Text
                            fontSize="xs"
                            color="gray.700"
                            fontWeight="bold"
                          >
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
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CardHeader mb="22px">
                <Text
                  color={textColor}
                  fontSize="xl"
                  fontWeight="bold"
                  mb="3px"
                >
                  Media
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...mediaMethods}>
                  <form
                    onSubmit={mediaSubmit(onSubmitMedia)}
                    style={{ width: "100%" }}
                  >
                    <Flex direction="column" w="100%">
                      <Text
                        color={textColor}
                        fontSize="sm"
                        fontWeight="bold"
                        mb="12px"
                      >
                        Establishment images
                      </Text>
                      <Flex
                        align="center"
                        justify="center"
                        border="1px dashed #E2E8F0"
                        borderRadius="15px"
                        w="100%"
                        minH="130px"
                        cursor="pointer"
                        {...getRootProps({ className: "dropzone" })}
                      >
                        <Input {...getInputProps()} />
                        <Button variant="no-hover">
                          <Text color="gray.400" fontWeight="normal">
                            Drop files here to upload
                          </Text>
                        </Button>
                      </Flex>
                      <Flex justify="space-between">
                        <Button
                          variant="no-hover"
                          bg={bgPrevButton}
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          onClick={() => descriptionTab.current.click()}
                        >
                          <Text
                            fontSize="xs"
                            color="gray.700"
                            fontWeight="bold"
                          >
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
                            SEND
                          </Text>
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
        {/* </form> */}
      </Tabs>
    </Flex>
  );
}

export default NewEstablishment;
