// Chakra imports
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { NavLink } from "react-router-dom";
import React from "react";

const CarouselCard = ({ id, image, name, category, avatars, description }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Flex direction="column">
      <Box
        w="300px"
        h="200px"
        mb="20px"
        position="relative"
        borderRadius="15px"
      >
        <Image
          width="100%"
          height="100%"
          objectFit="cover"
          src={image}
          borderRadius="15px"
        />
        <Box
          w="100%"
          h="100%"
          position="absolute"
          top="0"
          borderRadius="15px"
          bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)"
        ></Box>
      </Box>
      <Flex direction="column">
        <Text fontSize="md" color="gray.500" fontWeight="600" mb="10px">
          {name}
        </Text>
        <Text fontSize="xl" color={textColor} fontWeight="bold" mb="10px">
          {category}
        </Text>
        <Text fontSize="md" color="gray.500" fontWeight="400" mb="20px">
          {description}
        </Text>
        <Flex justifyContent="space-between">
          <NavLink to={`/admin/dashboard/establishment/1/parcel/${id}`}>
            <Button
              variant="outline"
              colorScheme="green"
              minW="110px"
              h="36px"
              fontSize="xs"
              px="1.5rem"
            >
              VIEW PARCEL
            </Button>
          </NavLink>
          <AvatarGroup size="xs">
            {avatars.map((el, idx) => {
              return <Avatar src={el} key={idx} />;
            })}
          </AvatarGroup>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CarouselCard;
