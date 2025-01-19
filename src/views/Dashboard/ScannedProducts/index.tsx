import {
  Box,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Stack,
  Badge,
  Progress,
  Icon,
  Image
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useGetUserProductionScansQuery } from 'store/api/historyApi';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { HSeparator } from 'components/Separator/Separator';

export default function ScannedProductsView() {
  const textColor = useColorModeValue('gray.700', 'white');
  const cardColor = useColorModeValue('white', 'gray.700');
  const { data: productions, isLoading } = useGetUserProductionScansQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderStars = (reputation: number) => {
    return (
      <Stack direction="row" spacing="2px" color="orange.300">
        {[1, 2, 3, 4, 5].map((index) => (
          <Icon
            key={index}
            as={reputation >= index ? BsStarFill : reputation > index - 0.5 ? BsStarHalf : BsStar}
            w="20px"
            h="20px"
          />
        ))}
      </Stack>
    );
  };

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }} width="100%">
      <Text color={textColor} fontWeight="bold" fontSize="2xl" mb="20px" padding="10px">
        Scanned Products
      </Text>
      <Card
        w={{ sm: '100%', md: '80%', lg: '100%' }}
        mx="auto"
        p={{ sm: '16px', md: '32px', lg: '48px' }}
        boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px">
        <CardHeader p="12px 5px" mb="12px">
          <HSeparator my="16px" />
        </CardHeader>
        <CardBody px="5px">
          {isLoading ? (
            <Progress size="xs" isIndeterminate />
          ) : (
            <Stack width="100%" spacing={8}>
              {productions?.map((production, index) => (
                <NavLink key={index} to={`/production/${production.id}/`}>
                  <Box
                    p={8}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="2xl"
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{
                      shadow: '2xl',
                      transform: 'translateY(-4px)',
                      borderColor: 'green.200'
                    }}>
                    <Flex direction={{ base: 'column', md: 'row' }} gap="25px">
                      {production.images?.length > 0 && (
                        <Image
                          src={production.images[0]}
                          w="100px"
                          h="80px"
                          borderRadius="lg"
                          objectFit="cover"
                        />
                      )}
                      <Box flex="1">
                        <Flex align="center" mb={4}>
                          <Text fontSize="xl" fontWeight="bold" color={textColor} mr={4}>
                            {production.product.name}
                          </Text>
                          {renderStars(production.reputation)}
                        </Flex>
                        <Text fontSize="sm" color="gray.500" mb={4}>
                          {format(new Date(production.start_date), 'MMMM dd, yyyy')}
                        </Text>
                        <Flex align="center" mb={3}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                            Establishment:{' '}
                          </Text>
                          <Text fontSize="md" color="gray.500" fontWeight="400">
                            {production.parcel.establishment.name}
                          </Text>
                        </Flex>
                        <Flex align="center" mb={3}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                            Company:{' '}
                          </Text>
                          <Text fontSize="md" color="gray.500" fontWeight="400">
                            {production.company}
                          </Text>
                        </Flex>
                      </Box>
                      <Box minW="200px">
                        <Text fontSize="md" color={textColor} fontWeight="bold" mb={3}>
                          Certification Progress
                        </Text>
                        <Progress
                          value={production.certificate_percentage}
                          size="lg"
                          colorScheme={production.certificate_percentage >= 80 ? 'green' : 'orange'}
                          borderRadius="full"
                          mb={2}
                        />
                        <Text fontSize="sm" color="gray.500" textAlign="right">
                          {production.certificate_percentage}%
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </NavLink>
              ))}
            </Stack>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}
