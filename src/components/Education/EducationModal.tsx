import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
  Link,
  Image,
  Progress,
  Tooltip,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  FiShield,
  FiMapPin,
  FiTrendingDown,
  FiTarget,
  FiInfo,
  FiCheckCircle,
  FiArrowRight,
  FiExternalLink,
  FiBookOpen,
  FiAward,
  FiBarChart,
  FiGlobe,
  FiUsers,
  FiClock,
  FiActivity,
  FiSearch
} from 'react-icons/fi';
import { useGetEducationContentQuery, EducationContent } from '../../store/api/carbonApi';

export type EducationTopic =
  | 'usda-methodology'
  | 'carbon-scoring'
  | 'regional-benchmarks'
  | 'trust-indicators'
  | 'farming-practices'
  | 'carbon-examples'
  | 'verification-process'
  | 'sustainability-metrics';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: EducationTopic;
  contextData?: any;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  triggerSource?: string;
}

const topicIcons = {
  'usda-methodology': FiShield,
  'carbon-scoring': FiActivity,
  'regional-benchmarks': FiMapPin,
  'trust-indicators': FiCheckCircle,
  'farming-practices': FiTarget,
  'carbon-examples': FiBarChart,
  'verification-process': FiSearch,
  'sustainability-metrics': FiTrendingDown
};

const sectionIcons = {
  shield: FiShield,
  'map-pin': FiMapPin,
  calculator: FiActivity,
  microscope: FiSearch,
  'trending-down': FiTrendingDown,
  target: FiTarget,
  'bar-chart': FiBarChart,
  globe: FiGlobe,
  users: FiUsers,
  clock: FiClock,
  award: FiAward
};

const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  topic,
  contextData,
  userLevel = 'beginner',
  triggerSource
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const modalSize = useBreakpointValue({ base: 'full', md: 'xl', lg: '2xl' });

  const {
    data: content,
    isLoading: loading,
    error,
    refetch: fetchEducationContent
  } = useGetEducationContentQuery(
    {
      topic,
      level: userLevel,
      context: contextData,
      source: triggerSource
    },
    {
      skip: !isOpen
    }
  );

  const getTopicIcon = (topicKey: EducationTopic) => {
    return topicIcons[topicKey] || FiInfo;
  };

  const getSectionIcon = (iconName: string) => {
    return sectionIcons[iconName as keyof typeof sectionIcons] || FiInfo;
  };

  const QuickFacts = () => {
    if (!content?.quick_facts || content.quick_facts.length === 0) return null;

    return (
      <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
        <Heading size="sm" color="blue.700" mb={3} display="flex" alignItems="center">
          <Icon as={FiInfo} mr={2} />
          Quick Facts
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
          {content.quick_facts.map((fact, index) => (
            <HStack key={index} align="start">
              <Icon as={FiCheckCircle} color="blue.500" mt={0.5} flexShrink={0} />
              <Text fontSize="sm" color="blue.700">
                {fact}
              </Text>
            </HStack>
          ))}
        </SimpleGrid>
      </Box>
    );
  };

  const SectionContent = ({ section }: { section: EducationContent['sections'][0] }) => {
    const IconComponent = getSectionIcon(section.icon);

    return (
      <Card variant="outline" borderColor={borderColor} mb={4}>
        <CardBody>
          <VStack align="start" spacing={4}>
            <HStack>
              <Box p={2} borderRadius="md" bg={`${accentColor}20`} color={accentColor}>
                <Icon as={IconComponent} boxSize={5} />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="md" color={textColor}>
                  {section.title}
                </Heading>
                <Badge colorScheme="gray" fontSize="xs">
                  {section.type
                    ? section.type.charAt(0).toUpperCase() + section.type.slice(1)
                    : 'Content'}
                </Badge>
              </VStack>
            </HStack>

            <Text color={textColor} lineHeight="tall">
              {section.content}
            </Text>

            {section.visual_aid && (
              <Box w="full" p={3} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600" fontStyle="italic">
                  📊 {section.visual_aid.description}
                </Text>
                {/* Visual aid rendering would go here based on type */}
              </Box>
            )}

            {section.key_takeaway && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="medium">
                    Key Takeaway
                  </Text>
                  <Text fontSize="sm">{section.key_takeaway}</Text>
                </VStack>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const RelatedTopics = () => {
    if (!content?.related_topics || content.related_topics.length === 0) return null;

    return (
      <Box>
        <Heading size="sm" color={textColor} mb={3}>
          Related Topics
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          {content.related_topics.map((relatedTopic, index) => {
            const IconComponent = getTopicIcon(relatedTopic as EducationTopic);
            return (
              <Card
                key={index}
                variant="outline"
                borderColor={borderColor}
                cursor="pointer"
                _hover={{ borderColor: accentColor, transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                <CardBody p={3}>
                  <HStack>
                    <Icon as={IconComponent} color={accentColor} />
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      {relatedTopic.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Text>
                    <Icon as={FiArrowRight} color="gray.400" ml="auto" />
                  </HStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  };

  const ExternalResources = () => {
    if (!content?.external_resources || content.external_resources.length === 0) return null;

    const getResourceIcon = (type: string) => {
      switch (type) {
        case 'research':
          return FiSearch;
        case 'government':
          return FiShield;
        case 'video':
          return FiExternalLink;
        default:
          return FiBookOpen;
      }
    };

    return (
      <Box>
        <Heading size="sm" color={textColor} mb={3}>
          Learn More
        </Heading>
        <VStack spacing={2} align="stretch">
          {content.external_resources.map((resource, index) => (
            <Card key={index} variant="outline" borderColor={borderColor}>
              <CardBody p={3}>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={getResourceIcon(resource.type)} color={accentColor} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        {resource.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {resource.description}
                      </Text>
                    </VStack>
                  </HStack>
                  <Link href={resource.url} isExternal>
                    <Icon as={FiExternalLink} color="gray.400" />
                  </Link>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
    );
  };

  const ConfidenceIndicator = () => {
    if (!content?.confidence_level) return null;

    return (
      <Box p={3} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
        <HStack justify="space-between" mb={2}>
          <Text fontSize="sm" fontWeight="medium" color="green.700">
            Data Confidence Level
          </Text>
          <Badge colorScheme="green">{content.confidence_level}%</Badge>
        </HStack>
        <Progress value={content.confidence_level} colorScheme="green" size="sm" />
        <Text fontSize="xs" color="green.600" mt={1}>
          Based on USDA standards and peer-reviewed research
        </Text>
      </Box>
    );
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Skeleton height="24px" width="200px" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Skeleton height="60px" width="100%" />
              <Skeleton height="100px" width="100%" />
              <Skeleton height="80px" width="100%" />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Educational Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="medium">Unable to Load Educational Content</Text>
                <Text fontSize="sm">Unable to load educational content. Please try again.</Text>
                <Button size="sm" onClick={() => fetchEducationContent()}>
                  Try Again
                </Button>
              </VStack>
            </Alert>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (!content) return null;

  const TopicIcon = getTopicIcon(topic);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Icon as={TopicIcon} color={accentColor} />
            <VStack align="start" spacing={1}>
              <Text>{content.title}</Text>
              {content.subtitle && (
                <Text fontSize="sm" color="gray.500" fontWeight="normal">
                  {content.subtitle}
                </Text>
              )}
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Overview */}
            <Box>
              <Text color={textColor} lineHeight="tall" mb={4}>
                {content.overview}
              </Text>
              <ConfidenceIndicator />
            </Box>

            <QuickFacts />

            {/* Main Content Tabs */}
            <Tabs index={activeTab} onChange={setActiveTab} colorScheme="green">
              <TabList>
                <Tab>Content</Tab>
                {content.related_topics && content.related_topics.length > 0 && <Tab>Related</Tab>}
                {content.external_resources && content.external_resources.length > 0 && (
                  <Tab>Resources</Tab>
                )}
              </TabList>

              <TabPanels>
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    {content.sections.map((section, index) => (
                      <SectionContent key={index} section={section} />
                    ))}
                  </VStack>
                </TabPanel>

                {content.related_topics && content.related_topics.length > 0 && (
                  <TabPanel px={0}>
                    <RelatedTopics />
                  </TabPanel>
                )}

                {content.external_resources && content.external_resources.length > 0 && (
                  <TabPanel px={0}>
                    <ExternalResources />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack justify="space-between" w="full">
            {content.last_updated && (
              <Text fontSize="xs" color="gray.500">
                Updated: {new Date(content.last_updated).toLocaleDateString()}
              </Text>
            )}
            <Button colorScheme="green" onClick={onClose}>
              Got It
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EducationModal;
