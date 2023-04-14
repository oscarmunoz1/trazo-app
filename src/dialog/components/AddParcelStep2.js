// Chakra imports
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
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
import { GoogleMap, Polygon, useLoadScript } from "@react-google-maps/api";
// Custom components
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BsFillCloudLightningRainFill } from "react-icons/bs";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader";
import ChemicalTab from "./ChemicalTab.js";
import { FaPlus } from "react-icons/fa";
import OtherTab from "./OtherTab.js";
import { RocketIcon } from "components/Icons/Icons";
import { SlChemistry } from "react-icons/sl";
import WeatherTab from "./WeatherTab.js";
import { setForm } from "store/features/formSlice";

const options = {
  googleMapApiKey: "AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8",
};

const AddParcelStep2 = ({ prevTab, nextTab }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("gray.300", "gray.700");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey,
  });

  const dispatch = useDispatch();

  const currentEvent = useSelector((state) => state.form.currentForm?.event);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const handleNext = () => {
    // dispatch(setForm({ event: { ...currentEvent, event_type: checkBox } }));
    nextTab.current.click();
  };

  return (
    <Card>
      <CardHeader mb="20px">
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          w="80%"
          mx="auto"
        >
          <Text color={textColor} fontSize="lg" fontWeight="bold" mb="4px">
            Where is the Parcel located?
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            Indicate the location of the parcel
          </Text>
        </Flex>
      </CardHeader>
      <CardBody justifyContent={"center"} mb="20px">
        <Flex direction="column" w="80%" h="300px">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            zoom={16}
            center={{ lat: -31.27006513500534, lng: -57.199462864720985 }}
            mapTypeId="satellite"
            borderRadius="15px"
          >
            <Polygon
              path={[
                { lat: -31.26835838901041, lng: -57.202751722067966 },
                { lat: -31.271918579848123, lng: -57.201694589349295 },
                { lat: -31.27094552584586, lng: -57.19690586848693 },
                { lat: -31.269076616200664, lng: -57.19727631670458 },
              ]}
              options={{
                fillColor: "#ff0000",
                fillOpacity: 0.35,
                strokeColor: "#ff0000",
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          </GoogleMap>
        </Flex>
      </CardBody>
      <CardFooter>
        <Flex justify="space-between" width={"100%"}>
          <Button
            variant="no-hover"
            bg={bgPrevButton}
            alignSelf="flex-end"
            mt="24px"
            w={{ sm: "75px", lg: "100px" }}
            h="35px"
            onClick={() => prevTab.current.click()}
          >
            <Text fontSize="xs" color="gray.700" fontWeight="bold">
              PREV
            </Text>
          </Button>
          <Button
            bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
            _hover={{
              bg: "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
            }}
            alignSelf="flex-end"
            mt="24px"
            w={{ sm: "75px", lg: "100px" }}
            h="35px"
            onClick={handleNext}
          >
            <Text fontSize="xs" color="#fff" fontWeight="bold">
              NEXT
            </Text>
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default AddParcelStep2;
