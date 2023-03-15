// Chakra imports
import {
  Button,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
// Custom components
import ProfileInformation from "./components/ProfileInformation";
import React from "react";

const ParcelModal = ({ title, name, description, image, onClose, isOpen }) => {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxH="60%" maxW="60%">
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm" color="gray.400" fontWeight="bold">
            {title}
          </Text>
          <ProfileInformation
            // title={title}
            description={""}
            name={"Esthera Jackson"}
            mobile={"(44) 123 1234 123"}
            email={"esthera@simmmple.com"}
            location={"United States"}
          />
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

export default ParcelModal;
