import React, { useState, useMemo } from 'react';
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
  Progress,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  useBreakpointValue,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast
} from '@chakra-ui/react';
import {
  FaGraduationCap,
  FaBookOpen,
  FaCertificate,
  FaSearch,
  FaPlay,
  FaClock,
  FaStar,
  FaBookmark,
  FaQuestionCircle,
  FaTractor,
  FaLeaf,
  FaChartLine,
  FaTools,
  FaCloudSun,
  FaHandsHelping,
  FaLightbulb,
  FaAward
} from 'react-icons/fa';
import { MdDashboard, MdSchool, MdHelp } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

// Import education API hooks
import {
  useGetEducationDashboardQuery,
  useGetEducationCategoriesQuery,
  useGetEducationCoursesQuery,
  useGetFarmerQuestionsQuery,
  useGetUserBookmarksQuery,
  EducationCategory,
  EducationCourse,
  FarmerQuestionAnswer
} from 'store/api/educationApi';

// Import subscription hook to check access
import { useGetCompanyQuery } from 'store/api/companyApi';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const EducationDashboard: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();

  // Get current user and company
  const user = useSelector((state: RootState) => state.user.user);
  const activeCompany = useSelector((state: RootState) => state.company.company);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const containerMaxW = useBreakpointValue({ base: 'full', lg: '7xl' });

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  // API queries
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetEducationDashboardQuery();
  const { data: categories, isLoading: isCategoriesLoading } = useGetEducationCategoriesQuery();
  const { data: courses, isLoading: isCoursesLoading } = useGetEducationCoursesQuery({
    category_id: selectedCategory || undefined
  });
  const { data: featuredFAQs, isLoading: isFAQsLoading } = useGetFarmerQuestionsQuery({
    featured: true
  });
  const { data: bookmarks } = useGetUserBookmarksQuery();
  const { data: companyData } = useGetCompanyQuery(activeCompany?.id || '');

  // Check subscription access
  const subscriptionPlan = companyData?.subscription?.plan?.name?.toLowerCase();
  const hasEducationAccess = subscriptionPlan === 'standard' || subscriptionPlan === 'corporate';

  // Filter courses based on search
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [courses, searchQuery]);

  // Category icons mapping
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('carbon') || name.includes('sustainability')) return FaLeaf;
    if (name.includes('iot') || name.includes('technology')) return FaTools;
    if (name.includes('weather') || name.includes('climate')) return FaCloudSun;
    if (name.includes('farming') || name.includes('agriculture')) return FaTractor;
    if (name.includes('business') || name.includes('market')) return FaChartLine;
    if (name.includes('compliance') || name.includes('certification')) return FaCertificate;
    if (name.includes('pest') || name.includes('soil')) return FaHandsHelping;
    return FaBookOpen;
  };

  // Handle subscription requirement
  const handleSubscriptionRequired = () => {
    toast({
      title: 'Subscription Required',
      description:
        'Educational resources are available for Standard and Corporate plan subscribers. Please upgrade your plan to access this content.',
      status: 'warning',
      duration: 5000,
      isClosable: true
    });
    navigate('/subscription');
  };

  // Show subscription barrier for Basic plan users
  if (!hasEducationAccess) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW={containerMaxW} py={{ base: 4, md: 8 }}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box textAlign="center" py={8}>
              <Icon as={FaGraduationCap} boxSize={16} color="blue.500" mb={4} />
              <Heading size="2xl" mb={4} color={textColor}>
                Educational Resources
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl" mx="auto">
                Expand your knowledge with our comprehensive agricultural education platform
              </Text>
            </Box>

            {/* Subscription Required Alert */}
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              maxW="2xl"
              mx="auto"
              borderRadius="xl"
              py={8}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={2} fontSize="lg">
                Educational Resources Available with Standard & Corporate Plans
              </AlertTitle>
              <AlertDescription maxWidth="lg" mb={6}>
                Access our comprehensive library of agricultural courses, tutorials, and expert
                guidance. Learn about sustainable farming practices, carbon management, IoT
                technology, and more.
              </AlertDescription>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSubscriptionRequired}
                leftIcon={<Icon as={FaGraduationCap} />}
              >
                Upgrade to Access Education
              </Button>
            </Alert>

            {/* Preview of what's available */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} maxW="4xl" mx="auto">
              {[
                {
                  title: 'Carbon Management',
                  description: "Learn to track and reduce your farm's carbon footprint",
                  icon: FaLeaf,
                  color: 'green'
                },
                {
                  title: 'IoT Technology',
                  description: 'Understand how smart sensors can optimize your operations',
                  icon: FaTools,
                  color: 'blue'
                },
                {
                  title: 'Sustainable Practices',
                  description: 'Discover eco-friendly farming techniques',
                  icon: FaTractor,
                  color: 'orange'
                }
              ].map((item, index) => (
                <Card key={index} bg={cardBgColor} borderRadius="xl" boxShadow="sm" opacity={0.7}>
                  <CardBody p={6} textAlign="center">
                    <Icon as={item.icon} boxSize={10} color={`${item.color}.500`} mb={4} />
                    <Heading size="md" mb={2} color={textColor}>
                      {item.title}
                    </Heading>
                    <Text fontSize="sm" color={mutedTextColor}>
                      {item.description}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW={containerMaxW} py={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" py={6}>
            <Icon as={FaGraduationCap} boxSize={12} color="blue.500" mb={4} />
            <Heading size={isMobile ? 'xl' : '2xl'} mb={4} color={textColor}>
              Educational Resources
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl" mx="auto">
              Expand your knowledge with expert-curated agricultural education
            </Text>
          </Box>

          {/* Dashboard Stats */}
          {isDashboardLoading ? (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {[...Array(4)].map((_, i) => (
                <Card key={i} bg={cardBgColor}>
                  <CardBody p={cardPadding}>
                    <Skeleton height="60px" />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : dashboardData ? (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                <CardBody p={cardPadding} textAlign="center">
                  <Icon as={FaBookOpen} boxSize={8} color="blue.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {dashboardData.total_courses}
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Available Courses
                  </Text>
                </CardBody>
              </Card>

              <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                <CardBody p={cardPadding} textAlign="center">
                  <Icon as={FaAward} boxSize={8} color="green.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {dashboardData.completed_courses}
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Completed
                  </Text>
                </CardBody>
              </Card>

              <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                <CardBody p={cardPadding} textAlign="center">
                  <Icon as={FaCertificate} boxSize={8} color="yellow.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {dashboardData.total_certificates}
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Certificates
                  </Text>
                </CardBody>
              </Card>

              <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                <CardBody p={cardPadding} textAlign="center">
                  <Icon as={FaClock} boxSize={8} color="purple.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {Math.round(dashboardData.total_time_spent_minutes / 60)}h
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Time Spent
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          ) : null}

          {/* Main Content Tabs */}
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab leftIcon={<Icon as={MdDashboard} />}>Overview</Tab>
              <Tab leftIcon={<Icon as={MdSchool} />}>Courses</Tab>
              <Tab leftIcon={<Icon as={MdHelp} />}>FAQ</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel px={0}>
                <VStack spacing={8} align="stretch">
                  {/* Recent/Recommended Courses */}
                  {dashboardData?.recent_courses?.length ? (
                    <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                      <CardHeader>
                        <Heading size="md" color={textColor}>
                          Continue Learning
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {dashboardData.recent_courses.slice(0, 4).map((course) => (
                            <CourseCard
                              key={course.id}
                              course={course}
                              onSelect={() => navigate(`/education/courses/${course.id}`)}
                              showProgress={true}
                            />
                          ))}
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  ) : null}

                  {/* Categories Grid */}
                  {isCategoriesLoading ? (
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                      {[...Array(8)].map((_, i) => (
                        <Card key={i} bg={cardBgColor}>
                          <CardBody p={cardPadding}>
                            <Skeleton height="100px" />
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                      <CardHeader>
                        <Heading size="md" color={textColor}>
                          Learning Categories
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                          {categories?.map((category) => (
                            <CategoryCard
                              key={category.id}
                              category={category}
                              onSelect={() => {
                                setSelectedCategory(category.id);
                                // Switch to courses tab
                                document.querySelector('[role="tab"]:nth-child(2)')?.click();
                              }}
                            />
                          ))}
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>

              {/* Courses Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  {/* Search and Filters */}
                  <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                    <CardBody>
                      <HStack spacing={4} flexWrap="wrap">
                        <InputGroup maxW={{ base: 'full', md: '400px' }}>
                          <InputLeftElement>
                            <Icon as={FaSearch} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </InputGroup>

                        {selectedCategory && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCategory(null)}
                          >
                            Clear Filter
                          </Button>
                        )}
                      </HStack>
                    </CardBody>
                  </Card>

                  {/* Courses Grid */}
                  {isCoursesLoading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} bg={cardBgColor}>
                          <CardBody>
                            <SkeletonText noOfLines={4} spacing="4" />
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : filteredCourses.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onSelect={() => navigate(`/education/courses/${course.id}`)}
                          showProgress={true}
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                      <CardBody py={16} textAlign="center">
                        <Icon as={FaBookOpen} boxSize={12} color="gray.400" mb={4} />
                        <Heading size="md" color={textColor} mb={2}>
                          No Courses Found
                        </Heading>
                        <Text color={mutedTextColor}>
                          {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'No courses available in this category yet'}
                        </Text>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>

              {/* FAQ Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  {isFAQsLoading ? (
                    <VStack spacing={4}>
                      {[...Array(5)].map((_, i) => (
                        <Card key={i} bg={cardBgColor} w="full">
                          <CardBody>
                            <SkeletonText noOfLines={3} spacing="4" />
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  ) : featuredFAQs?.length ? (
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color={textColor} mb={2}>
                        Frequently Asked Questions
                      </Heading>
                      {featuredFAQs.map((faq) => (
                        <FAQCard key={faq.id} faq={faq} />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => navigate('/education/faq')}
                      >
                        View All Questions
                      </Button>
                    </VStack>
                  ) : (
                    <Card bg={cardBgColor} borderRadius="xl" boxShadow="sm">
                      <CardBody py={16} textAlign="center">
                        <Icon as={FaQuestionCircle} boxSize={12} color="gray.400" mb={4} />
                        <Heading size="md" color={textColor} mb={2}>
                          No FAQs Available
                        </Heading>
                        <Text color={mutedTextColor}>
                          We're working on building our FAQ database
                        </Text>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

// Component for category cards
interface CategoryCardProps {
  category: EducationCategory;
  onSelect: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('carbon') || name.includes('sustainability')) return FaLeaf;
    if (name.includes('iot') || name.includes('technology')) return FaTools;
    if (name.includes('weather') || name.includes('climate')) return FaCloudSun;
    if (name.includes('farming') || name.includes('agriculture')) return FaTractor;
    if (name.includes('business') || name.includes('market')) return FaChartLine;
    if (name.includes('compliance') || name.includes('certification')) return FaCertificate;
    if (name.includes('pest') || name.includes('soil')) return FaHandsHelping;
    return FaBookOpen;
  };

  return (
    <Card
      bg={cardBgColor}
      borderRadius="xl"
      boxShadow="sm"
      cursor="pointer"
      onClick={onSelect}
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <CardBody p={6} textAlign="center">
        <Icon as={getCategoryIcon(category.name)} boxSize={8} color="blue.500" mb={3} />
        <Heading size="sm" mb={2} color={textColor}>
          {category.name}
        </Heading>
        <Text fontSize="xs" color={mutedTextColor} noOfLines={2}>
          {category.description}
        </Text>
      </CardBody>
    </Card>
  );
};

// Component for course cards
interface CourseCardProps {
  course: EducationCourse;
  onSelect: () => void;
  showProgress?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, showProgress = false }) => {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  const progressPercentage = course.user_progress?.progress_percentage || 0;

  return (
    <Card
      bg={cardBgColor}
      borderRadius="xl"
      boxShadow="sm"
      cursor="pointer"
      onClick={onSelect}
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <CardBody p={6}>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align="start">
            <Badge
              colorScheme={
                course.level === 'beginner'
                  ? 'green'
                  : course.level === 'intermediate'
                  ? 'blue'
                  : 'purple'
              }
              size="sm"
            >
              {course.level}
            </Badge>
            <HStack fontSize="sm" color={mutedTextColor}>
              <Icon as={FaClock} />
              <Text>{course.estimated_duration_minutes}m</Text>
            </HStack>
          </HStack>

          <Heading size="sm" color={textColor} noOfLines={2}>
            {course.title}
          </Heading>

          <Text fontSize="sm" color={mutedTextColor} noOfLines={3}>
            {course.description}
          </Text>

          {showProgress && progressPercentage > 0 && (
            <VStack align="stretch" spacing={1}>
              <HStack justify="space-between" fontSize="xs">
                <Text color={mutedTextColor}>Progress</Text>
                <Text color={textColor} fontWeight="medium">
                  {progressPercentage}%
                </Text>
              </HStack>
              <Progress
                value={progressPercentage}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
              />
            </VStack>
          )}

          <Button
            size="sm"
            colorScheme="blue"
            variant={progressPercentage > 0 ? 'solid' : 'outline'}
            leftIcon={<Icon as={progressPercentage > 0 ? FaPlay : FaBookOpen} />}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {progressPercentage > 0 ? 'Continue' : 'Start Course'}
          </Button>
        </VStack>
      </CardBody>
    </Card>
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
        <VStack align="stretch" spacing={3}>
          <HStack
            justify="space-between"
            align="start"
            cursor="pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Heading size="sm" color={textColor} flex={1}>
              {faq.question}
            </Heading>
            <Icon
              as={FaQuestionCircle}
              color="blue.500"
              transform={isExpanded ? 'rotate(180deg)' : 'none'}
              transition="transform 0.2s"
            />
          </HStack>

          {isExpanded && (
            <Text fontSize="sm" color={mutedTextColor}>
              {faq.answer}
            </Text>
          )}

          {faq.tags && faq.tags.length > 0 && (
            <HStack spacing={2} flexWrap="wrap">
              {faq.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} size="sm" variant="subtle" colorScheme="blue">
                  {tag}
                </Badge>
              ))}
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default EducationDashboard;
