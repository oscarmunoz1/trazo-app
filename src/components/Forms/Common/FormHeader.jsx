import React from 'react';
import { HStack, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';

const FormHeader = ({
  title,
  description,
  icon,
  actions,
  titleSize = 'xl',
  descriptionSize = 'sm'
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Card boxShadow="xl" bg={bgColor} borderRadius="2xl">
      <CardBody py={4} px={4}>
        <HStack spacing={4} align="center" justify="space-between">
          <HStack spacing={4} align="center" flex="1">
            {icon && icon}
            <VStack spacing={2} align="start" flex="1">
              <Text fontSize={titleSize} fontWeight="bold" color={textColor} lineHeight="1.2">
                {title}
              </Text>
              {description && (
                <Text fontSize={descriptionSize} color="gray.500" fontWeight="400">
                  {description}
                </Text>
              )}
            </VStack>
          </HStack>
          {actions && <HStack spacing={2}>{actions}</HStack>}
        </HStack>
      </CardBody>
    </Card>
  );
};

export default FormHeader;
