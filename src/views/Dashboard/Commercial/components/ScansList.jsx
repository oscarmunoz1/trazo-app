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
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  useColorModeValue
} from '@chakra-ui/react';

// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';
import CardHeader from 'components/Card/CardHeader.tsx';
import React, { useState } from 'react';
import ScansRow from 'components/Tables/ScansRow';
import { useIntl } from 'react-intl';

const ScansList = ({ title, labels, scansData }) => {
  const intl = useIntl();
  const [expandedRowId, setExpandedRowId] = useState(null);
  // Chakra Color Mode
  const textColor = useColorModeValue('gray.700', 'white');

  const handleExpandRow = (index) => {
    setExpandedRowId(expandedRowId === index ? null : index);
  };

  return (
    <Card px="0px" height="780px">
      <CardHeader px="22px" mb="32px">
        <Flex w="100%" justifyContent="space-between">
          <Text color={textColor} fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          <Button
            colorScheme="teal"
            borderColor="green.400"
            color="green.400"
            variant="outline"
            fontSize="xs"
            w="100px"
            h="35px"
            mt={{ sm: '16px', md: '0px' }}
          >
            {intl.formatMessage({ id: 'app.viewAll' }).toUpperCase()}
          </Button>
        </Flex>
      </CardHeader>
      <CardBody overflowX={{ sm: 'scroll', md: 'hidden' }}>
        <Table variant="simple">
          <Thead>
            <Tr>
              {labels.map((label) => {
                return (
                  <Th
                    color="gray.400"
                    fontSize="xs"
                    key={label}
                    paddingInlineStart={'25px'}
                    paddingInlineEnd={'25px'}
                  >
                    {label}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {scansData && scansData.length > 0 ? (
              scansData.map((scan, index) => (
                <React.Fragment key={index}>
                  <ScansRow
                    {...scan}
                    isExpanded={expandedRowId === index}
                    onExpand={() => handleExpandRow(index)}
                  />
                  {expandedRowId === index && (
                    <Tr>
                      <Td colSpan={labels.length} paddingInlineStart={'20px'}>
                        <Text color={textColor} fontSize="sm" p={4} bg="gray.50" borderRadius="md">
                          {scan.comment}
                        </Text>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Tr>
                <Td colSpan={labels.length} borderBottom="none">
                  <Flex justify="center" align="center" py={8} borderBottom="none">
                    <Text color={textColor} fontSize="md">
                      {intl.formatMessage({ id: 'app.noScansAvailable' })}
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ScansList;
