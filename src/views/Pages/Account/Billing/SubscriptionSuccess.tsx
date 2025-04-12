// trazo-app/src/views/Pages/Account/Billing/SubscriptionSuccess.jsx

import React, { useEffect } from 'react';
import { Box, Spinner, Text, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

function SubscriptionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();

  useEffect(() => {
    const handleSubscriptionSuccess = () => {
      const searchParams = new URLSearchParams(location.search);
      const success = searchParams.get('success');
      const isNewCompany = searchParams.get('new_company') === 'true';
      const companyId = searchParams.get('company_id');
      const sessionId = searchParams.get('session_id');

      if (success === 'true' && sessionId) {
        toast({
          title: intl.formatMessage({ id: 'app.subscriptionSuccess' }),
          description: intl.formatMessage({ id: 'app.subscriptionSuccessDescription' }),
          status: 'success',
          duration: 5000,
          isClosable: true
        });

        // If this was for a new company, redirect to establishment creation
        if (isNewCompany && companyId) {
          setTimeout(() => {
            navigate(`/admin/dashboard/establishment/add`);
          }, 2000);
        }
      }
    };

    handleSubscriptionSuccess();
  }, [location, toast, intl, navigate]);

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
      <Text color="green.500" fontSize="xl" fontWeight="bold">
        {intl.formatMessage({ id: 'app.processingSubscription' })}
      </Text>
      <Text mt={2} fontSize="md" color="gray.500">
        {intl.formatMessage({ id: 'app.redirectingAutomatically' })}
      </Text>
    </Box>
  );
}

export default SubscriptionSuccess;
