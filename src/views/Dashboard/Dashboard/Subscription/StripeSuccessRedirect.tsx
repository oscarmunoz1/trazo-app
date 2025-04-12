import React, { useEffect, useState } from 'react';
import {
  Box,
  Spinner,
  Text,
  useToast,
  VStack,
  Button,
  Heading,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/index';
import { useCompleteCheckoutMutation } from 'store/api/subscriptionApi';
import { setCompany } from 'store/features/companySlice';
import { Company } from 'types/company';

// Extended response type to include company data
interface ExtendedCompleteCheckoutResponse {
  success: boolean;
  subscription_id?: string;
  error?: string;
  company?: Company;
}

function StripeSuccessRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentCompany = useSelector((state: RootState) => state.company.currentCompany);
  const [redirectPath, setRedirectPath] = useState('/admin/dashboard');
  const [processingComplete, setProcessingComplete] = useState(false);

  // Use the RTK Query mutation hook
  const [completeCheckout, { isLoading, isError, error }] = useCompleteCheckoutMutation();

  useEffect(() => {
    const handleSubscriptionSuccess = async () => {
      const searchParams = new URLSearchParams(location.search);
      const success = searchParams.get('success');
      const isNewCompany = searchParams.get('new_company') === 'true';
      const companyId = searchParams.get('company_id');
      const sessionId = searchParams.get('session_id');

      console.log('Stripe success redirect params:', {
        success,
        isNewCompany,
        companyId,
        sessionId,
        currentCompany
      });

      // Set proper redirect path based on parameters
      if (isNewCompany && companyId) {
        setRedirectPath(`/admin/dashboard/establishment/add`);
      } else {
        setRedirectPath('/admin/dashboard');
      }

      if (success === 'true' && sessionId && companyId) {
        try {
          // Call the mutation to complete the checkout
          const result = (await completeCheckout({
            session_id: sessionId,
            company_id: companyId
          }).unwrap()) as ExtendedCompleteCheckoutResponse;

          if (result.success) {
            // If the company from redirect is different from current company in Redux
            if (
              companyId &&
              (!currentCompany || (currentCompany as Company)?.id?.toString() !== companyId)
            ) {
              // If company data is included in the response, update Redux state
              if (result.company) {
                dispatch(setCompany(result.company));
              }
            }

            // Show success toast
            toast({
              title: intl.formatMessage({ id: 'app.subscriptionSuccess' }),
              description: intl.formatMessage({ id: 'app.subscriptionSuccessDescription' }),
              status: 'success',
              duration: 5000,
              isClosable: true
            });

            setProcessingComplete(true);
          } else {
            // Show error toast
            toast({
              title: intl.formatMessage({ id: 'app.subscriptionError' }),
              description:
                result.error || intl.formatMessage({ id: 'app.subscriptionErrorDescription' }),
              status: 'error',
              duration: 5000,
              isClosable: true
            });
            setProcessingComplete(true);
          }
        } catch (err) {
          console.error('Error completing checkout:', err);
          // Show error toast
          toast({
            title: intl.formatMessage({ id: 'app.subscriptionError' }),
            description: intl.formatMessage({ id: 'app.subscriptionErrorDescription' }),
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          setProcessingComplete(true);
        }
      } else {
        setProcessingComplete(true);
      }
    };

    handleSubscriptionSuccess();
  }, [location, toast, intl, navigate, completeCheckout, currentCompany, dispatch]);

  const handleRedirect = () => {
    window.location.href = redirectPath;
  };

  // Show proper loading or error state
  if (isError) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {intl.formatMessage({ id: 'app.subscriptionError' })}
        </Alert>
        <Text mt={2} fontSize="md" color="gray.500">
          {(error as Error)?.message || String(error)}
        </Text>
        <Button mt={6} colorScheme="blue" onClick={() => navigate('/admin/dashboard')}>
          {intl.formatMessage({ id: 'app.backToDashboard' }) || 'Back to Dashboard'}
        </Button>
      </Box>
    );
  }

  return (
    <Box textAlign="center" py={10} px={6}>
      <VStack spacing={6}>
        {!processingComplete ? (
          <>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.500"
              size="xl"
            />
            <Heading color="green.500" fontSize="2xl">
              {intl.formatMessage({ id: 'app.processingSubscription' })}
            </Heading>
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.pleaseWait' })}
            </Text>
          </>
        ) : (
          <>
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              {intl.formatMessage({ id: 'app.subscriptionActivated' })}
            </Alert>
            <Text fontSize="md">
              {location.search.includes('new_company=true')
                ? intl.formatMessage({ id: 'app.createEstablishmentNow' })
                : intl.formatMessage({ id: 'app.subscriptionActive' })}
            </Text>
            <Button colorScheme="green" size="lg" onClick={handleRedirect}>
              {location.search.includes('new_company=true')
                ? intl.formatMessage({ id: 'app.createEstablishment' })
                : intl.formatMessage({ id: 'app.continueToDashboard' })}
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
}

export default StripeSuccessRedirect;
