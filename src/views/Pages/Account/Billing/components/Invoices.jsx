// Chakra imports
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';
import CardHeader from 'components/Card/CardHeader.tsx';
import InvoicesRow from 'components/Tables/InvoicesRow';
import React from 'react';
import { useIntl } from 'react-intl';

const Invoices = ({ title, data = [] }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const intl = useIntl();

  // Make sure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Card p="22px" my={{ sm: '24px', lg: '0px' }} ms={{ sm: '0px', lg: '24px' }}>
      <CardHeader>
        <Flex justify="space-between" align="center" mb="1rem" w="100%">
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            {title || intl.formatMessage({ id: 'app.invoices' })}
          </Text>
          {safeData.length > 0 && (
            <Button
              colorScheme="teal"
              borderColor="green.400"
              color="green.400"
              variant="outline"
              fontSize="xs"
              p="8px 32px">
              {intl.formatMessage({ id: 'app.viewAll' }) || 'VIEW ALL'}
            </Button>
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          {safeData.length > 0 ? (
            safeData.map((row, index) => {
              return (
                <InvoicesRow
                  key={row.id || index}
                  date={row.invoice_date || row.date}
                  code={row.stripe_invoice_id || row.code}
                  price={row.amount || row.price}
                  logo={row.logo}
                  format={row.format}
                  pdfUrl={row.invoice_pdf}
                />
              );
            })
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              {intl.formatMessage({ id: 'app.noInvoicesAvailable' }) || 'No invoices available'}
            </Text>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Invoices;
