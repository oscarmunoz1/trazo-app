import {
  Button,
  Flex,
  Link,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Box
} from '@chakra-ui/react';

import { QuestionIcon } from '@chakra-ui/icons';
import { FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import { useIntl } from 'react-intl';

const SidebarHelp = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const intl = useIntl();

  // Theme colors following app standards
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const subtextColor = useColorModeValue('gray.500', 'gray.400');
  const iconBg = useColorModeValue('green.50', 'green.900');
  const iconColor = useColorModeValue('green.500', 'green.400');

  const isExpanded = sidebarWidth === 275 || !sidebarWidth;

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="lg"
      p={isExpanded ? 4 : 3}
      w={isExpanded ? '100%' : '77%'}
      transition="all 0.2s ease"
      _hover={{
        boxShadow: 'xl',
        transform: 'translateY(-1px)'
      }}
    >
      <VStack spacing={3} align="stretch">
        {/* Icon and Title */}
        <HStack spacing={3} align="center">
          <Flex
            w="40px"
            h="40px"
            bg={iconBg}
            borderRadius="lg"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Icon as={QuestionIcon} color={iconColor} w="20px" h="20px" />
          </Flex>

          {isExpanded && (
            <VStack spacing={1} align="start" flex="1">
              <Text fontSize="sm" color={textColor} fontWeight="bold" lineHeight="1.2">
                {intl.formatMessage({ id: 'app.needHelp' })}
              </Text>
              <Text fontSize="xs" color={subtextColor} lineHeight="1.2">
                {intl.formatMessage({ id: 'app.checkOutDocs' })}
              </Text>
            </VStack>
          )}
        </HStack>

        {/* Documentation Button */}
        {isExpanded && (
          <Link href="" w="100%" _hover={{ textDecoration: 'none' }}>
            <Button
              size="sm"
              colorScheme="green"
              variant="solid"
              w="100%"
              leftIcon={<Icon as={FaBook} w="14px" h="14px" />}
              rightIcon={<Icon as={FaExternalLinkAlt} w="12px" h="12px" />}
              fontSize="xs"
              fontWeight="semibold"
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: 'md'
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: 'sm'
              }}
              transition="all 0.2s ease"
            >
              {intl.formatMessage({ id: 'app.documentation' })}
            </Button>
          </Link>
        )}
      </VStack>
    </Box>
  );
};

export default SidebarHelp;
