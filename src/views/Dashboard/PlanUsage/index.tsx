import React from 'react';
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
  useColorModeValue
} from '@chakra-ui/react';
import { FaBuilding, FaMapMarkedAlt, FaLeaf, FaQrcode, FaDatabase } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store';
import { Company, Subscription, Plan } from 'types/company';

function PlanUsage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const activeCompany = useSelector((state: RootState) => state.company.currentCompany) as Company;
  const subscription = activeCompany?.subscription;
  const plan = subscription?.plan;
  const features = plan?.features || ({} as any);
  const isTrial = subscription?.status === 'trialing';

  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');

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
      used: activeCompany?.parcels?.length || 0,
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
            {isTrial && (
              <Tag colorScheme="green" size="lg">
                {intl.formatMessage({ id: 'app.trialActive' })}
              </Tag>
            )}
          </Flex>
        </CardHeader>
        <CardBody pt={0}>
          {isTrial && (
            <Box
              p={4}
              bg="green.50"
              borderRadius="md"
              mb={4}
              borderLeft="4px solid"
              borderColor="green.500">
              <Flex align="center" justify="space-between">
                <Box>
                  <Text color="green.700">
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
                  size="sm"
                  onClick={() => navigate('/admin/account/billing')}>
                  {intl.formatMessage({ id: 'app.manageTrial' })}
                </Button>
              </Flex>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Usage Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {usageMetrics.map((metric) => (
          <Card
            key={metric.name}
            borderColor={isTrial ? 'green.200' : 'gray.200'}
            bg={cardBg}
            _hover={{ boxShadow: 'md' }}>
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
            <Button colorScheme="blue" onClick={() => navigate('/admin/account/billing')}>
              {intl.formatMessage({ id: 'app.manageBilling' })}
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default PlanUsage;
