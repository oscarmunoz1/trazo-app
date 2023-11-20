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
  Select,
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
  useColorModeValue,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { clearForm, setForm } from "store/features/formSlice";
import { object, string } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { BsCircleFill } from "react-icons/bs";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardWithMap from "../CardWithMap";
// Custom components
import Editor from "components/Editor/Editor";
import FormInput from "components/Forms/FormInput";
import Header from "views/Pages/Profile/Overview/components/Header";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import { editCompanyEstablishment } from "store/features/companySlice";
import imageMap from "assets/img/imageMap.png";
import { useDropzone } from "react-dropzone";
import { useEditEstablishmentMutation } from "store/api/companyApi";
import { useGoogleMap } from "@react-google-maps/api";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchemaInfo = object({
  name: string().min(1, "Name is required"),
  country: string().min(1, "Country is required"),
  state: string().min(1, "State is required"),
  city: string().min(1, "City is required"),
  address: string().min(1, "Address is required"),
  zone: string(),
});

const formSchemaDescription = object({
  description: string().min(1, "Description is required"),
});

const formSchemaSocials = object({
  facebook: string(),
  instagram: string(),
});

function EditEstablishment() {
  const bgColor = useColorModeValue("white", "gray.700");
  const dispatch = useDispatch();
  const [establishment, setEstablishment] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);

  const { establishmentId } = useParams();
  const currentEstablishment = useSelector(
    (state) => state.form.currentForm?.establishment
  );
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const establishments = useSelector(
    (state) => state.company.currentCompany?.establishments
  );

  useEffect(() => {
    let establishment;
    if (establishments) {
      establishment = establishments.filter(
        (establishment) => establishment.id.toString() === establishmentId
      )[0];
      setEstablishment(establishment);
      const {
        address,
        zone,
        city,
        state,
        country,
        name,
        description,
        facebook,
        instagram,
      } = establishment;
      dispatch(
        setForm({
          establishment: {
            address,
            zone,
            city,
            country,
            state,
            name,
            description,
            facebook,
            instagram,
          },
        })
      );
    }
  }, [establishmentId, establishments]);

  useEffect(() => {
    if (currentEstablishment) {
      setInfoValues("name", currentEstablishment.name || "");
      setInfoValues("country", currentEstablishment.country || "");
      setInfoValues("state", currentEstablishment.state || "");
      setInfoValues("city", currentEstablishment.city || "");
      setInfoValues("address", currentEstablishment.address || "");
      setInfoValues("zone", currentEstablishment.zone || "");
      setDescriptionValues("description", currentEstablishment.description);
    }
  }, [currentEstablishment]);

  const [activeBullets, setActiveBullets] = useState({
    mainInfo: true,
    description: false,
    media: false,
    socials: false,
  });

  const mainInfoTab = useRef();
  const descriptionTab = useRef();
  const mediaTab = useRef();
  const socialsTab = useRef();

  const { getRootProps, getInputProps } = useDropzone();

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const infoMethods = useForm({
    resolver: zodResolver(formSchemaInfo),
  });

  const {
    reset,
    handleSubmit,
    setValue: setInfoValues,
    formState: { errors, isSubmitSuccessful },
  } = infoMethods;

  const descriptionMethods = useForm({
    resolver: zodResolver(formSchemaDescription),
  });

  const {
    reset: descriptionReset,
    handleSubmit: descriptionSubmit,
    setValue: setDescriptionValues,
  } = descriptionMethods;

  const socialsMethods = useForm({
    resolver: zodResolver(formSchemaSocials),
  });

  const { reset: socialsReset, handleSubmit: socialsSubmit } = socialsMethods;

  const onSubmitInfo = (data) => {
    dispatch(
      setForm({
        establishment: {
          ...currentEstablishment,
          name: data.name,
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
          zone: data.zone,
        },
      })
    );
    descriptionTab.current.click();
  };

  const onSubmitDescription = (data) => {
    console.log(data);
    dispatch(
      setForm({
        establishment: {
          ...currentEstablishment,
          description: data.description,
        },
      })
    );
    mediaTab.current.click();
  };

  const [
    editEstablishment,
    {
      data: dataEstablishment,
      error: errorEstablishment,
      isSuccess: isSuccessEstablishment,
      isLoading: isLoadingEstablishment,
    },
  ] = useEditEstablishmentMutation();

  const onSubmitSocials = (data) => {
    editEstablishment({
      companyId: currentCompany.id,
      establishmentId,
      establishmentData: {
        ...currentEstablishment,
        ...(data?.facebook && { facebook: data.facebook }),
        ...(data?.instagram && { instagram: data.instagram }),
        // company: currentCompany.id,
      },
    });
  };

  useEffect(() => {
    if (isSuccessEstablishment) {
      dispatch(editCompanyEstablishment(dataEstablishment));
      dispatch(clearForm());
      navigate(`/admin/dashboard/establishment/${dataEstablishment.id}`);
    }
  }, [isSuccessEstablishment]);

  return (
    <Flex
      direction="column"
      bg={bgColor}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px"
      maxW={{ md: "90%", lg: "80%" }}
    >
      <Tabs variant="unstyled" mt="24px" alignSelf="center">
        <TabList display="flex" align="center" justifyContent={"center"}>
          <Tab
            ref={mainInfoTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                description: false,
                media: false,
                socials: false,
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
                1. Main Info
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={descriptionTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                description: true,
                media: false,
                socials: false,
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
                2. Description
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={mediaTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                description: true,
                media: true,
                socials: false,
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
                bg: activeBullets.socials ? textColor : "gray.200",
                left: { sm: "12px", md: "32px" },
                top: { sm: activeBullets.media ? "6px" : "4px", md: null },
                position: "absolute",
                bottom: activeBullets.media ? "40px" : "38px",

                transition: "all .3s ease",
              }}
            >
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
                3. Media
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={socialsTab}
            _focus="none"
            w={{ sm: "80px", md: "200px" }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                description: true,
                media: true,
                socials: true,
              })
            }
          >
            <Flex direction="column" justify="center" align="center">
              <Icon
                as={BsCircleFill}
                color={activeBullets.socials ? textColor : "gray.300"}
                w={activeBullets.socials ? "16px" : "12px"}
                h={activeBullets.socials ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.socials ? { textColor } : "gray.300"}
                fontWeight={activeBullets.socials ? "bold" : "normal"}
                transition="all .3s ease"
                _hover={{ color: textColor }}
                display={{ sm: "none", md: "block" }}
              >
                4. Socials
              </Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels mt="24px" maxW={{ md: "90%", lg: "100%" }} mx="auto">
          <TabPanel>
            <Card>
              <CardHeader mb="22px">
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Establishment Info
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...infoMethods}>
                  <form
                    onSubmit={handleSubmit(onSubmitInfo)}
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
                            placeholder="Establishment name"
                            fontSize="xs"
                            defaultValue={currentEstablishment?.name}
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="country"
                            label="Country"
                            placeholder="Establishment country"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>
                      <Stack
                        direction={{ sm: "column", md: "row" }}
                        spacing="30px"
                      >
                        <FormControl>
                          <FormInput
                            name="state"
                            label="State"
                            placeholder="Establishment state"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="city"
                            label="City"
                            placeholder="Establishment city"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>
                      <Stack
                        direction={{ sm: "column", md: "row" }}
                        spacing="30px"
                      >
                        <FormControl>
                          <FormInput
                            name="address"
                            label="Address"
                            placeholder="Establishment address"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="zone"
                            label="Zone"
                            placeholder="Establishment zone"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>

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
                      <Text fontSize="xs" color="gray.700" fontWeight="bold">
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
                      onClick={() => socialsTab.current.click()}
                    >
                      <Text fontSize="xs" color="#fff" fontWeight="bold">
                        NEXT
                      </Text>
                    </Button>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel maxW="800px">
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Socials
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...socialsMethods}>
                  <form
                    onSubmit={socialsSubmit(onSubmitSocials)}
                    style={{ width: "100%" }}
                  >
                    <Flex direction="column" w="100%">
                      <Stack direction="column" spacing="20px" w="100%">
                        <FormControl>
                          <FormInput
                            name="facebook"
                            label="Facebook Account"
                            placeholder="https://"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="instagram"
                            label="Instagram Account"
                            placeholder="https://"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>
                      <Flex justify="space-between">
                        <Button
                          variant="no-hover"
                          bg={bgPrevButton}
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          onClick={() => mediaTab.current.click()}
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

export default EditEstablishment;
