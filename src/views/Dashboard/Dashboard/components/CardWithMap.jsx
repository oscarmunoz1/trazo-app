// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Portal,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { GoogleMap, Polygon, useLoadScript } from "@react-google-maps/api";
import React, { useRef } from "react";

// react icons
import { BsArrowRight } from "react-icons/bs";
// Custom components
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

const options = {
  googleMapApiKey: "AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8",
};

const CardWithBackground = ({ backgroundImage }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <Card maxHeight="290.5px" p="1rem">
      <CardBody
        p="0px"
        w="100%"
        h={{ sm: "200px", lg: "100%" }}
        borderRadius="15px"
      >
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
          }}
          zoom={16}
          center={{ lat: -31.27006513500534, lng: -57.199462864720985 }}
          mapTypeId="satellite"
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
      </CardBody>
    </Card>
  );
};

export default CardWithBackground;
