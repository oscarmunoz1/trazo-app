// Chakra imports
import {
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CarouselCard from "./CarouselCard";
import { FaPlus } from "react-icons/fa";
import React from "react";
// Assets
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar6 from "assets/img/avatars/avatar6.png";
import imageParcel1 from "assets/img/ImageParcel1.png";
import imageParcel2 from "assets/img/ImageParcel2.png";
import imageParcel3 from "assets/img/ImageParcel3.png";

const CarouselHorizontal = ({ title, description }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p="16px">
      <CardHeader p="12px 5px" mb="12px">
        <Flex direction="column">
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500" fontWeight="400">
            {description}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody px="5px">
        <Grid
          templateColumns={{ sm: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }}
          templateRows={{ sm: "1fr 1fr 1fr auto", md: "1fr 1fr", xl: "1fr" }}
          gap="24px"
          overflowX="scroll"
        >
          <CarouselCard
            id={1}
            image={imageParcel1}
            name={"Parcel #1"}
            category={"Category"}
            description={"Description about the Parcel #1."}
            avatars={[avatar2, avatar4, avatar6]}
          />
          <CarouselCard
            id={2}
            image={imageParcel2}
            name={"Parcel #2"}
            category={"Category"}
            description={"Description about the Parcel #1."}
            avatars={[avatar4, avatar2, avatar6, avatar4]}
          />
          <CarouselCard
            id={3}
            image={imageParcel3}
            name={"Parcel #3"}
            category={"Category"}
            description={"Description about the Parcel #1."}
            avatars={[avatar2, avatar4, avatar6]}
          />
          <CarouselCard
            id={1}
            image={imageParcel1}
            name={"Parcel #1"}
            category={"Category"}
            description={"Description about the Parcel #1."}
            avatars={[avatar2, avatar4, avatar6]}
          />
          <CarouselCard
            id={2}
            image={imageParcel2}
            name={"Parcel #2"}
            category={"Category"}
            description={"Description about the Parcel #1."}
            avatars={[avatar4, avatar2, avatar6, avatar4]}
          />
          <CarouselCard
            id={3}
            image={imageParcel3}
            name={"Parcel #3"}
            category={"Category"}
            description={"Description about the Parcel #1."}
            avatars={[avatar2, avatar4, avatar6]}
          />
        </Grid>
      </CardBody>
    </Card>
  );
};

export default CarouselHorizontal;
