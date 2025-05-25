import React from 'react';
import { HStack, VStack, Circle, Text, Box, useColorModeValue, Icon } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';

const FormStepper = ({
  steps,
  activeStep,
  completedSteps = [],
  showCard = true,
  showConnectors = true,
  showDescriptions = true,
  size = 'md',
  colorScheme = 'green',
  onStepClick,
  allowStepClick = false
}) => {
  const activeColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.400`);
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const bgColor = useColorModeValue('white', 'gray.800');

  const circleSize = {
    sm: '32px',
    md: '40px',
    lg: '48px'
  }[size];

  const fontSize = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  }[size];

  const stepperContent = (
    <Box w="100%" py={4}>
      <HStack spacing={4} justify="center" mb={showCard ? 0 : 8}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <VStack
              align="center"
              flex="1"
              maxW="200px"
              cursor={allowStepClick ? 'pointer' : 'default'}
              onClick={() => allowStepClick && onStepClick?.(index)}
              _hover={allowStepClick ? { opacity: 0.8 } : {}}
              transition="all 0.3s ease">
              <Circle
                size={circleSize}
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
                boxShadow={index === activeStep ? 'lg' : 'md'}
                _hover={allowStepClick ? { transform: 'scale(1.05)' } : {}}>
                {completedSteps.includes(index) || index < activeStep ? (
                  <Icon as={step.icon || FaCheckCircle} boxSize="18px" />
                ) : (
                  <Text fontSize={fontSize}>{index + 1}</Text>
                )}
              </Circle>

              <VStack spacing={1} align="center">
                <Text
                  fontSize={fontSize}
                  fontWeight={index === activeStep ? 'bold' : 'medium'}
                  color={index === activeStep ? textColor : subTextColor}
                  textAlign="center"
                  transition="all 0.3s ease">
                  {step.title}
                </Text>
                {showDescriptions && step.description && (
                  <Text
                    fontSize="xs"
                    color={subTextColor}
                    textAlign="center"
                    display={{ base: 'none', md: 'block' }}>
                    {step.description}
                  </Text>
                )}
              </VStack>
            </VStack>

            {/* Connector Line */}
            {showConnectors && index < steps.length - 1 && (
              <Box
                height="2px"
                flex="1"
                maxW="100px"
                bg={index < activeStep ? activeColor : inactiveColor}
                transition="all 0.3s ease"
                alignSelf="flex-start"
                mt={`calc(${circleSize} / 2)`}
                display={{ base: 'none', sm: 'block' }}
              />
            )}
          </React.Fragment>
        ))}
      </HStack>
    </Box>
  );

  if (showCard) {
    return (
      <Card boxShadow="xl" bg={bgColor} borderRadius="2xl">
        <CardBody py={0} px={6}>
          {stepperContent}
        </CardBody>
      </Card>
    );
  }

  return stepperContent;
};

export default FormStepper;
