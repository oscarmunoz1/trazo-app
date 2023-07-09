// Chakra imports
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import ProfileInformation from "./components/ProfileInformation";
import React from "react";

const InformationModal = ({
  title,
  name,
  description,
  city,
  zone,
  state,
  image,
  onClose,
  isOpen,
}) => {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="50%">
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Text fontSize="sm" color="gray.400" fontWeight="bold">
            {city || zone || ""}, {state}
          </Text> */}
          <Flex flexDirection={"column"}>
            <Flex
              bg="green.300"
              align="center"
              justify="center"
              borderRadius="15px"
              width="320px"
              height="240px"
              alignSelf="flex-end"
            >
              {image}
            </Flex>
            <div
              flex-grow={1}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </Flex>
          <Flex mr={"10"} ml={"10"} mb={"5"} mt="5"></Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InformationModal;
