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
  CircularProgress,
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
import CreatableSelect from "react-select/creatable";
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
import { set } from "date-fns";
import { useCreateEstablishmentMutation } from "store/api/companyApi";
import { useDropzone } from "react-dropzone";
import { useFinishCurrentHistoryMutation } from "store/api/historyApi.js";
import { useGetEstablishmentProductsQuery } from "store/api/productApi";
import { useGoogleMap } from "@react-google-maps/api";
import { zodResolver } from "@hookform/resolvers/zod";

const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
  { value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630", isFixed: true },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];
// Custom components
const styles = {
  container: (provided, state) => ({
    ...provided,
    margin: "0px !important",
  }),

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
  production_amount: string()
    .min(1, "Production amount is required")
    .transform((val) => Number(val)),
  lot_id: string().min(1, "Lot ID is required"),
  finish_date: string().min(1, "Lot ID is required"),
  observation: string().optional(),
});

function FinishProduction() {
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
  const [productValueError, setProductValueError] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState(null);
  const [productsOptions, setProductsOptions] = useState([]);

  const navigate = useNavigate();

  const { parcelId, establishmentId } = useParams();

  const [
    finishCurrentHistory,
    { data, error, isSuccess, isLoading },
  ] = useFinishCurrentHistoryMutation();

  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic),
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    register,
  } = basicMethods;

  const currentParcelId = useSelector(
    (state) => state.product.currentParcel?.id
  );

  const onSubmitBasic = (data) => {
    finishCurrentHistory({ parcelId: currentParcelId, historyData: data });
  };

  useEffect(() => {
    if (isSuccess) {
      // dispatch(addCompanyEstablishment(dataEstablishment));
      navigate(
        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`
      );
    }
  }, [isSuccess]);

  return (
    <Flex
      direction="column"
      bg={bgColor}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px"
    >
      <Tabs variant="unstyled" mt="24px" alignSelf="center">
        <TabPanels mt="24px" maxW={{ md: "90%", lg: "100%" }} mx="auto">
          <TabPanel maxW="800px" width={"600px"}>
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Main Info
                </Text>
              </CardHeader>

              <CardBody>
                <FormProvider {...basicMethods}>
                  <form
                    onSubmit={handleSubmit(onSubmitBasic)}
                    style={{ width: "100%" }}
                  >
                    <Flex gap={"20px"}>
                      <Flex flexDir={"column"} flexGrow={1}>
                        <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                          Production amount
                        </FormLabel>
                        <FormInput
                          fontSize="sm"
                          ms="4px"
                          borderRadius="15px"
                          type="text"
                          placeholder="Volume of the product"
                          mb="24px"
                          size="lg"
                          name="production_amount"
                        />
                      </Flex>
                      <Flex flexDir={"column"} flexGrow={1}>
                        <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                          Lot number
                        </FormLabel>
                        <FormInput
                          fontSize="sm"
                          ms="4px"
                          borderRadius="15px"
                          type="text"
                          placeholder="Lot number"
                          mb="24px"
                          size="lg"
                          name="lot_id"
                        />
                      </Flex>
                    </Flex>
                    <Flex flexDir={"column"}>
                      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                        Finish date
                      </FormLabel>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="datetime-local"
                        name="finish_date"
                        placeholder="Select date and time"
                        mb="24px"
                      />
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
                      {...register("observation")}
                    />
                    <Flex justifyContent={"flex-end"}>
                      <Button
                        variant="no-hover"
                        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                        alignSelf="flex-end"
                        mt="24px"
                        w={{ sm: "75px", lg: "100px" }}
                        h="35px"
                        type="submit"
                      >
                        {isLoading ? (
                          <CircularProgress
                            isIndeterminate
                            value={1}
                            color="#313860"
                            size="25px"
                          />
                        ) : (
                          <Text fontSize="xs" color="#fff" fontWeight="bold">
                            SEND
                          </Text>
                        )}
                      </Button>
                    </Flex>
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default FinishProduction;
