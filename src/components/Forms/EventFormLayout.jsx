import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  GridItem,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

const EventFormLayout = ({ title, subtitle, children, sidebarContent, maxWidth = '1200px' }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Box w="100%" py={6}>
      {/* Header Card */}
      <Card maxW={maxWidth} mx="auto" mb={6} bg={bgColor}>
        <CardHeader pb={2}>
          <Text fontSize="xl" fontWeight="bold" color={textColor} textAlign="center">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="gray.500" textAlign="center" mt={1}>
              {subtitle}
            </Text>
          )}
        </CardHeader>
      </Card>

      {/* Main Content Layout */}
      <Box maxW={maxWidth} mx="auto">
        <SimpleGrid columns={{ base: 1, xl: 12 }} spacing={6}>
          {/* Main Form Content */}
          <GridItem colSpan={{ base: 1, xl: 8 }}>{children}</GridItem>

          {/* Sidebar Content */}
          {sidebarContent && <GridItem colSpan={{ base: 1, xl: 4 }}>{sidebarContent}</GridItem>}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default EventFormLayout;
