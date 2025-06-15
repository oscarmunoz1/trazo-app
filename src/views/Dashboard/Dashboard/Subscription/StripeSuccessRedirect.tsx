import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Spinner,
  Text,
  useToast,
  VStack,
  Button,
  Heading,
  Alert,
  AlertIcon,
  HStack,
  Icon,
  useColorModeValue,
  Code,
  Flex
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/index';
import { useCompleteCheckoutMutation } from 'store/api/subscriptionApi';
import { setCompany } from 'store/features/companySlice';
import { Company } from 'types/company';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useGetCompanyQuery } from 'store/api/companyApi';
import stripeCheckoutStorage from 'utils/storage/StripeCheckoutStorage';
import { useSubscriptionProcessing } from '../../../../hooks/useSubscriptionProcessing';
import { subscriptionStorage } from '../../../../utils/subscriptionStorage';

// Extended response type to include company data
interface ExtendedCompleteCheckoutResponse {
  success: boolean;
  subscription_id?: string;
  error?: string;
  company?: Company;
}

const StripeSuccessRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const companyId = searchParams.get('company_id');
  const isNewCompany = searchParams.get('new_company') === 'true';
  const redirectPath =
    searchParams.get('redirect') ||
    (isNewCompany ? '/admin/dashboard/establishment/add' : '/admin/dashboard');

  // Set immediate flags to prevent any redirects during processing
  useEffect(() => {
    // Set flags immediately when component mounts
    localStorage.setItem('stripe_checkout_in_progress', 'true');
    localStorage.setItem('subscription_bypass_temp', 'true');
    localStorage.setItem('redirect_from_stripe', 'true');
    localStorage.setItem('stripe_success_redirect', 'true');
    localStorage.setItem('prevent_pricing_page', 'true');
    localStorage.setItem('skip_pricing_render', 'true');
    localStorage.setItem('subscription_last_check', Date.now().toString());

    // Cleanup function to remove flags when component unmounts
    return () => {
      // Only clean up if we're actually navigating away (not just re-rendering)
      setTimeout(() => {
        localStorage.removeItem('stripe_checkout_in_progress');
        localStorage.removeItem('prevent_pricing_page');
        localStorage.removeItem('skip_pricing_render');
      }, 1000);
    };
  }, []);

  // Complete checkout mutation
  const [completeCheckout] = useCompleteCheckoutMutation();

  // Query company data
  const { data: companyData, isLoading: isLoadingCompany } = useGetCompanyQuery(companyId || '', {
    skip: !companyId
  });

  const processCheckout = useCallback(async () => {
    if (!sessionId || !companyId) {
      setError('Missing session or company information.');
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const result = await completeCheckout({
        session_id: sessionId,
        company_id: companyId
      }).unwrap();
      if (result.success && result.company) {
        dispatch(setCompany(result.company));

        // Show success toast
        toast({
          title: isNewCompany ? '🎉 ¡Suscripción completada!' : '✅ Suscripción actualizada',
          description: isNewCompany
            ? 'Ahora vamos a crear tu primer establecimiento para comenzar a rastrear tu huella de carbono.'
            : 'Tu suscripción ha sido procesada exitosamente.',
          status: 'success',
          duration: isNewCompany ? 8000 : 5000,
          isClosable: true,
          position: 'top'
        });

        // Clean up bypass flags before navigation
        localStorage.removeItem('subscription_bypass_temp');
        localStorage.removeItem('redirect_from_stripe');
        localStorage.removeItem('stripe_success_redirect');

        // Small delay for new companies to show the success message
        const delay = isNewCompany ? 2000 : 0;
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, delay);
      } else {
        setError('Subscription could not be verified.');
      }
    } catch (err) {
      setError('There was an error processing your subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [
    sessionId,
    companyId,
    completeCheckout,
    dispatch,
    navigate,
    redirectPath,
    toast,
    isNewCompany
  ]);

  useEffect(() => {
    processCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Flex
      width="100%"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bg={bgColor}
    >
      <Spinner size="xl" color="green.500" thickness="4px" speed="0.65s" />
      <Text mt={4} fontSize="lg" fontWeight="medium" color={textColor}>
        {isNewCompany
          ? 'Procesando tu suscripción y configurando tu empresa...'
          : 'Processing your subscription...'}
      </Text>
      {isNewCompany && (
        <Text mt={2} fontSize="sm" color="gray.500" textAlign="center" maxW="md">
          Te redirigiremos automáticamente para crear tu primer establecimiento
        </Text>
      )}
      {error && (
        <Alert status="error" mt={4} maxW="sm">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {error && (
        <Button mt={4} colorScheme="green" onClick={processCheckout} isLoading={isProcessing}>
          Retry
        </Button>
      )}
    </Flex>
  );
};

export default StripeSuccessRedirect;
