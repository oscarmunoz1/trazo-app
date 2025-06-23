// Chakra imports
import {
  CircularProgress,
  Flex,
  Icon,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Card,
  CardHeader,
  Badge,
  Button,
  Tooltip
} from '@chakra-ui/react';
import { FaRegCheckCircle, FaRegDotCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// Custom components
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import React from 'react';
import avatar1 from 'assets/img/avatars/avatar1.png';
import avatar2 from 'assets/img/avatars/avatar10.png';
import avatar3 from 'assets/img/avatars/avatar2.png';
import { convertToObject } from 'typescript';
import { useGetParcelHistoriesQuery } from 'store/api/historyApi';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

// Import Enhanced Table Row Component
import CarbonDashboardTableRow from './CarbonDashboardTableRow';

const HistoryCard = ({ title, amount, captions }) => {
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { parcelId, establishmentId } = useParams();

  const { data, error, isLoading, isFetching, refetch } = useGetParcelHistoriesQuery(
    { companyId: currentCompany?.id, establishmentId, parcelId },
    {
      skip: !parcelId || !establishmentId || !currentCompany || currentCompany?.id === undefined
    }
  );

  // Enhanced captions for carbon transparency focus
  const carbonFocusedCaptions = [
    'Production Overview', // Combined time frame and production info
    'Product & Verification', // Combined product and verification status
    'Team', // Members column (hidden on mobile)
    'Carbon Impact' // Enhanced carbon score with impact level
  ];

  return (
    <Card
      bg={cardBgColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      h={{ sm: 'fit-content', xl: 'fit-content' }}
      transition="all 0.3s ease"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
    >
      <CardHeader p="20px" pb="12px">
        <Flex direction="column" gap={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                {intl.formatMessage({ id: 'app.productions' })}
              </Text>
              <Badge
                colorScheme="green"
                variant="solid"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                textTransform="none"
              >
                Carbon Tracked
              </Badge>
            </Flex>
            <Tooltip
              label={
                data &&
                data.some(
                  (production) =>
                    !production.finish_date || new Date(production.finish_date) > new Date()
                )
                  ? 'Complete current production before starting a new one'
                  : 'Start a new production cycle'
              }
              placement="bottom-end"
            >
              <Button
                size="sm"
                colorScheme="green"
                variant="ghost"
                leftIcon={<Icon as={IoCheckmarkDoneCircleSharp} />}
                isDisabled={
                  data &&
                  data.some(
                    (production) =>
                      !production.finish_date || new Date(production.finish_date) > new Date()
                  )
                }
                onClick={() =>
                  navigate(
                    `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/add`
                  )
                }
              >
                New Production
              </Button>
            </Tooltip>
          </Flex>

          <Flex align="center" gap={2}>
            <Icon as={IoCheckmarkDoneCircleSharp} color="green.500" w={5} h={5} />
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              <Text fontWeight="bold" as="span" color={textColor}>
                {amount}{' '}
                {amount > 1
                  ? intl.formatMessage({ id: 'app.productions' }).toLowerCase()
                  : intl.formatMessage({ id: 'app.production' }).toLowerCase()}
              </Text>{' '}
              {amount > 1
                ? intl.formatMessage({ id: 'app.completedThisYearPlural' })
                : intl.formatMessage({ id: 'app.completedThisYearSingular' })}
            </Text>
          </Flex>
        </Flex>
      </CardHeader>

      {isLoading ? (
        <Flex width={'100%'} height={'120px'} justifyContent={'center'} alignItems="center">
          <CircularProgress isIndeterminate color="green.500" size="40px" />
        </Flex>
      ) : (
        <>
          {data && data.length > 0 ? (
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  {carbonFocusedCaptions.map((caption, idx) => (
                    <Th
                      key={idx}
                      color="gray.400"
                      fontWeight="semibold"
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      ps={idx === 0 ? '20px' : '16px'}
                      py="16px"
                      borderColor="gray.100"
                      bg="gray.50"
                      _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
                      display={idx === 2 ? { base: 'none', md: 'table-cell' } : 'table-cell'}
                    >
                      {caption}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((history) => (
                  <CarbonDashboardTableRow
                    key={history.id}
                    production={history}
                    onClick={() => {
                      navigate(
                        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${history.id}`
                      );
                    }}
                  />
                ))}
              </Tbody>
            </Table>
          ) : (
            <Flex
              width={'100%'}
              height={'120px'}
              justifyContent="center"
              alignItems="center"
              direction="column"
              gap={3}
            >
              <Text fontSize={'lg'} fontWeight={'500'} color="gray.400" textAlign={'center'}>
                {intl.formatMessage({ id: 'app.noProductionsYet' })}
              </Text>
              <Button
                size="sm"
                colorScheme="green"
                variant="outline"
                onClick={() =>
                  navigate(
                    `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/add`
                  )
                }
              >
                Create First Production
              </Button>
            </Flex>
          )}
        </>
      )}
    </Card>
  );
};

export default HistoryCard;
