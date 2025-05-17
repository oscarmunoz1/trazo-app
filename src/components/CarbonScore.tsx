import React from 'react';
import { Box, Text, Flex, Tooltip } from '@chakra-ui/react';

interface CarbonScoreProps {
  score: number;
  footprint?: number; // in kg CO2e
  showFootprint?: boolean;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'green.500';
  if (score >= 50) return 'yellow.500';
  return 'red.500';
};

const getFootprintComparison = (footprint: number): string => {
  // 1 kg CO2e is roughly equivalent to driving 2.5 miles in an average car
  const miles = (footprint * 2.5).toFixed(1);
  return `like driving ${miles} miles`;
};

export const CarbonScore: React.FC<CarbonScoreProps> = ({
  score,
  footprint,
  showFootprint = true
}) => {
  const scoreColor = getScoreColor(score);
  const footprintText = footprint ? getFootprintComparison(footprint) : '';

  return (
    <Box>
      <Flex direction="column" align="center" gap={2}>
        <Tooltip label="Carbon Score: Higher is better">
          <Box
            w="120px"
            h="120px"
            borderRadius="full"
            bg={scoreColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative">
            <Text fontSize="3xl" fontWeight="bold" color="white">
              {score}
            </Text>
            <Text fontSize="sm" color="white" position="absolute" bottom="25%">
              /100
            </Text>
          </Box>
        </Tooltip>

        {showFootprint && footprint && (
          <Text fontSize="sm" color="gray.600">
            {footprint.toFixed(1)} kg CO2e, {footprintText}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
