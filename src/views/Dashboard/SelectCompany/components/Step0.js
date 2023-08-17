// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { dashboardTableData, timelineData } from "variables/general";

// assets
import { AiFillSetting } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardWithImage from "components/Card/CardWithImage";
import { FaCube } from "react-icons/fa";
import IconBox from "components/Icons/IconBox";
import { MdModeEdit } from "react-icons/md";
import { RocketIcon } from "components/Icons/Icons";
import avatar4 from "assets/img/avatars/avatar4.png";
import imageMap from "assets/img/imageMap.png";
import imageParcel1 from "assets/img/ImageParcel1.png";
import { useGetParcelQuery } from "store/api/productApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Step0({ option, handleChange, handleNext }) {
  const textColor = useColorModeValue("gray.700", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
  const iconColor = useColorModeValue("gray.300", "gray.700");

  const [checkboxes, setCheckboxes] = useState({
    create: false,
    join: false,
  });

  return (
    <Card>
      <CardHeader mb="40px">
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          w="80%"
          mx="auto"
        >
          <Text color={textColor} fontSize="lg" fontWeight="bold" mb="4px">
            Select an option
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            You can create a new company or join an existing one. If you join an
            existing one, you will be able to see all the parcels and
            establishments that are already registered.
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={{ sm: "20px", lg: "35px" }}
            alignSelf="center"
            justifySelf="center"
            mb="24px"
          >
            <Flex direction="column" align="center">
              <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                <Flex
                  w="100%"
                  h="100%"
                  borderRadius="12px"
                  justify="center"
                  transition=".5s all ease"
                  border="1px solid lightgray"
                  align="center"
                  bg={option === "create" ? "green.400" : "#fff"}
                  _hover={{ opacity: "0.8" }}
                >
                  <Checkbox
                    onChange={() => handleChange("create")}
                    display="none"
                  />
                  <Icon
                    as={AiFillSetting}
                    w="54px"
                    h="54px"
                    color={option === "create" ? "#fff" : iconColor}
                  />
                </Flex>
              </FormLabel>
              <Text color={textColor} fontWeight="bold" fontSize="md">
                Create
              </Text>
            </Flex>

            <Flex direction="column" align="center">
              <FormLabel w="150px" h="150px" cursor="pointer" mb="16px">
                <Flex
                  w="100%"
                  h="100%"
                  borderRadius="12px"
                  justify="center"
                  transition=".5s all ease"
                  border="1px solid lightgray"
                  align="center"
                  bg={option === "join" ? "green.400" : "#fff"}
                  _hover={{ opacity: "0.8" }}
                >
                  <Checkbox
                    onChange={() => handleChange("join")}
                    display="none"
                  />
                  <Icon
                    as={RocketIcon}
                    w="54px"
                    h="54px"
                    color={option === "join" ? "#fff" : iconColor}
                  />
                </Flex>
              </FormLabel>
              <Text color={textColor} fontWeight="bold" fontSize="md">
                Join
              </Text>
            </Flex>
          </Stack>

          <Flex justifyContent={"flex-end"}>
            <Button
              _hover={{
                bg: "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
              }}
              bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
              alignSelf="flex-end"
              mt="24px"
              w={{ sm: "75px", lg: "100px" }}
              h="35px"
              onClick={handleNext}
              disabled={option === ""}
            >
              <Text fontSize="xs" color="#fff" fontWeight="bold">
                NEXT
              </Text>
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}
