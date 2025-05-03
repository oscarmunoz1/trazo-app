import { useCallback } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useCompleteCheckoutMutation } from 'store/api/subscriptionApi';
import { useToast } from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setCompany } from 'store/features/companySlice';

interface UseSubscriptionProcessingProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useSubscriptionProcessing = ({
  onSuccess,
  onError
}: UseSubscriptionProcessingProps = {}) => {
  const { state, dispatch } = useSubscription();
  const [completeCheckout] = useCompleteCheckoutMutation();
  const toast = useToast();
  const intl = useIntl();
  const reduxDispatch = useDispatch();

  const processSubscription = useCallback(
    async (sessionId: string, companyId: string) => {
      try {
        dispatch({ type: 'START_PROCESSING', payload: { sessionId, companyId } });

        const result = await completeCheckout({
          session_id: sessionId,
          company_id: companyId
        }).unwrap();

        if (result.success) {
          if (result.company) {
            reduxDispatch(setCompany(result.company));
          }

          dispatch({ type: 'MARK_SESSION_PROCESSED' });

          toast({
            title: intl.formatMessage({ id: 'app.subscriptionSuccess' }),
            description: intl.formatMessage({ id: 'app.subscriptionSuccessDescription' }),
            status: 'success',
            duration: 5000,
            isClosable: true
          });

          onSuccess?.();
        } else {
          throw new Error(result.error || 'Unknown error occurred');
        }
      } catch (error: any) {
        const errorMessage = error?.data?.error || error?.message || 'Unknown error occurred';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });

        toast({
          title: intl.formatMessage({ id: 'app.subscriptionError' }),
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true
        });

        onError?.(error);
      }
    },
    [completeCheckout, dispatch, toast, intl, reduxDispatch, onSuccess, onError]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return {
    processSubscription,
    reset,
    isProcessing: state.isProcessing,
    error: state.error,
    isSessionProcessed: state.isSessionProcessed
  };
};
