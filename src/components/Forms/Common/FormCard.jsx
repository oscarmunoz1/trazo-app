import React from 'react';
import { Text, useColorModeValue, HStack, VStack } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const FormCard = ({
  title,
  subtitle,
  icon,
  children,
  actions,
  headerActions,
  showHeader = true,
  showBorder = true,
  spacing = 6,
  titleSize = 'lg',
  ...cardProps
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card
      boxShadow="lg"
      bg={bgColor}
      borderRadius="xl"
      border={showBorder ? '1px solid' : 'none'}
      borderColor={borderColor}
      {...cardProps}>
      {showHeader && (title || headerActions) && (
        <CardHeader pb={2}>
          <HStack justify="space-between" align="center" w="100%">
            <HStack spacing={3} align="center">
              {icon && icon}
              <VStack spacing={1} align="start">
                {title && (
                  <Text
                    fontSize={titleSize}
                    fontWeight="semibold"
                    color={textColor}
                    lineHeight="1.2">
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text fontSize="sm" color="gray.500" lineHeight="1.2">
                    {subtitle}
                  </Text>
                )}
              </VStack>
            </HStack>
            {headerActions && <HStack spacing={2}>{headerActions}</HStack>}
          </HStack>
        </CardHeader>
      )}

      <CardBody pt={showHeader ? 4 : 6} pb={6} px={{ base: 4, md: 6 }}>
        <VStack spacing={spacing} align="stretch" w="100%">
          {children}

          {actions && (
            <HStack
              justify="space-between"
              pt={6}
              mt={4}
              borderTop="1px"
              borderColor={borderColor}
              w="100%">
              {actions}
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default FormCard;
