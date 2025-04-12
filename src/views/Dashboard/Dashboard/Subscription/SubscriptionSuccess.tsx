import React, { useEffect } from 'react';
import { Box, Heading, Text, Spinner, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

function SubscriptionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const sessionId = params.get('session_id');
    const isNewCompany = params.get('new_company') === 'true';
    const companyId = params.get('company_id');

    if (success === 'true' && sessionId) {
      // Show success message
      toast({
        title: intl.formatMessage({ id: 'app.subscriptionSuccess' }),
        description: intl.formatMessage({ id: 'app.subscriptionSuccessDescription' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Redirect to establishment creation after a short delay
      setTimeout(() => {
        navigate('/admin/dashboard/establishment/add');
      }, 2000);
    }
  }, [location, navigate, toast, intl]);

  return (
    <Box textAlign="center" py={10} px={6}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="green.500"
        size="xl"
        mb={4}
      />
      <Heading as="h2" size="xl" mt={6} mb={2} color="green.500">
        {intl.formatMessage({ id: 'app.subscriptionProcessed' })}
      </Heading>
      <Text color="gray.500">{intl.formatMessage({ id: 'app.redirectingToEstablishments' })}</Text>
    </Box>
  );
}

export default SubscriptionSuccess;
