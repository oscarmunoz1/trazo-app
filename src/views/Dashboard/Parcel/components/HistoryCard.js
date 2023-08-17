import { FaRegCheckCircle, FaRegDotCircle } from "react-icons/fa";
// Chakra imports
import {
  Flex,
  Icon,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import DashboardTableRow from "components/Tables/DashboardTableRow";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import React from "react";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar10.png";
import avatar3 from "assets/img/avatars/avatar2.png";
import { convertToObject } from "typescript";
import { useGetParcelHistoriesQuery } from "store/api/historyApi";

const HistoryCard = ({ title, amount, captions }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const navigate = useNavigate();

  const { parcelId, establishmentId } = useParams();

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetParcelHistoriesQuery(parcelId, {
    skip: parcelId === undefined,
  });

  return (
    <Card
      p="16px"
      h={{ sm: "fit-content", xl: "fit-content" }}
      overflowX={{ sm: "scroll", xl: "hidden", height: "fit-content" }}
    >
      <CardHeader p="12px 0px 28px 0px">
        <Flex direction="column">
          <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
            Productions
          </Text>
          <Flex align="center">
            <Icon
              as={IoCheckmarkDoneCircleSharp}
              color="green.300"
              w={4}
              h={4}
              pe="3px"
            />
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              <Text fontWeight="bold" as="span">
                {amount} done
              </Text>{" "}
              this month.
            </Text>
          </Flex>
        </Flex>
      </CardHeader>
      {data && data.length > 0 ? (
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" ps="0px">
              {captions.map((caption, idx) => {
                return (
                  <Th color="gray.400" key={idx} ps={idx === 0 ? "0px" : null}>
                    {caption}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((history) => {
              return (
                <DashboardTableRow
                  key={history.id}
                  name={`${new Date(
                    history.start_date
                  ).toLocaleDateString()}-${new Date(
                    history.finish_date
                  ).toLocaleDateString()}`}
                  logo={
                    history.certificate_percentage === 100
                      ? FaRegCheckCircle
                      : FaRegDotCircle
                  }
                  members={[avatar1, avatar2, avatar3]}
                  budget={`$${history.earning}`}
                  progression={history.certificate_percentage}
                  color={
                    history.certificate_percentage === 100
                      ? "green.300"
                      : "blue.400"
                  }
                  onClick={() => {
                    navigate(
                      `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${history.id}`
                    );
                  }}
                />
              );
            })}
          </Tbody>
        </Table>
      ) : (
        <Flex width={"100%"} height={"70px"} justifyContent="center">
          <Text
            display={"flex"}
            fontSize={"md"}
            fontWeight={"300"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
          >
            No productions yet, start by finishing the current production.
          </Text>
        </Flex>
      )}
    </Card>
  );
};

export default HistoryCard;
