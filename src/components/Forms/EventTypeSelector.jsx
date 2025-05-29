import React from 'react';
import {
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  Icon,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

const EventTypeSelector = ({
  eventTypes,
  selectedEventType,
  onEventTypeSelect,
  columns = { base: 1, md: 2, lg: 4 }
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const descriptionColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <SimpleGrid columns={columns} spacing={4} w="100%">
      {eventTypes.map((eventType) => (
        <Card
          key={eventType.id}
          cursor="pointer"
          onClick={() => onEventTypeSelect(eventType.id)}
          border={selectedEventType === eventType.id ? '2px solid' : '1px solid'}
          borderColor={selectedEventType === eventType.id ? `${eventType.color}.500` : borderColor}
          bg={selectedEventType === eventType.id ? `${eventType.color}.50` : bgColor}
          transition="all 0.3s ease"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
            borderColor: `${eventType.color}.300`
          }}
          h={{ base: '120px', md: '140px' }}
        >
          <CardBody display="flex" alignItems="center" justifyContent="center" p={4}>
            <VStack spacing={3} align="center" textAlign="center">
              <Icon
                as={eventType.icon}
                boxSize={{ base: 6, md: 8 }}
                color={
                  selectedEventType === eventType.id
                    ? `${eventType.color}.600`
                    : `${eventType.color}.500`
                }
                transition="all 0.3s ease"
              />

              <VStack spacing={1} align="center">
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="1.2"
                >
                  {eventType.label}
                </Text>

                <Text
                  fontSize="xs"
                  color={descriptionColor}
                  lineHeight="1.3"
                  noOfLines={2}
                  whiteSpace="normal"
                  textAlign="center"
                >
                  {eventType.description}
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default EventTypeSelector;
