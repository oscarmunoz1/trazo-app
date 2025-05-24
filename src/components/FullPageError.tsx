import React from 'react';
import { Box, Button, Flex, Heading, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

interface FullPageErrorProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

/**
 * FullPageError component displays an error message with optional retry and home buttons
 */
const FullPageError: React.FC<FullPageErrorProps> = ({
  title,
  message,
  showHomeButton = true,
  showRetryButton = false,
  onRetry
}) => {
  const navigate = useNavigate();
  const intl = useIntl();

  // Color modes
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('red.500', 'red.300');

  const handleGoHome = () => {
    navigate('/admin/dashboard');
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  // Default messages
  const defaultTitle = intl.formatMessage({ id: 'app.errorOccurred' }) || 'An error occurred';
  const defaultMessage =
    intl.formatMessage({ id: 'app.somethingWentWrong' }) ||
    'Something went wrong. Please try again later.';

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="50vh"
      p={8}
      bg={bgColor}
      borderRadius="lg"
    >
      <Icon as={FaExclamationTriangle} w={16} h={16} color="red.500" mb={6} />

      <Heading color={headingColor} mb={4} size="lg">
        {title || defaultTitle}
      </Heading>

      <Text color={textColor} textAlign="center" mb={8} maxW="md">
        {message || defaultMessage}
      </Text>

      <Flex mt={4} gap={4}>
        {showRetryButton && (
          <Button
            leftIcon={<Icon as={FaExclamationTriangle} />}
            colorScheme="blue"
            onClick={handleRetry}
          >
            {intl.formatMessage({ id: 'app.retry' }) || 'Retry'}
          </Button>
        )}

        {showHomeButton && (
          <Button
            leftIcon={<Icon as={FaHome} />}
            variant={showRetryButton ? 'outline' : 'solid'}
            colorScheme={showRetryButton ? 'gray' : 'blue'}
            onClick={handleGoHome}
          >
            {intl.formatMessage({ id: 'app.backToDashboard' }) || 'Back to Dashboard'}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default FullPageError;
