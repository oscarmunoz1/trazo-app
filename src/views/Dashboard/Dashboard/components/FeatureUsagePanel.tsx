import React from 'react';
import {
  Box,
  Flex,
  Progress,
  Text,
  Tag,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon
} from '@chakra-ui/react';
import { FaBuilding, FaMapMarkedAlt, FaLeaf, FaQrcode, FaDatabase } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { RootState } from 'store';
import { Company, Establishment } from 'types/company';

function FeatureUsagePanel() {
  const intl = useIntl();
  const activeCompany = useSelector((state: RootState) => state.company.currentCompany) as Company;
  const subscription = activeCompany?.subscription;
  const plan = subscription?.plan;
  const features = plan?.features || {};
  const isTrial = subscription?.status === 'trialing';

  // Helper function to count total parcels across all establishments
  const countTotalParcels = (): number => {
    if (!activeCompany?.establishments) return 0;

    return activeCompany.establishments.reduce((total: number, establishment: Establishment) => {
      return total + (establishment.parcels?.length || 0);
    }, 0);
  };

  const usageMetrics = [
    {
      icon: FaBuilding,
      name: 'app.establishments',
      used: activeCompany?.establishments?.length || 0,
      limit: features.max_establishments || 0,
      colorScheme: 'blue'
    },
    {
      icon: FaMapMarkedAlt,
      name: 'app.parcels',
      used: countTotalParcels(),
      limit: features.max_parcels || 0,
      colorScheme: 'green'
    },
    {
      icon: FaLeaf,
      name: 'app.productions',
      used: subscription?.used_productions || 0,
      limit: features.max_productions_per_year || 0,
      colorScheme: 'orange'
    },
    {
      icon: FaQrcode,
      name: 'app.scans',
      used: subscription?.scan_count || 0,
      limit: features.monthly_scan_limit || 0,
      colorScheme: 'purple'
    },
    {
      icon: FaDatabase,
      name: 'app.storage',
      used: subscription?.used_storage_gb || 0,
      limit: features.storage_limit_gb || 0,
      unit: 'GB',
      colorScheme: 'cyan'
    }
  ];

  if (!subscription || !plan) {
    return null;
  }

  return (
    <Box mb={6}>
      <Flex mb={4} justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">
          {intl.formatMessage({ id: 'app.planUsage' })}
        </Text>
        {isTrial && (
          <Tag colorScheme="green" size="md">
            {intl.formatMessage({ id: 'app.trialActive' })}
          </Tag>
        )}
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {usageMetrics.map((metric) => (
          <Box
            key={metric.name}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            borderColor={isTrial ? 'green.200' : 'gray.200'}
            bg={isTrial ? 'green.50' : 'white'}
            _hover={{ boxShadow: 'sm' }}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center">
                <Icon as={metric.icon} mr={2} color={`${metric.colorScheme}.500`} />
                <Text fontWeight="medium">{intl.formatMessage({ id: metric.name })}</Text>
              </Flex>
            </Flex>

            <Stat mb={2}>
              <StatNumber fontSize="xl">
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
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default FeatureUsagePanel;
