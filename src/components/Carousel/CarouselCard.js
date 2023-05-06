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
import { NavLink, useNavigate } from "react-router-dom";

import React from "react";
import { useParams } from "react-router-dom";

const CarouselCard = ({ id, image, name, category, avatars }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const { establishmentId } = useParams();
  const navigate = useNavigate();

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
          bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.28) 100%)"
        ></Box>
      </Box>
      <Flex direction="column">
        <Text fontSize="md" color="gray.500" fontWeight="600" mb="10px">
          {name}
        </Text>
        <Text fontSize="lg" color={textColor} fontWeight="bold" mb="10px">
          {category}
        </Text>
        <Flex justifyContent="space-between">
          {/* <NavLink to={`/admin/dashboard/establishment/1/parcel/${id}`}> */}
          <Button
            variant="outline"
            colorScheme="green"
            minW="110px"
            h="36px"
            fontSize="xs"
            px="1.5rem"
            onClick={() => {
              navigate(
                `/admin/dashboard/establishment/${establishmentId}/parcel/${id}`,
                {
                  replace: true,
                }
              );
            }}
          >
            VIEW PARCEL
          </Button>
          {/* </NavLink> */}
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
