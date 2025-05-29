import React from 'react';
import { VStack, Text, HStack, Badge, useColorModeValue } from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const CarbonOptimizationTips = ({
  activeEventType,
  carbonCalculation,
  showEfficiencyScore = true,
  title
}) => {
  const intl = useIntl();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');

  // Event-specific tips
  const getTipsForEventType = (eventType) => {
    switch (eventType) {
      case 0: // Weather
        return [
          intl.formatMessage({ id: 'app.monitorWeatherConditions' }) ||
            'Monitor weather conditions for optimal timing',
          intl.formatMessage({ id: 'app.useWeatherData' }) ||
            'Use weather data for better planning',
          intl.formatMessage({ id: 'app.implementProtectiveMeasures' }) ||
            'Implement protective measures to reduce impact'
        ];

      case 1: // Production
        return [
          intl.formatMessage({ id: 'app.trackFuelConsumption' }) ||
            'Track fuel consumption for equipment use',
          intl.formatMessage({ id: 'app.optimizeRoutePlanning' }) ||
            'Optimize route planning to reduce emissions',
          intl.formatMessage({ id: 'app.combineOperationsWhenPossible' }) ||
            'Combine operations when possible'
        ];

      case 2: // Chemical
        return [
          intl.formatMessage({ id: 'app.usePreciseNPKValues' }) ||
            'Use precise NPK values for accurate calculations',
          intl.formatMessage({ id: 'app.considerDripIrrigation' }) ||
            'Consider drip irrigation for higher efficiency',
          intl.formatMessage({ id: 'app.applyDuringOptimalWeather' }) ||
            'Apply during optimal weather conditions'
        ];

      case 3: // General
        return [
          intl.formatMessage({ id: 'app.documentObservations' }) ||
            'Document observations for future reference',
          intl.formatMessage({ id: 'app.maintainDetailedRecords' }) ||
            'Maintain detailed records for analysis',
          intl.formatMessage({ id: 'app.considerSustainablePractices' }) ||
            'Consider sustainable practices'
        ];

      case 4: // Equipment
        return [
          'Regular maintenance reduces fuel consumption and emissions',
          'Track equipment hours and fuel usage for accurate calculations',
          'Consider upgrading to more efficient equipment when possible'
        ];

      case 5: // Soil Management
        return [
          'Soil testing helps optimize amendment applications',
          'Organic matter additions improve carbon sequestration',
          'Proper soil management can turn farms into carbon sinks'
        ];

      case 6: // Business
        return [
          'Certifications can increase product value and marketability',
          'Track revenue and compliance for business optimization',
          'Consider sustainable business practices for long-term growth'
        ];

      case 7: // Pest Management
        return [
          'IPM practices reduce chemical inputs and environmental impact',
          'Beneficial species releases support ecosystem balance',
          'Monitor pest pressure to optimize intervention timing'
        ];

      default:
        return [
          'Document all farming activities for better analysis',
          'Consider the environmental impact of each operation',
          'Look for opportunities to improve sustainability'
        ];
    }
  };

  const tips = getTipsForEventType(activeEventType);

  return (
    <Card mt={6} boxShadow="lg" bg={bgColor} borderRadius="xl">
      <CardHeader pb={2}>
        <HStack spacing={2} justify="space-between" w="100%">
          <HStack spacing={2}>
            <Text fontSize="lg">💡</Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              {title ||
                intl.formatMessage({ id: 'app.carbonOptimizationTips' }) ||
                'Optimization Suggestions'}
            </Text>
          </HStack>

          {showEfficiencyScore && carbonCalculation?.efficiency_score && (
            <Badge
              colorScheme={
                carbonCalculation.efficiency_score >= 70
                  ? 'green'
                  : carbonCalculation.efficiency_score >= 50
                  ? 'yellow'
                  : 'red'
              }
              fontSize="xs"
              borderRadius="full"
            >
              {carbonCalculation.efficiency_score}/100
            </Badge>
          )}
        </HStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={2} align="stretch">
          {tips.map((tip, index) => (
            <Text key={index} fontSize="xs" color="gray.600">
              • {tip}
            </Text>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default CarbonOptimizationTips;
