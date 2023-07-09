// Chakra imports
import {
  Button,
  Link,
  Stack,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

import React from "react";

const ScansRow = ({ date, product, location, parcel, comment }) => {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr pe="0px" paddingInlineStart={"20px"} paddingInlineEnd={"20px"}>
      <Td pe="0px" paddingInlineStart={"20px"} paddingInlineEnd={"20px"}>
        <Text color={textColor} fontSize="sm" fontWeight="bold">
          {date}
        </Text>
      </Td>
      <Td pe="0px" paddingInlineStart={"20px"} paddingInlineEnd={"20px"}>
        <Text color={textColor} fontSize="sm">
          {product}
        </Text>
      </Td>
      <Td paddingInlineStart={"20px"} paddingInlineEnd={"20px"}>
        <Text color={textColor} fontSize="sm">
          {location}
        </Text>
      </Td>
      <Td paddingInlineStart={"20px"} paddingInlineEnd={"20px"}>
        <Text color={textColor} fontSize="sm">
          {parcel}
        </Text>
      </Td>
      <Td paddingInlineStart={"20px"} paddingInlineEnd={"20px"}>
        {/* <Text color={textColor} fontSize="sm"></Text> */}
        {/* <Link
          color={comment ? "green.400" : "gray.400"}
          href=""
          disabled={comment === ""}
          fontSize="sm"
          cursor={comment ? "pointer" : "not-allowed"}
        >
          View
        </Link> */}
        <Button
          onClick={() => console.log("click")}
          variant="no-hover"
          bg="green.400"
          w="100px"
          h="35px"
          disabled={comment === ""}
          fontSize="xs"
          color="#fff"
          fontWeight="bold"
          alignSelf={{ sm: "flex-start", md: "flex-end" }}
          mt={{ sm: "16px", md: "0px" }}
        >
          VIEW
        </Button>
      </Td>
    </Tr>
  );
};

export default ScansRow;
