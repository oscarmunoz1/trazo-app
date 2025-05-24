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
  useColorModeValue
} from '@chakra-ui/react';
import { FaRegCheckCircle, FaRegDotCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// Custom components
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader.tsx';
import DashboardTableRow from 'components/Tables/DashboardTableRow';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import React from 'react';
import avatar1 from 'assets/img/avatars/avatar1.png';
import avatar2 from 'assets/img/avatars/avatar10.png';
import avatar3 from 'assets/img/avatars/avatar2.png';
import { convertToObject } from 'typescript';
import { useGetParcelHistoriesQuery } from 'store/api/historyApi';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

const HistoryCard = ({ title, amount, captions }) => {
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');
  const navigate = useNavigate();

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { parcelId, establishmentId } = useParams();

  const { data, error, isLoading, isFetching, refetch } = useGetParcelHistoriesQuery(
    { companyId: currentCompany?.id, establishmentId, parcelId },
    {
      skip: !parcelId || !establishmentId || !currentCompany || currentCompany?.id === undefined
    }
  );

  return (
    <Card
      overflow={'auto'}
      p="16px"
      h={{ sm: 'fit-content', xl: 'fit-content' }}
      overflowX={{ sm: 'scroll', xl: 'hidden', height: 'fit-content' }}
    >
      <CardHeader p="12px 0px 28px 0px">
        <Flex direction="column">
          <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
            {intl.formatMessage({ id: 'app.productions' })}
          </Text>
          <Flex align="center">
            <Icon as={IoCheckmarkDoneCircleSharp} color="green.300" w={4} h={4} pe="3px" />
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              <Text fontWeight="bold" as="span">
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
          <CircularProgress isIndeterminate value={1} color="green.300" size="25px" />
        </Flex>
      ) : (
        <>
          {data && data.length > 0 ? (
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr my=".8rem" ps="0px">
                  {captions.map((caption, idx) => {
                    return (
                      <Th color="gray.400" key={idx} ps={idx === 0 ? '0px' : null}>
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
                      name={`${new Date(history.start_date).toLocaleDateString()}-${new Date(
                        history.finish_date
                      ).toLocaleDateString()}`}
                      logo={
                        history.certificate_percentage === 100 ? FaRegCheckCircle : FaRegDotCircle
                      }
                      members={history.members}
                      product={history.product}
                      progression={history.certificate_percentage}
                      color={history.certificate_percentage === 100 ? 'green.300' : 'blue.400'}
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
            <Flex width={'100%'} height={'70px'} justifyContent="center">
              <Text
                display={'flex'}
                fontSize={'md'}
                fontWeight={'300'}
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'center'}
              >
                {intl.formatMessage({ id: 'app.noProductionsYet' })}
              </Text>
            </Flex>
          )}
        </>
      )}
    </Card>
  );
};

export default HistoryCard;
