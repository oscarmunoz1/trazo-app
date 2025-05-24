import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Progress,
  Text,
  Tag,
  SimpleGrid,
  Stat,
  StatNumber,
  StatHelpText,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Button,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import {
  FaBuilding,
  FaMapMarkedAlt,
  FaLeaf,
  FaQrcode,
  FaDatabase,
  FaSync,
  FaChartBar,
  FaPlus,
  FaCreditCard
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from 'store';
import { Company } from 'types/company';
import { useGetCompanyQuery } from 'store/api/companyApi';
import { setCompany } from 'store/features/companySlice';

function PlanUsage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const activeCompany = useSelector((state: RootState) => state.company.currentCompany) as Company;
  const subscription = activeCompany?.subscription;
  const plan = subscription?.plan;
  const features = plan?.features || ({} as any);
  const isTrial = subscription?.status === 'trialing';

  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');

  // Set up company data query for refreshing
  const { refetch: refetchCompany, isLoading: isRefreshing } = useGetCompanyQuery(
    activeCompany?.id?.toString() || '',
    {
      skip: !activeCompany?.id,
      refetchOnMountOrArgChange: false
    }
  );

  // Get URL parameters and prepare for handling add-on purchase success
  const queryParams = new URLSearchParams(location.search);
  const fromAddon = queryParams.get('from_addon') === 'true';

  // Enhanced refresh function that ensures data is properly loaded
  const handleRefreshData = useCallback(async () => {
    try {
      console.log('Refreshing company data...');
      const result = await refetchCompany();

      if (result.error) {
        throw result.error;
      }

      if (result.data) {
        console.log('Refreshed company data:', result.data);

        // Update the company data in the Redux store
        dispatch(setCompany(result.data));

        toast({
          title: intl.formatMessage({ id: 'app.dataRefreshed' }),
          status: 'success',
          duration: 3000
        });
        return true;
      } else {
        console.warn('No data returned when refreshing company data');
        return false;
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: intl.formatMessage({ id: 'app.errorRefreshingData' }),
        status: 'error',
        duration: 5000
      });
      return false;
    }
  }, [refetchCompany, toast, intl, dispatch]);

  // Handle successful add-on purchase with multiple refreshes to ensure data is updated
  useEffect(() => {
    if (fromAddon) {
      console.log('Detected add-on purchase success, refreshing data');

      // Show success toast for add-on purchase
      toast({
        title: intl.formatMessage({ id: 'app.addonPurchaseSuccessful' }),
        description: intl.formatMessage({ id: 'app.addonPurchaseSuccessDescription' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // First refresh immediately
      handleRefreshData();

      // Second refresh after a delay to catch any pending webhook processing
      const refreshTimer1 = setTimeout(() => {
        console.log('Running second refresh after delay');
        handleRefreshData();
      }, 3000);

      // Third refresh after a longer delay to ensure all data is updated
      const refreshTimer2 = setTimeout(() => {
        console.log('Running final refresh after longer delay');
        handleRefreshData();
      }, 8000);

      // Remove the query parameter to prevent refreshing again on subsequent renders
      const newUrl = window.location.pathname;
      navigate(newUrl, { replace: true });

      return () => {
        clearTimeout(refreshTimer1);
        clearTimeout(refreshTimer2);
      };
    }
  }, [fromAddon, handleRefreshData, navigate, toast, intl]);

  // Log company data for debugging
  useEffect(() => {
    if (activeCompany) {
      console.log('Company data:', activeCompany);
    }
  }, [activeCompany]);

  // Helper function to count total parcels across all establishments
  const countTotalParcels = (): number => {
    if (!activeCompany?.establishments) return 0;

    return activeCompany.establishments.reduce((total, establishment) => {
      return total + (establishment.parcels?.length || 0);
    }, 0);
  };

  const usageMetrics = [
    {
      icon: FaBuilding,
      name: 'app.establishments',
      used: activeCompany?.establishments?.length || 0,
      limit: features?.max_establishments || 0,
      colorScheme: 'blue'
    },
    {
      icon: FaMapMarkedAlt,
      name: 'app.parcels',
      used: countTotalParcels(),
      limit: features?.max_parcels || 0,
      colorScheme: 'green'
    },
    {
      icon: FaLeaf,
      name: 'app.productions',
      used: subscription?.used_productions || 0,
      limit: features?.max_productions_per_year || 0,
      colorScheme: 'orange'
    },
    {
      icon: FaQrcode,
      name: 'app.scans',
      used: subscription?.scan_count || 0,
      limit: features?.monthly_scan_limit || 0,
      colorScheme: 'purple'
    },
    {
      icon: FaDatabase,
      name: 'app.storage',
      used: subscription?.used_storage_gb || 0,
      limit: features?.storage_limit_gb || 0,
      unit: 'GB',
      colorScheme: 'cyan'
    }
  ];

  // Handle plan management - redirect to billing page
  const handleManagePlan = () => {
    navigate('/admin/dashboard/account/billing');
  };

  if (!subscription || !plan) {
    return (
      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <Card mb={4}>
          <CardBody>
            <Text color={textColor}>
              {intl.formatMessage({ id: 'app.errorFetchingBillingData' })}
            </Text>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
      {/* Trial Management Banner */}
      {isTrial ? (
        <Box
          mb={6}
          p={4}
          bg="white"
          borderRadius="lg"
          borderLeftWidth="4px"
          borderLeftColor="green.500"
          boxShadow="md"
        >
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
            <Box mb={{ base: 3, md: 0 }}>
              <Text fontSize="lg" fontWeight="bold" color="green.700">
                {intl.formatMessage({ id: 'app.trialActive' })}
              </Text>
              <Text fontSize="md" color="gray.700">
                {intl.formatMessage(
                  { id: 'app.trialEndsOn' },
                  {
                    date: subscription?.trial_end
                      ? new Date(subscription.trial_end).toLocaleDateString()
                      : ''
                  }
                )}
              </Text>
            </Box>
            <Button
              colorScheme="green"
              size="md"
              onClick={handleManagePlan}
              rightIcon={<Icon as={FaChartBar} />}
            >
              {intl.formatMessage({ id: 'app.manageTrial' })}
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box mb={6} p={4} bg="blue.50" borderRadius="lg" borderWidth="1px" borderColor="blue.200">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
            <Box mb={{ base: 3, md: 0 }}>
              <Text fontSize="lg" fontWeight="bold" color="blue.700">
                {plan.name} {intl.formatMessage({ id: `app.${plan.interval}` })}{' '}
                {intl.formatMessage({ id: 'app.plan' })}
              </Text>
              <Text fontSize="md" color="blue.700">
                {intl.formatMessage({ id: 'app.nextBillingDate' })}{' '}
                {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </Box>
            <Button
              colorScheme="blue"
              size="md"
              onClick={handleManagePlan}
              rightIcon={<Icon as={FaCreditCard} />}
            >
              {intl.formatMessage({ id: 'app.manageBilling' })}
            </Button>
          </Flex>
        </Box>
      )}

      {/* Subscription Header */}
      <Card mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                {intl.formatMessage({ id: 'app.planUsage' })}
              </Text>
              <Text color="gray.500">
                {plan.name} {intl.formatMessage({ id: `app.${plan.interval}` })}{' '}
                {intl.formatMessage({ id: 'app.plan' })}
              </Text>
            </Box>
            <Flex gap={3}>
              <Button
                size="md"
                colorScheme="blue"
                leftIcon={<FaSync />}
                isLoading={isRefreshing}
                onClick={handleRefreshData}
              >
                {intl.formatMessage({ id: 'app.refresh' })}
              </Button>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          {/* Remove duplicate trial info section since we already have the banner at the top */}
        </CardBody>
      </Card>

      {/* Usage Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {usageMetrics.map((metric) => (
          <Card
            key={metric.name}
            borderColor={isTrial ? 'green.200' : 'gray.200'}
            bg={cardBg}
            _hover={{ boxShadow: 'md' }}
          >
            <CardHeader>
              <Flex align="center">
                <Icon as={metric.icon} mr={3} boxSize={6} color={`${metric.colorScheme}.500`} />
                <Text fontWeight="medium" fontSize="lg">
                  {intl.formatMessage({ id: metric.name })}
                </Text>
              </Flex>
            </CardHeader>
            <CardBody pt={0}>
              <Stat mb={3}>
                <StatNumber fontSize="2xl">
                  {metric.used}{' '}
                  <Text as="span" fontSize="md" color="gray.500">
                    / {metric.limit} {metric.unit}
                  </Text>
                </StatNumber>
                <StatHelpText mb={0}>
                  {Math.round((metric.used / Math.max(metric.limit, 1)) * 100)}%{' '}
                  {intl.formatMessage({ id: 'app.used' })}
                </StatHelpText>
              </Stat>

              <Progress
                value={(metric.used / Math.max(metric.limit, 1)) * 100}
                size="sm"
                colorScheme={isTrial ? 'green' : metric.colorScheme}
                borderRadius="full"
              />

              {isTrial && (
                <Text fontSize="xs" color="gray.600" mt={2}>
                  {intl.formatMessage({ id: 'app.usageDuringTrial' })}
                </Text>
              )}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Quick Actions */}
      <Card mt={6} mb={6}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            {intl.formatMessage({ id: 'app.quickActions' })}
          </Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FaChartBar} />}
              onClick={handleManagePlan}
              size="lg"
              height="100px"
              p={6}
              justifyContent="flex-start"
              alignItems="flex-start"
              flexDirection="column"
            >
              <Text fontWeight="bold" mb={1} textAlign="left">
                {intl.formatMessage({ id: 'app.upgradePlan' })}
              </Text>
              <Text fontSize="sm" fontWeight="normal" textAlign="left">
                {intl.formatMessage({ id: 'app.upgradeToGetMore' })}
              </Text>
            </Button>

            <Button
              colorScheme="green"
              leftIcon={<Icon as={FaPlus} />}
              onClick={handleManagePlan}
              size="lg"
              height="100px"
              p={6}
              justifyContent="flex-start"
              alignItems="flex-start"
              flexDirection="column"
            >
              <Text fontWeight="bold" mb={1} textAlign="left">
                {intl.formatMessage({ id: 'app.addons' })}
              </Text>
              <Text fontSize="sm" fontWeight="normal" textAlign="left">
                {intl.formatMessage({ id: 'app.purchaseAddons' })}
              </Text>
            </Button>

            <Button
              colorScheme="purple"
              leftIcon={<Icon as={FaCreditCard} />}
              onClick={handleManagePlan}
              size="lg"
              height="100px"
              p={6}
              justifyContent="flex-start"
              alignItems="flex-start"
              flexDirection="column"
            >
              <Text fontWeight="bold" mb={1} textAlign="left">
                {intl.formatMessage({ id: 'app.billingManagement' })}
              </Text>
              <Text fontSize="sm" fontWeight="normal" textAlign="left">
                {intl.formatMessage({ id: 'app.managePaymentMethods' })}
              </Text>
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Subscription Details */}
      <Card mt={6}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            {intl.formatMessage({ id: 'app.subscription' })}{' '}
            {intl.formatMessage({ id: 'app.details' })}
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontWeight="medium" mb={1}>
                {intl.formatMessage({ id: 'app.plan' })}
              </Text>
              <Text>{plan.name}</Text>
            </Box>
            <Box>
              <Text fontWeight="medium" mb={1}>
                {intl.formatMessage({ id: 'app.status' })}
              </Text>
              <Text textTransform="capitalize">{subscription.status}</Text>
            </Box>
            <Box>
              <Text fontWeight="medium" mb={1}>
                {intl.formatMessage({ id: 'app.price' })}
              </Text>
              <Text>
                ${plan.price} / {intl.formatMessage({ id: `app.${plan.interval}` })}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="medium" mb={1}>
                {isTrial
                  ? intl.formatMessage({ id: 'app.trialEndsOn' })
                  : intl.formatMessage({ id: 'app.nextBillingDate' })}
              </Text>
              <Text>
                {subscription
                  ? isTrial && subscription.trial_end
                    ? new Date(subscription.trial_end).toLocaleDateString()
                    : subscription.current_period_end
                    ? new Date(subscription.current_period_end).toLocaleDateString()
                    : 'N/A'
                  : 'N/A'}
              </Text>
            </Box>
          </SimpleGrid>

          <Flex justify="flex-end" mt={6}>
            <Button colorScheme="blue" onClick={handleManagePlan}>
              {intl.formatMessage({ id: 'app.manageBilling' })}
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default PlanUsage;
