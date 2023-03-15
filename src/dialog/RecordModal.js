// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useEditableControls,
} from "@chakra-ui/react";

import { FaPlus } from "react-icons/fa";
import ProfileInformation from "./components/ProfileInformation";
// Custom components
import React from "react";
import imageParcel1 from "assets/img/ImageParcel1.png";

const RecordModal = ({ title, name, onClose, isOpen }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ sm: "60%", md: "40%" }}>
        <ModalHeader>Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex flexDirection="column">
              <Flex flexDirection="column" marginBottom={"15px"}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Date
                </FormLabel>
                <Input />
              </Flex>
              <Flex flexDirection="column">
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Description
                </FormLabel>
                <Input />
              </Flex>
            </Flex>
            <Image
              width="40%"
              height="100%"
              objectFit="cover"
              src={imageParcel1}
              borderRadius="15px"
            />
          </Flex>
        </ModalBody>
        <ModalFooter gap="20px">
          <Button
            bg={bgButton}
            color="white"
            fontSize="xs"
            variant="no-hover"
            minW="100px"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="outline"
            colorScheme="green"
            minW="110px"
            h="36px"
            fontSize="xs"
            px="1.5rem"
          >
            Accept
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RecordModal;
