// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';
import { HSeparator } from 'components/Separator/Separator';
import IconBox from 'components/Icons/IconBox';
import React from 'react';

const PaymentStatistics = ({ icon, title, description, amount }) => {
  const iconTeal = useColorModeValue('green.400', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Card p="16px" display="flex" align="center" justify="center">
      <CardBody>
        <Flex direction="column" align="center" w="100%" py="14px">
          <IconBox as="box" h={'60px'} w={'60px'} bg={iconTeal}>
            {icon}
          </IconBox>
          <Flex
            direction="column"
            m="14px"
            justify="center"
            textAlign="center"
            align="center"
            w="100%"
          >
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {title}
            </Text>
            <Text mb="24px" fontSize="xs" color="gray.400" fontWeight="semibold">
              {description}
            </Text>
            <HSeparator />
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="bold">
            {`%${amount}`}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PaymentStatistics;
