import React from 'react';
import { HStack, VStack, Circle, Text, Box, useColorModeValue } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const EventFormStepper = ({ steps, activeStep, completedSteps = [] }) => {
  const activeColor = useColorModeValue('green.500', 'green.400');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box w="100%" py={4}>
      <HStack spacing={4} justify="center" mb={8}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <VStack align="center" flex="1" maxW="200px">
              <Circle
                size="40px"
                bg={
                  completedSteps.includes(index) || index < activeStep
                    ? activeColor
                    : index === activeStep
                    ? activeColor
                    : inactiveColor
                }
                color="white"
                fontWeight="bold"
                transition="all 0.3s ease"
              >
                {completedSteps.includes(index) || index < activeStep ? (
                  <FaCheckCircle />
                ) : (
                  index + 1
                )}
              </Circle>

              <VStack spacing={1} align="center">
                <Text
                  fontSize="sm"
                  fontWeight={index === activeStep ? 'bold' : 'medium'}
                  color={index === activeStep ? textColor : subTextColor}
                  textAlign="center"
                  transition="all 0.3s ease"
                >
                  {step.title}
                </Text>
                {step.description && (
                  <Text
                    fontSize="xs"
                    color={subTextColor}
                    textAlign="center"
                    display={{ base: 'none', md: 'block' }}
                  >
                    {step.description}
                  </Text>
                )}
              </VStack>
            </VStack>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <Box
                height="2px"
                flex="1"
                maxW="100px"
                bg={index < activeStep ? activeColor : inactiveColor}
                transition="all 0.3s ease"
                alignSelf="flex-start"
                mt="20px"
                display={{ base: 'none', sm: 'block' }}
              />
            )}
          </React.Fragment>
        ))}
      </HStack>
    </Box>
  );
};

export default EventFormStepper;
