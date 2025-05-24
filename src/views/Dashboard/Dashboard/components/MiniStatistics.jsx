// Chakra imports
import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';
import IconBox from 'components/Icons/IconBox';
import React from 'react';

const MiniStatistics = ({ title, amount, percentage, icon, isSelected }) => {
  const iconGreen = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');
  let cardColor = useColorModeValue('white', 'gray.700');

  if (isSelected) {
    cardColor = 'green.400';
  }

  return (
    <Card minH="83px" bg={cardColor}>
      <CardBody>
        <Flex flexDirection="row" align="center" justify="center" w="100%">
          <Stat me="auto">
            <StatLabel
              fontSize="sm"
              color={isSelected ? 'gray.100' : 'gray.400'}
              fontWeight="bold"
              pb=".1rem"
            >
              {amount}
            </StatLabel>
            <Flex maxW={{ md: '100%', lg: '80%' }} overflow="hidden">
              <StatNumber
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                fontSize="lg"
                color={isSelected ? 'white' : textColor}
              >
                {title}
              </StatNumber>
            </Flex>
          </Stat>
          <IconBox as="box" h={'45px'} w={'45px'} bg={iconGreen}>
            {icon}
          </IconBox>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default MiniStatistics;
