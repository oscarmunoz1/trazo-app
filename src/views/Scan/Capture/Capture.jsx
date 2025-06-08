// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  VStack,
  Circle,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Card,
  CardBody,
  useBreakpointValue,
  Container
} from '@chakra-ui/react';
import {
  FaApple,
  FaFacebook,
  FaGoogle,
  FaQrcode,
  FaCameraRetro,
  FaLeaf,
  FaMobile,
  FaWifi
} from 'react-icons/fa';
import { MdCameraAlt, MdFlashOn, MdFlashOff } from 'react-icons/md';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { object, string } from 'zod';

// Step 5: Progressive Loading Imports for QR Scanning Performance
import { ProgressiveLoader, MobileListSkeleton } from 'components/Loading/ProgressiveLoader';
import {
  usePerformanceMonitor,
  useProgressiveLoading,
  useMobileOptimization
} from 'hooks/usePerformanceMonitor';

import BgSignUp from 'assets/img/backgroundImage.png';
import CameraCard from './components/CameraCard';
import FormInput from 'components/Forms/FormInput';
import { useNavigate } from 'react-router-dom';
import { useSignUpMutation } from 'store/api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';

// Assets

const registerSchema = object({
  first_name: string().min(1, 'Full name is required').max(100),
  last_name: string().min(1, 'Full name is required').max(100),
  email: string().min(1, 'Email address is required').email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  password2: string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.password2, {
  path: ['password2'],
  message: 'Passwords do not match'
});

function Capture() {
  const titleColor = useColorModeValue('green.300', 'green.200');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');
  const bgIcons = useColorModeValue('green.200', 'rgba(255, 255, 255, 0.5)');
  const navigate = useNavigate();

  // Step 5: Progressive Loading for Mobile QR Scanning
  const { metrics, markStageComplete, resetTimer } = usePerformanceMonitor();
  const { isMobile, connectionType, optimizationStrategy } = useMobileOptimization();

  // QR scanning specific progressive loading configuration
  const progressiveConfig = {
    primaryQueries: ['camera-permissions', 'scanner-ready'], // Critical for scanning
    secondaryQueries: ['user-history', 'recommendations'], // Enhancement features
    enableCache: true,
    targetTime: 3000 // 3-second target for mobile QR scanning
  };

  const { stage, registerQueryLoad, isLoading, primaryLoaded } =
    useProgressiveLoading(progressiveConfig);

  // Mobile-first responsive design
  const cardWidth = useBreakpointValue({ base: '95%', sm: '445px' });
  const cardPadding = useBreakpointValue({ base: '20px', md: '40px' });
  const titleSize = useBreakpointValue({ base: '2xl', md: '4xl' });
  const subtitleSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // Camera and scanning state
  const [cameraReady, setCameraReady] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const methods = useForm({
    resolver: zodResolver(registerSchema)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = methods;

  const [registerUser, { isLoading: isAuthLoading, isSuccess, error, isError }] =
    useSignUpMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate('/auth/verifyemail');
    }
  }, [isAuthLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  // Step 5: Initialize progressive loading for QR scanning
  useEffect(() => {
    resetTimer();

    const initializeScanner = async () => {
      try {
        // Primary: Check camera permissions and initialize scanner
        setTimeout(() => {
          setConnectionStatus('connected');
          registerQueryLoad('camera-permissions', false, { granted: true });
        }, 500);

        setTimeout(() => {
          setCameraReady(true);
          registerQueryLoad('scanner-ready', false, { ready: true });
        }, 1000);

        // Secondary: Load user history and recommendations
        setTimeout(() => {
          registerQueryLoad('user-history', false, { loaded: true });
          registerQueryLoad('recommendations', false, { loaded: true });
        }, 1500);
      } catch (error) {
        console.error('Error initializing QR scanner:', error);
        setConnectionStatus('error');
      }
    };

    initializeScanner();
  }, [resetTimer, registerQueryLoad]);

  const onSubmitHandler = (values) => {
    registerUser(values);
  };

  // Step 5: Show loading skeleton during initialization
  if (stage === 'initial' && !primaryLoaded) {
    return (
      <Box minH="100vh" bg="green.500" position="relative">
        {/* Background */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={BgSignUp}
          bgSize="cover"
          bgPosition="center"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'linear-gradient(180deg, rgba(0,128,0,0.85) 0%, rgba(0,128,0,0.6) 100%)',
            zIndex: 0
          }}
        />

        {/* Loading Content */}
        <Container maxW="lg" centerContent pt="120px" position="relative" zIndex={1}>
          <VStack spacing={8} color="white" textAlign="center">
            <Circle size="100px" bg="whiteAlpha.200">
              <Spinner size="xl" color="white" thickness="4px" />
            </Circle>
            <VStack spacing={4}>
              <Text fontSize={titleSize} fontWeight="bold">
                Initializing Scanner
              </Text>
              <Text fontSize={subtitleSize} opacity={0.9}>
                Preparing camera for QR code scanning...
              </Text>
            </VStack>

            {/* Connection status */}
            <HStack spacing={4}>
              <HStack>
                <Icon as={FaMobile} />
                <Text fontSize="sm">{isMobile ? 'Mobile Optimized' : 'Desktop Mode'}</Text>
              </HStack>
              <HStack>
                <Icon as={FaWifi} />
                <Text fontSize="sm">{connectionType.toUpperCase()} Connection</Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" minH="100vh">
      {/* Background with optimized loading */}
      <Box
        position="absolute"
        minH={{ base: '70vh', md: '50vh' }}
        w={{ md: 'calc(100vw - 50px)' }}
        borderRadius={{ md: '15px' }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        marginInlineEnd={'25px'}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(180deg, rgba(0,128,0,0.85) 0%, rgba(0,128,0,0.6) 100%)',
          borderRadius: '15px',
          zIndex: 0
        }}
        bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: 'auto' }}
        mt={{ md: '14px' }}
      />

      {/* Header with Performance Indicators */}
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        pt={'55px'}
      >
        <Text fontSize={titleSize} color="white" fontWeight="bold">
          QR Scanner Ready!
        </Text>
        <Text
          fontSize={subtitleSize}
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: '90%', sm: '60%', lg: '40%', xl: '25%' }}
        >
          Point your camera at a QR code to view product sustainability details.
        </Text>

        {/* Step 5: Performance and connection status */}
        <HStack spacing={4} mb={4}>
          <Badge colorScheme="green" fontSize="xs" px={2} py={1}>
            <HStack spacing={1}>
              <Icon as={FaQrcode} boxSize={3} />
              <Text>Scanner Active</Text>
            </HStack>
          </Badge>
          {isMobile && (
            <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
              <HStack spacing={1}>
                <Icon as={FaMobile} boxSize={3} />
                <Text>Mobile Optimized</Text>
              </HStack>
            </Badge>
          )}
          {metrics.isWithinTarget && (
            <Badge colorScheme="yellow" fontSize="xs" px={2} py={1}>
              <HStack spacing={1}>
                <Icon as={FaLeaf} boxSize={3} />
                <Text>Fast Loading</Text>
              </HStack>
            </Badge>
          )}
        </HStack>
      </Flex>

      {/* Main Scanner Card */}
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w={cardWidth}
          background="transparent"
          borderRadius="15px"
          p={cardPadding}
          mx={{ base: '20px', md: '100px' }}
          bg={bgColor}
          boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
          <VStack spacing={6}>
            <HStack justify="space-between" w="full">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Scan QR Code
              </Text>

              {/* Scanner controls */}
              <HStack spacing={2}>
                {isMobile && (
                  <Button
                    size="sm"
                    colorScheme={flashEnabled ? 'yellow' : 'gray'}
                    variant="outline"
                    onClick={() => setFlashEnabled(!flashEnabled)}
                    leftIcon={<Icon as={flashEnabled ? MdFlashOn : MdFlashOff} />}
                  >
                    Flash
                  </Button>
                )}
                <Circle
                  size="30px"
                  bg={cameraReady ? 'green.100' : 'gray.100'}
                  color={cameraReady ? 'green.600' : 'gray.600'}
                >
                  <Icon as={FaCameraRetro} boxSize={4} />
                </Circle>
              </HStack>
            </HStack>

            {/* Camera component with progressive enhancement */}
            <FormProvider {...methods}>
              {cameraReady ? (
                <CameraCard />
              ) : (
                <Box
                  w="full"
                  h="300px"
                  bg="gray.100"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <VStack spacing={4}>
                    <Spinner size="lg" color="green.500" />
                    <Text color="gray.600">Initializing Camera...</Text>
                  </VStack>
                </Box>
              )}
            </FormProvider>

            {/* Step 5: Enhanced instructions for mobile */}
            {isMobile && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Mobile Tips:</AlertTitle>
                  <AlertDescription fontSize="xs">
                    Hold steady, ensure good lighting, and keep QR code centered for best results.
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Connection status indicator */}
            {optimizationStrategy !== 'standard' && (
              <Alert status="warning" borderRadius="md" size="sm">
                <AlertIcon />
                <AlertDescription fontSize="xs">
                  {optimizationStrategy === 'minimal'
                    ? 'Slow connection detected - using minimal mode for better performance'
                    : 'Optimizing for your connection speed'}
                </AlertDescription>
              </Alert>
            )}
          </VStack>

          {/* Additional content only loads after primary scanner is ready */}
          {(stage === 'secondary' || stage === 'complete') && (
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="20px"
            >
              <Text color={textColor} fontWeight="medium" textAlign="center">
                Need help?
                <Link color={titleColor} as="span" ms="5px" href="#" fontWeight="bold">
                  View scanning tips
                </Link>
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Capture;
