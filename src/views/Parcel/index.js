// Chakra imports
import { Flex, Grid, Image, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { dashboardTableData, timelineData } from "variables/general";

import CardWithImage from "components/Card/CardWithImage";
import CardWithMap from "./components/CardWithMap";
import HistoryCard from "./components/HistoryCard";
import TrackList from "./components/TrackList";
// assets
import imageMap from "assets/img/imageMap.png";
import imageParcel1 from "assets/img/ImageParcel1.png";

export default function ParcelView() {
  let mainText = useColorModeValue("gray.700", "gray.200");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <Text
        color={mainText}
        href="#"
        bg="inherit"
        borderRadius="inherit"
        fontWeight="bold"
        padding="10px"
      >
        Parcel #1
      </Text>
      <Grid
        templateColumns={{ md: "1fr", lg: "1.8fr 1.2fr" }}
        templateRows={{ md: "1fr auto", lg: "1fr" }}
        my="26px"
        gap="24px"
      >
        <CardWithImage
          title={"Valentín, Salto"}
          name={"Parcel #1"}
          description={
            "3 hectares of land, 2 hectares of crops, 1 hectare of pasture"
          }
          image={
            <Image
              src={imageParcel1}
              alt="chakra image"
              minWidth={{ md: "300px", lg: "auto" }}
              objectFit={"cover"}
              borderRadius="15px"
              height="100%"
            />
          }
        />
        <CardWithMap backgroundImage={imageMap} />
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "1fr 2fr" }}
        templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
        gap="24px"
      >
        <TrackList amount={40} data={timelineData} />
        <HistoryCard
          title={"History"}
          amount={30}
          captions={["Time frame", "Members", "Performance", "Certified"]}
          data={dashboardTableData}
        />
      </Grid>
    </Flex>
  );
}
