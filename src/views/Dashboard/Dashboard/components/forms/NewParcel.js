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

import AddParcelStep1 from "../addParcel/AddParcelStep1";
import AddParcelStep2 from "../addParcel/AddParcelStep2";
import AddParcelStep3 from "../addParcel/AddParcelStep3";
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
import { addCompanyEstablishment } from "store/features/companySlice";
import avatar4 from "assets/img/avatars/avatar4.png";
import imageMap from "assets/img/imageMap.png";
import { useCreateEstablishmentMutation } from "store/features/companyApi";
import { useDropzone } from "react-dropzone";
import { useGoogleMap } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
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

const reducer = (state, action) => {
  if (action.type === "SWITCH_ACTIVE") {
    if (action.payload === "overview") {
      const newState = {
        overview: true,
        teams: false,
        projects: false,
      };
      return newState;
    } else if (action.payload === "teams") {
      const newState = {
        overview: false,
        teams: true,
        projects: false,
      };
      return newState;
    } else if (action.payload === "projects") {
      const newState = {
        overview: false,
        teams: false,
        projects: true,
      };
      return newState;
    }
  }
  return state;
};

function NewEstablishment() {
  const bgColor = useColorModeValue("white", "gray.700");
  const dispatch = useDispatch();
  const currentEstablishment = useSelector(
    (state) => state.form.currentForm?.establishment
  );
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const [currentStep, setCurrentStep] = React.useState(1);
  const [activeBullets, setActiveBullets] = useState({
    about: true,
    location: false,
    certification: false,
  });

  const basicTab = useRef();
  const locationTab = useRef();
  const certificationTab = useRef();

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
    formState: { errors, isSubmitSuccessful },
  } = infoMethods;

  const descriptionMethods = useForm({
    resolver: zodResolver(formSchemaDescription),
  });

  const {
    reset: descriptionReset,
    handleSubmit: descriptionSubmit,
  } = descriptionMethods;

  const socialsMethods = useForm({
    resolver: zodResolver(formSchemaSocials),
  });

  const { reset: socialsReset, handleSubmit: socialsSubmit } = socialsMethods;

  const onSubmitInfo = (data) => {
    dispatch(setForm({ establishment: data }));
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
    createEstablishment,
    {
      data: dataEstablishment,
      error: errorEstablishment,
      isSuccess: isSuccessEstablishment,
      isLoading: isLoadingEstablishment,
    },
  ] = useCreateEstablishmentMutation();

  const onSubmitSocials = (data) => {
    console.log(data);
    dispatch(
      setForm({
        establishment: {
          ...currentEstablishment,
          ...(data?.facebook && { facebook: data.facebook }),
          ...(data?.instagram && { instagram: data.instagram }),
        },
      })
    );
    createEstablishment({
      ...currentEstablishment,
      ...(data?.facebook && { facebook: data.facebook }),
      ...(data?.instagram && { instagram: data.instagram }),
      company: currentCompany.id,
    });
  };

  useEffect(() => {
    if (isSuccessEstablishment) {
      dispatch(addCompanyEstablishment(dataEstablishment));
      dispatch(clearForm());
      navigate(`/admin/dashboard/establishment/${dataEstablishment.id}`);
    }
  }, [isSuccessEstablishment]);

  const onSubmitHandler = (values) => {
    locationTab.current.click();
  };

  const createEventHandler = () => {
    createEvent(currentEvent);
  };

  return (
    <Flex
      direction="column"
      bg={bgColor}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px"
    >
      <Tabs variant="unstyled" mt="24px" alignSelf="center">
        <TabList
          display="flex"
          align="center"
          alignSelf="center"
          justifySelf="center"
        >
          <Tab
            ref={basicTab}
            _focus="none"
            w={{ sm: "120px", md: "250px", lg: "260px" }}
            onClick={() =>
              setActiveBullets({
                about: true,
                location: false,
                certification: false,
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
                width: { sm: "120px", md: "250px", lg: "250px" },
                height: "3px",
                bg: activeBullets.location ? textColor : "gray.200",
                left: { sm: "12px", md: "26px" },
                top: {
                  sm: activeBullets.about ? "6px" : "4px",
                  md: null,
                },
                position: "absolute",
                bottom: activeBullets.about ? "40px" : "38px",

                transition: "all .3s ease",
              }}
            >
              <Icon
                as={BsCircleFill}
                color={activeBullets.about ? textColor : "gray.300"}
                w={activeBullets.about ? "16px" : "12px"}
                h={activeBullets.about ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.about ? { textColor } : "gray.300"}
                fontWeight={activeBullets.about ? "bold" : "normal"}
                display={{ sm: "none", md: "block" }}
                fontSize="sm"
              >
                Basic
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={locationTab}
            _focus="none"
            w={{ sm: "120px", md: "250px", lg: "260px" }}
            onClick={() =>
              setActiveBullets({
                about: true,
                location: true,
                certification: false,
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
                width: { sm: "120px", md: "250px", lg: "260px" },
                height: "3px",
                bg: activeBullets.certification ? textColor : "gray.200",
                left: { sm: "12px", md: "18px" },
                top: {
                  sm: activeBullets.location ? "6px" : "4px",
                  md: null,
                },
                position: "absolute",
                bottom: activeBullets.location ? "40px" : "38px",

                transition: "all .3s ease",
              }}
            >
              <Icon
                as={BsCircleFill}
                color={activeBullets.location ? textColor : "gray.300"}
                w={activeBullets.location ? "16px" : "12px"}
                h={activeBullets.location ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.location ? { textColor } : "gray.300"}
                fontWeight={activeBullets.location ? "bold" : "normal"}
                transition="all .3s ease"
                fontSize="sm"
                _hover={{ color: textColor }}
                display={{ sm: "none", md: "block" }}
              >
                Location
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={certificationTab}
            _focus="none"
            w={{ sm: "120px", md: "250px", lg: "260px" }}
            onClick={() =>
              setActiveBullets({
                about: true,
                location: true,
                certification: true,
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
                width: { sm: "120px", md: "250px", lg: "260px" },
                height: "3px",
                // bg: activeBullets.profile ? textColor : "gray.200",
                left: { sm: "12px", md: "32px" },
                top: {
                  sm: activeBullets.certification ? "6px" : "4px",
                  md: null,
                },
                position: "absolute",
                bottom: activeBullets.certification ? "40px" : "38px",

                transition: "all .3s ease",
              }}
            >
              <Icon
                as={BsCircleFill}
                color={activeBullets.certification ? textColor : "gray.300"}
                w={activeBullets.certification ? "16px" : "12px"}
                h={activeBullets.certification ? "16px" : "12px"}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.certification ? { textColor } : "gray.300"}
                fontWeight={activeBullets.certification ? "bold" : "normal"}
                transition="all .3s ease"
                fontSize="sm"
                _hover={{ color: textColor }}
                display={{ sm: "none", md: "block" }}
              >
                Certification
              </Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels mt="24px" maxW={{ md: "90%", lg: "100%" }} mx="auto">
          <TabPanel>
            <AddParcelStep1 nextTab={locationTab} onSubmit={onSubmitHandler} />
          </TabPanel>

          <TabPanel>
            <AddParcelStep2 prevTab={basicTab} nextTab={certificationTab} />
          </TabPanel>
          <TabPanel>
            <AddParcelStep3
              prevTab={locationTab}
              createEventHandler={createEventHandler}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default NewEstablishment;
