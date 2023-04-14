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
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { object, string } from "zod";

import AddParcelStep1 from "./components/AddParcelStep1.js";
import AddParcelStep2 from "./components/AddParcelStep2.js";
import AddParcelStep3 from "./components/AddParcelStep3.js";
import { BsCircleFill } from "react-icons/bs";
import { BsFillCloudLightningRainFill } from "react-icons/bs";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import WeatherTab from "./components/WeatherTab.js";
import { useCreateEventMutation } from "store/features/historyApi.js";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = object({
  name: string().min(1, "Name is required"),
  date: string().min(1, "Date is required"),
  // description: string(),
});

const AddParcelModal = ({ title, onClose, isOpen }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [activeBullets, setActiveBullets] = useState({
    about: true,
    location: false,
    certification: false,
  });

  const basicTab = useRef();
  const locationTab = useRef();
  const certificationTab = useRef();

  useEffect(() => {
    setCurrentStep(1);
  }, [isOpen]);

  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");

  const handleAddEvent = () => {
    onClose();
  };

  const [
    createEvent,
    {
      data: dataCompany,
      error: errorCompany,
      isSuccess: isSuccessCompany,
      isLoading: isLoadingCompany,
    },
  ] = useCreateEventMutation();

  const currentEvent = useSelector((state) => state.form.currentForm?.event);

  const createEventHandler = () => {
    createEvent(currentEvent);
  };

  const onSubmitHandler = (values) => {
    locationTab.current.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ sm: "80%", md: "50%" }}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Tabs
              variant="unstyled"
              display="flex"
              flexDirection="column"
              margin={{ sm: "0 auto", md: "0" }}
            >
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
                      zIndex: -1,
                      transition: "all .3s ease",
                    }}
                  >
                    <Icon
                      as={BsCircleFill}
                      color={activeBullets.about ? textColor : "gray.300"}
                      w={activeBullets.about ? "16px" : "12px"}
                      h={activeBullets.about ? "16px" : "12px"}
                      mb="8px"
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
                      zIndex: -1,
                      transition: "all .3s ease",
                    }}
                  >
                    <Icon
                      as={BsCircleFill}
                      color={activeBullets.location ? textColor : "gray.300"}
                      w={activeBullets.location ? "16px" : "12px"}
                      h={activeBullets.location ? "16px" : "12px"}
                      mb="8px"
                    />
                    <Text
                      color={
                        activeBullets.location ? { textColor } : "gray.300"
                      }
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
                      zIndex: -1,
                      transition: "all .3s ease",
                    }}
                  >
                    <Icon
                      as={BsCircleFill}
                      color={
                        activeBullets.certification ? textColor : "gray.300"
                      }
                      w={activeBullets.certification ? "16px" : "12px"}
                      h={activeBullets.certification ? "16px" : "12px"}
                      mb="8px"
                    />
                    <Text
                      color={
                        activeBullets.certification ? { textColor } : "gray.300"
                      }
                      fontWeight={
                        activeBullets.certification ? "bold" : "normal"
                      }
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
              <TabPanels maxW={{ md: "90%", lg: "100%" }} mx="auto">
                <TabPanel w={"100%"} mx="auto" p="0">
                  <AddParcelStep1
                    onClose={onClose}
                    isOpen={isOpen}
                    nextTab={locationTab}
                    onSubmit={onSubmitHandler}
                  />
                </TabPanel>
                <TabPanel
                  w={{ sm: "330px", md: "660px", lg: "100%" }}
                  mx="auto"
                  p="0"
                >
                  <AddParcelStep2
                    prevTab={basicTab}
                    nextTab={certificationTab}
                    handleSubmit={onSubmitHandler}
                  />
                </TabPanel>
                <TabPanel
                  w={{ sm: "330px", md: "660px", lg: "100%" }}
                  mx="auto"
                  p="0"
                >
                  <AddParcelStep3
                    prevTab={locationTab}
                    createEventHandler={createEventHandler}
                    onClose={onClose}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddParcelModal;
