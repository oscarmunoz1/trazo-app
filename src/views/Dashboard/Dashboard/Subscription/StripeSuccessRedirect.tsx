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
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

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
        navigate(redirectPath, { replace: true });
      } else {
        setError('Subscription could not be verified.');
      }
    } catch (err) {
      setError('There was an error processing your subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, companyId, completeCheckout, dispatch, navigate, redirectPath]);

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
      bg={bgColor}>
      <Spinner size="xl" color="green.500" thickness="4px" speed="0.65s" />
      <Text mt={4} fontSize="lg" fontWeight="medium" color={textColor}>
        Processing your subscription...
      </Text>
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
