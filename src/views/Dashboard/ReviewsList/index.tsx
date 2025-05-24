import {
  Box,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Stack,
  Badge,
  Icon,
  Image
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useGetUserReviewsQuery } from 'store/api/historyApi';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { HSeparator } from 'components/Separator/Separator';

export default function ReviewsListView() {
  const textColor = useColorModeValue('gray.700', 'white');
  const cardColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { data: reviews, isLoading } = useGetUserReviewsQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <Stack direction="row" spacing="2px" color="orange.300">
        {[1, 2, 3, 4, 5].map((index) => (
          <Icon
            key={index}
            as={rating >= index ? BsStarFill : rating > index - 0.5 ? BsStarHalf : BsStar}
            w="16px"
            h="16px"
          />
        ))}
      </Stack>
    );
  };

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
      <Text color={textColor} fontWeight="bold" fontSize="2xl" mb="20px" padding="10px">
        My Reviews
      </Text>
      <Card
        w={{ sm: '100%', md: '80%', lg: '100%' }}
        mx="auto"
        p={{ sm: '16px', md: '32px', lg: '48px' }}
        boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px"
      >
        <CardHeader p="12px 5px" mb="12px">
          <HSeparator my="16px" />
        </CardHeader>
        <CardBody px="5px">
          <Stack width="100%" spacing={6}>
            {!isLoading &&
              reviews?.map((review, index) => (
                <NavLink key={index} to={`/production/${review.history.id}/`}>
                  <Box
                    p={6}
                    shadow="sm"
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="xl"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      shadow: 'lg',
                      transform: 'translateY(-2px)',
                      borderColor: 'green.300'
                    }}
                  >
                    <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
                      {review.history.images?.length > 0 && (
                        <Image
                          src={review.history.images[0]}
                          w="120px"
                          h="90px"
                          borderRadius="lg"
                          objectFit="cover"
                          shadow="sm"
                        />
                      )}
                      <Box flex="1">
                        <Flex justify="space-between" align="center" mb={3}>
                          <Box>
                            <Text fontSize="lg" fontWeight="bold" color={textColor}>
                              {review.headline}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {format(new Date(review.date), 'MMMM dd, yyyy')}
                            </Text>
                          </Box>
                          {renderStars(review.rating)}
                        </Flex>
                        <Text color="gray.500" mb={4}>
                          {review.written_review}
                        </Text>
                        <Stack spacing={2}>
                          <Flex align="center">
                            <Text fontSize="sm" color={textColor} fontWeight="bold" minW="80px">
                              Product:
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {review.history.product}
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text fontSize="sm" color={textColor} fontWeight="bold" minW="80px">
                              Parcel:
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {review.history.parcel}
                            </Text>
                          </Flex>
                        </Stack>
                      </Box>
                    </Flex>
                  </Box>
                </NavLink>
              ))}
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
}
