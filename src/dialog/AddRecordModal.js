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
import React, { useEffect, useRef, useState } from "react";

import AddRecordModalStep1 from "./components/AddRecordStep1.js";
import AddRecordModalStep2 from "./components/AddRecordStep2.js";
import { BsCircleFill } from "react-icons/bs";
import { BsFillCloudLightningRainFill } from "react-icons/bs";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import Editor from "components/Editor/Editor";
import { FaPlus } from "react-icons/fa";
import IconBox from "components/Icons/IconBox";
import { MdModeEdit } from "react-icons/md";
import { RocketIcon } from "components/Icons/Icons";
import Select from "react-select";
import { SlChemistry } from "react-icons/sl";
import WeatherTab from "./components/WeatherTab.js";
// Custom components
import parcel1 from "assets/img/ImageParcel1.png";

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

const AddRecordModal = ({ title, name, onClose, isOpen }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [activeBullets, setActiveBullets] = useState({
    about: true,
    account: false,
    address: false,
  });

  const [checkboxes, setCheckboxes] = useState({
    design: false,
    code: false,
    develop: false,
  });
  const options = [
    { value: "Parcel #1", label: "Parcel #1", isFixed: true },
    { value: "Parcel #2", label: "Parcel #2" },
    { value: "Parcel #3", label: "Parcel #3" },
    { value: "Parcel #4", label: "Parcel #4" },
    { value: "Parcel #5", label: "Parcel #5" },
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [value, setValue] = useState(
    orderOptions(options.filter((v) => v.isFixed))
  );

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = options.filter((v) => v.isFixed);
        break;
    }
    setValue(orderOptions(newValue));
  };

  const aboutTab = useRef();
  const accountTab = useRef();
  const addressTab = useRef();

  useEffect(() => {
    setCurrentStep(1);
  }, [isOpen]);

  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );
  const iconColor = useColorModeValue("gray.300", "gray.700");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
  const handleAddEvent = () => {
    console.log("Add event");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ sm: "80%", md: "50%" }}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                ref={aboutTab}
                _focus="none"
                w={{ sm: "120px", md: "250px", lg: "260px" }}
                onClick={() =>
                  setActiveBullets({
                    about: true,
                    account: false,
                    address: false,
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
                    bg: activeBullets.account ? textColor : "gray.200",
                    left: { sm: "12px", md: "26px" },
                    top: { sm: activeBullets.about ? "6px" : "4px", md: null },
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
                ref={accountTab}
                _focus="none"
                w={{ sm: "120px", md: "250px", lg: "260px" }}
                onClick={() =>
                  setActiveBullets({
                    about: true,
                    account: true,
                    address: false,
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
                    bg: activeBullets.address ? textColor : "gray.200",
                    left: { sm: "12px", md: "18px" },
                    top: {
                      sm: activeBullets.account ? "6px" : "4px",
                      md: null,
                    },
                    position: "absolute",
                    bottom: activeBullets.account ? "40px" : "38px",
                    zIndex: -1,
                    transition: "all .3s ease",
                  }}
                >
                  <Icon
                    as={BsCircleFill}
                    color={activeBullets.account ? textColor : "gray.300"}
                    w={activeBullets.account ? "16px" : "12px"}
                    h={activeBullets.account ? "16px" : "12px"}
                    mb="8px"
                  />
                  <Text
                    color={activeBullets.account ? { textColor } : "gray.300"}
                    fontWeight={activeBullets.account ? "bold" : "normal"}
                    transition="all .3s ease"
                    fontSize="sm"
                    _hover={{ color: textColor }}
                    display={{ sm: "none", md: "block" }}
                  >
                    Type
                  </Text>
                </Flex>
              </Tab>
              <Tab
                ref={addressTab}
                _focus="none"
                w={{ sm: "120px", md: "250px", lg: "260px" }}
                onClick={() =>
                  setActiveBullets({
                    about: true,
                    account: true,
                    address: true,
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
                      sm: activeBullets.address ? "6px" : "4px",
                      md: null,
                    },
                    position: "absolute",
                    bottom: activeBullets.address ? "40px" : "38px",
                    zIndex: -1,
                    transition: "all .3s ease",
                  }}
                >
                  <Icon
                    as={BsCircleFill}
                    color={activeBullets.address ? textColor : "gray.300"}
                    w={activeBullets.address ? "16px" : "12px"}
                    h={activeBullets.address ? "16px" : "12px"}
                    mb="8px"
                  />
                  <Text
                    color={activeBullets.address ? { textColor } : "gray.300"}
                    fontWeight={activeBullets.address ? "bold" : "normal"}
                    transition="all .3s ease"
                    fontSize="sm"
                    _hover={{ color: textColor }}
                    display={{ sm: "none", md: "block" }}
                  >
                    About
                  </Text>
                </Flex>
              </Tab>
            </TabList>
            <TabPanels maxW={{ md: "90%", lg: "100%" }} mx="auto">
              <TabPanel w={"100%"} mx="auto">
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
                      <Text
                        color={textColor}
                        fontSize="lg"
                        fontWeight="bold"
                        mb="4px"
                      >
                        Let's start with the basic information
                      </Text>
                      <Text color="gray.400" fontWeight="normal" fontSize="sm">
                        Let us know your name and email address. Use an address
                        you don't mind other users contacting you at
                      </Text>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Flex direction="column" w="100%">
                      <Flex direction={{ sm: "column", md: "row" }} w="100%">
                        <Box
                          position="relative"
                          minW={{ sm: "200px", xl: "240px" }}
                          h={{ sm: "110px", xl: "150px" }}
                          mx={{ sm: "5px", md: "10px", xl: "20px" }}
                          mb={{ sm: "25px" }}
                        >
                          <Avatar
                            src={parcel1}
                            w="100%"
                            h="100%"
                            borderRadius="12px"
                          />
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
                            <Icon
                              as={MdModeEdit}
                              w="15px"
                              h="15px"
                              color="#333"
                            />
                          </IconBox>
                        </Box>
                        <Stack direction="column" spacing="20px" w="100%">
                          <FormControl>
                            {/* <FormLabel
                              color={textColor}
                              fontSize="xs"
                              fontWeight="bold"
                            >
                              First Name
                            </FormLabel>
                            <Input
                              borderRadius="15px"
                              placeholder="eg. Michael"
                              fontSize="xs"
                            /> */}
                            <Flex direction={"column"} grow={"1"} pr={"32px"}>
                              <FormLabel
                                // ms="4px"
                                color={textColor}
                                fontSize="xs"
                                fontWeight="bold"
                              >
                                Name
                              </FormLabel>
                              <Input
                                fontSize="xs"
                                ms="4px"
                                borderRadius="15px"
                                type="text"
                                placeholder="Name of the event"
                              />
                              <FormLabel
                                color={textColor}
                                pt={"16px"}
                                ms="4px"
                                fontSize="xs"
                                fontWeight="bold"
                              >
                                Date
                              </FormLabel>
                              <Input
                                placeholder="Select Date and Time"
                                borderRadius="15px"
                                ms="4px"
                                type="datetime-local"
                                mb="24px"
                                fontSize={"0.758rem;"}
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
                        <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                          Select the others Parcels to which the event was
                          applied
                        </FormLabel>
                        <Select
                          value={value}
                          isMulti
                          styles={styles}
                          isClearable={value.some((v) => !v.isFixed)}
                          name="colors"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={onChange}
                          options={options}
                        />
                      </FormControl>

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
                </Card>
              </TabPanel>
              <TabPanel w={{ sm: "330px", md: "660px", lg: "750px" }} mx="auto">
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
                      <Text
                        color={textColor}
                        fontSize="lg"
                        fontWeight="bold"
                        mb="4px"
                      >
                        What kind of event do you want to create?
                      </Text>
                      <Text color="gray.400" fontWeight="normal" fontSize="sm">
                        If the type of the event is not within the options,
                        select the type Other and specify it in the next step.
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
                          <FormLabel
                            w="150px"
                            h="150px"
                            cursor="pointer"
                            mb="16px"
                          >
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
                                as={BsFillCloudLightningRainFill}
                                w="54px"
                                h="54px"
                                color={checkboxes.design ? "#fff" : iconColor}
                              />
                            </Flex>
                          </FormLabel>
                          <Text
                            color={textColor}
                            fontWeight="bold"
                            fontSize="md"
                          >
                            Weather
                          </Text>
                        </Flex>
                        <Flex direction="column" align="center">
                          <FormLabel
                            w="150px"
                            h="150px"
                            cursor="pointer"
                            mb="16px"
                          >
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
                                as={SlChemistry}
                                w="54px"
                                h="54px"
                                color={checkboxes.code ? "#fff" : iconColor}
                              />
                            </Flex>
                          </FormLabel>
                          <Text
                            color={textColor}
                            fontWeight="bold"
                            fontSize="md"
                          >
                            Chemical
                          </Text>
                        </Flex>
                        <Flex direction="column" align="center">
                          <FormLabel
                            w="150px"
                            h="150px"
                            cursor="pointer"
                            mb="16px"
                          >
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
                          <Text
                            color={textColor}
                            fontWeight="bold"
                            fontSize="md"
                          >
                            Other
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
              </TabPanel>
              <TabPanel w={{ sm: "330px", md: "660px", lg: "750px" }} mx="auto">
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
                      <Text
                        color={textColor}
                        fontSize="lg"
                        fontWeight="bold"
                        mb="4px"
                      >
                        What is the event about?
                      </Text>
                      <Text color="gray.400" fontWeight="normal" fontSize="sm">
                        In the following Inputs you must give detailed
                        information about the event.
                      </Text>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Flex direction="column" w="100%">
                      <Stack direction="column" spacing="20px">
                        <WeatherTab />
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
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        {/* <ModalFooter gap="20px">
          {currentStep === 1 ? (
            <>
              <Button
                bg={bgButton}
                color="white"
                fontSize="xs"
                variant="no-hover"
                minW="100px"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                minW="110px"
                h="36px"
                fontSize="xs"
                px="1.5rem"
                onClick={() => setCurrentStep(2)}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button
                bg={bgButton}
                color="white"
                fontSize="xs"
                variant="no-hover"
                minW="100px"
                onClick={() => setCurrentStep(1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                minW="110px"
                h="36px"
                fontSize="xs"
                px="1.5rem"
                onClick={handleAddEvent}
              >
                Add
              </Button>
            </>
          )}
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};

export default AddRecordModal;
