import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  Badge,
  Card,
  CardBody,
  useColorModeValue,
  useBreakpointValue,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Center,
  Spinner
} from '@chakra-ui/react';
import { FaQuestionCircle, FaSearch, FaArrowLeft, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Import education API hooks
import {
  useGetFarmerQuestionsQuery,
  useGetEducationCategoriesQuery,
  FarmerQuestionAnswer,
  EducationCategory
} from 'store/api/educationApi';

const EducationFAQ: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerMaxW = useBreakpointValue({ base: 'full', lg: '6xl' });

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  // API queries
  const {
    data: allFAQs,
    isLoading: isFAQsLoading,
    error: faqError
  } = useGetFarmerQuestionsQuery({
    category_id: selectedCategory || undefined,
    search: searchQuery || undefined
  });
  const { data: categories } = useGetEducationCategoriesQuery();

  // Show loading state
  if (isFAQsLoading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW={containerMaxW} py={{ base: 4, md: 8 }}>
          <Center py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color={textColor}>Loading FAQ database...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  // Show error state
  if (faqError) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW={containerMaxW} py={{ base: 4, md: 8 }}>
          <Alert status="error" variant="subtle" borderRadius="xl" maxW="2xl" mx="auto">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <AlertTitle>Unable to load FAQ</AlertTitle>
              <AlertDescription>
                Please check your connection and try again, or contact support if the issue
                persists.
              </AlertDescription>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW={containerMaxW} py={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Button
              leftIcon={<Icon as={FaArrowLeft} />}
              variant="ghost"
              onClick={() => navigate('/education')}
              mb={4}
            >
              Back to Education
            </Button>

            <Box textAlign="center" py={6}>
              <Icon as={FaQuestionCircle} boxSize={12} color="blue.500" mb={4} />
              <Heading size={isMobile ? 'xl' : '2xl'} mb={4} color={textColor}>
                Frequently Asked Questions
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl" mx="auto">
                Find answers to common questions about sustainable farming and Trazo
              </Text>
            </Box>
          </Box>

          {/* Search and Filter */}
          <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <InputGroup maxW={{ base: 'full', md: '500px' }} mx="auto">
                  <InputLeftElement>
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                  />
                </InputGroup>

                {/* Category Filter */}
                {categories && categories.length > 0 && (
                  <HStack spacing={2} flexWrap="wrap" justify="center">
                    <Button
                      size="sm"
                      variant={selectedCategory === null ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        size="sm"
                        variant={selectedCategory === category.id ? 'solid' : 'outline'}
                        colorScheme="blue"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* FAQ List */}
          {allFAQs && allFAQs.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {allFAQs.map((faq) => (
                <FAQCard key={faq.id} faq={faq} />
              ))}
            </VStack>
          ) : (
            <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
              <CardBody py={16} textAlign="center">
                <Icon as={FaQuestionCircle} boxSize={12} color="gray.400" mb={4} />
                <Heading size="md" color={textColor} mb={2}>
                  {searchQuery ? 'No Questions Found' : 'FAQ Database Coming Soon'}
                </Heading>
                <Text color={mutedTextColor}>
                  {searchQuery
                    ? 'Try adjusting your search terms or browse different categories'
                    : "We're building a comprehensive FAQ database to help farmers with common questions"}
                </Text>
                {searchQuery && (
                  <Button mt={4} variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                )}
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

// Component for FAQ cards
interface FAQCardProps {
  faq: FarmerQuestionAnswer;
}

const FAQCard: React.FC<FAQCardProps> = ({ faq }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
      <CardBody p={6}>
        <VStack align="stretch" spacing={4}>
          {/* Question */}
          <HStack
            justify="space-between"
            align="start"
            cursor="pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            _hover={{ opacity: 0.8 }}
          >
            <Heading size="sm" color={textColor} flex={1} pr={4}>
              {faq.question}
            </Heading>
            <Icon
              as={FaQuestionCircle}
              color="blue.500"
              transform={isExpanded ? 'rotate(180deg)' : 'none'}
              transition="transform 0.2s"
              flexShrink={0}
            />
          </HStack>

          {/* Answer - only show when expanded */}
          {isExpanded && (
            <Box pl={4} borderLeft="3px solid" borderColor="blue.200">
              <Text fontSize="sm" color={mutedTextColor} lineHeight="1.6">
                {faq.answer}
              </Text>
            </Box>
          )}

          {/* Tags and metadata */}
          <HStack justify="space-between" align="center" pt={2}>
            <HStack spacing={2} flexWrap="wrap">
              {faq.is_featured && (
                <Badge colorScheme="yellow" size="sm">
                  Featured
                </Badge>
              )}
              {faq.tags && faq.tags.length > 0 && (
                <>
                  {faq.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} size="sm" variant="subtle" colorScheme="blue">
                      <Icon as={FaTag} mr={1} /> {tag}
                    </Badge>
                  ))}
                  {faq.tags.length > 3 && (
                    <Badge size="sm" variant="subtle" colorScheme="gray">
                      +{faq.tags.length - 3} more
                    </Badge>
                  )}
                </>
              )}
            </HStack>

            {faq.view_count > 0 && (
              <Text fontSize="xs" color={mutedTextColor}>
                {faq.view_count} views
              </Text>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default EducationFAQ;
