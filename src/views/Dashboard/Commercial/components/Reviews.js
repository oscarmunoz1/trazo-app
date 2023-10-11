/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Button,
  Flex,
  Progress,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useGetEstablishmentLastReviewsQuery,
  useGetEstablishmentProductReputationPercentageQuery,
} from "store/api/reviewApi";

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import GeneralCard from "./GeneralCard";
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Reviews = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const { establishmentId } = useParams();

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { data: reviews } = useGetEstablishmentLastReviewsQuery(
    {
      companyId: currentCompany?.id,
      establishmentId,
    },
    {
      skip: !currentCompany || !establishmentId,
    }
  );

  const {
    data: reviewsPercentage,
  } = useGetEstablishmentProductReputationPercentageQuery(
    {
      companyId: currentCompany?.id,
      establishmentId,
    },
    {
      skip: !currentCompany || !establishmentId,
    }
  );

  return (
    <Card>
      <CardHeader mb="24px">
        <Text fontSize="lg" color={textColor} fontWeight="bold">
          Reviews
        </Text>
      </CardHeader>
      <CardBody>
        <Flex gap="24px" width={"100%"}>
          <Flex direction="column" w="100%" flex={1}>
            <Stack direction="column" spacing="28px" w="100%" mb="40px">
              <Flex direction="column">
                <Flex justify="space-between" mb="8px">
                  <Text fontSize="md" color="gray.400" fontWeight="500">
                    Positive Reviews
                  </Text>
                  <Text fontSize="md" color="gray.400" fontWeight="500">
                    {reviewsPercentage?.positive}%
                  </Text>
                </Flex>
                <Progress
                  colorScheme="teal"
                  size="sm"
                  value={reviewsPercentage?.positive}
                  borderRadius="15px"
                ></Progress>
              </Flex>
              <Flex direction="column">
                <Flex justify="space-between" mb="8px">
                  <Text fontSize="md" color="gray.400" fontWeight="500">
                    Neutral Reviews
                  </Text>
                  <Text fontSize="md" color="gray.400" fontWeight="500">
                    {reviewsPercentage?.neutral}%
                  </Text>
                </Flex>
                <Progress
                  colorScheme="gray"
                  size="sm"
                  value={reviewsPercentage?.neutral}
                  borderRadius="15px"
                ></Progress>
              </Flex>
              <Flex direction="column">
                <Flex justify="space-between" mb="8px">
                  <Text fontSize="md" color="gray.400" fontWeight="500">
                    Negative Reviews
                  </Text>
                  <Text fontSize="md" color="gray.400" fontWeight="500">
                    {reviewsPercentage?.negative}%
                  </Text>
                </Flex>
                <Progress
                  colorScheme="red"
                  size="sm"
                  value={reviewsPercentage?.negative}
                  borderRadius="15px"
                ></Progress>
              </Flex>
            </Stack>
          </Flex>
          <Flex flexDirection={"column"} gap="16px" width={"100%"} flex={2}>
            {/* <GeneralCard />
            <GeneralCard />
            <GeneralCard /> */}
            {reviews?.map((review) => (
              <GeneralCard key={review.id} review={review} />
            ))}
            <Button
              variant="no-hover"
              borderRadius="12px"
              bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
              p="12px 24px"
              alignSelf="flex-end"
            >
              <Text color="#fff" fontSize="xs">
                VIEW ALL REVIEWS
              </Text>
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Reviews;
