// Chakra imports
import {
  Button,
  Flex,
  Icon,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Custom components
import Card from "./Card.js";
import CardBody from "./CardBody.js";
import ParcelModal from "dialog/ParcelModal.js";
import React, { useState } from "react";
// react icons
import { BsArrowRight } from "react-icons/bs";

const CardWithImage = ({ title, name, description, image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card minHeight="290.5px" p="1.2rem">
      <CardBody w="100%">
        <Flex flexDirection={{ sm: "column", lg: "row" }} w="100%">
          <Flex
            flexDirection="column"
            h="100%"
            lineHeight="1.6"
            width={{ lg: "45%" }}
          >
            <Text fontSize="sm" color="gray.400" fontWeight="bold">
              {title}
            </Text>
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              {name}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {description}
            </Text>
            <Spacer />
            <Flex align="center">
              <Button
                p="0px"
                variant="no-hover"
                bg="transparent"
                my={{ sm: "1.5rem", lg: "0px" }}
                onClick={onOpen}
              >
                <Text
                  fontSize="sm"
                  color={textColor}
                  fontWeight="bold"
                  cursor="pointer"
                  transition="all .5s ease"
                  my={{ sm: "1.5rem", lg: "0px" }}
                  _hover={{ me: "4px" }}
                >
                  Read more
                </Text>
                <Icon
                  as={BsArrowRight}
                  w="20px"
                  h="20px"
                  fontSize="2xl"
                  transition="all .5s ease"
                  mx=".3rem"
                  cursor="pointer"
                  pt="4px"
                  _hover={{ transform: "translateX(20%)" }}
                />
              </Button>
              <ParcelModal
                title={title}
                name={name}
                description={description}
                image={image}
                onClose={onClose}
                isOpen={isOpen}
              />
            </Flex>
          </Flex>
          <Spacer />
          <Flex
            bg="green.300"
            align="center"
            justify="center"
            borderRadius="15px"
            width="320px"
            height="250px"
          >
            {image}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CardWithImage;
