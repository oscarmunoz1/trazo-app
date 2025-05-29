import React from 'react';
import { Box, VStack, Flex, useColorModeValue } from '@chakra-ui/react';

const FormContainer = ({
  children,
  sidebarContent,
  maxWidth = '1200px',
  spacing = { base: 8, md: 10 },
  sidebarWidth = { base: '100%', xl: '400px' },
  sidebarPosition = 'sticky',
  sidebarTop = '80px'
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box w="100%" bg={bgColor} minH="100vh" pt={6}>
      <Box maxW={maxWidth} mx="auto" p={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={spacing} align="stretch">
          {/* Main Content Area */}
          {sidebarContent ? (
            <Flex direction={{ base: 'column', xl: 'row' }} gap={10} align="start">
              {/* Main Form Content */}
              <Box flex="1" maxW={{ base: '100%', xl: '750px' }} w="100%">
                {children}
              </Box>

              {/* Sidebar Content */}
              <Box
                flex="0 0 auto"
                w={sidebarWidth}
                position={{ xl: sidebarPosition }}
                top={sidebarTop}
                alignSelf="flex-start"
              >
                {sidebarContent}
              </Box>
            </Flex>
          ) : (
            children
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default FormContainer;
