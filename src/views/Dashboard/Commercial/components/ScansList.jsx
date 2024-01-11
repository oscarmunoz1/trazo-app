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
  useColorModeValue
} from '@chakra-ui/react';

// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';
import CardHeader from 'components/Card/CardHeader.tsx';
import React from 'react';
import ScansRow from 'components/Tables/ScansRow';

const ScansList = ({ title, labels, scansData }) => {
  // Chakra Color Mode
  const textColor = useColorModeValue('gray.700', 'white');

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
            mt={{ sm: '16px', md: '0px' }}>
            VIEW ALL
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
                    paddingInlineEnd={'25px'}>
                    {label}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {scansData &&
              scansData.map((sale) => {
                return <ScansRow {...sale} />;
              })}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ScansList;
