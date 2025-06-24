import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Icon,
  Image,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  Flex,
  Link,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Avatar,
  Button,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaUsers,
  FaCalendarAlt,
  FaCertificate,
  FaLeaf,
  FaExternalLinkAlt,
  FaIndustry,
  FaChartLine
} from 'react-icons/fa';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: {
    id: string;
    name: string;
    tradename?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    logo?: string;
    fiscal_id?: string;
    contact_email?: string;
    established_year?: number;
    employee_count?: number;
    total_establishments?: number;
    total_parcels?: number;
    certifications?: string[];
    subscription_plan?: {
      name: string;
      tier: string;
    };
  };
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, companyData }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const modalSize = useBreakpointValue({ base: 'full', md: 'xl', lg: '2xl' });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="xl" maxH="90vh">
        <ModalHeader p={6} pb={4} borderBottom="1px" borderColor={borderColor}>
          <HStack spacing={4}>
            <Box p={3} borderRadius="lg" bg={useColorModeValue('green.50', 'green.900')}>
              <Icon as={FaBuilding} boxSize={6} color={accentColor} />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={textColor}>
                {companyData.name}
              </Heading>
              {companyData.tradename && (
                <Text fontSize="sm" color="gray.500">
                  Trading as: {companyData.tradename}
                </Text>
              )}
              {companyData.subscription_plan && (
                <Badge
                  colorScheme="green"
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {companyData.subscription_plan.name} Plan
                </Badge>
              )}
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={6} overflowY="auto">
          <VStack spacing={6} align="stretch">
            {/* Company Logo and Description */}
            {(companyData.logo || companyData.description) && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    {companyData.logo && (
                      <Flex justify="center">
                        <Avatar
                          size="xl"
                          src={companyData.logo}
                          name={companyData.name}
                          bg={accentColor}
                          color="white"
                        />
                      </Flex>
                    )}
                    {companyData.description && (
                      <Text color={textColor} textAlign="center" lineHeight="tall">
                        {companyData.description}
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Company Statistics */}
            <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <Heading size="md" color={textColor} mb={4}>
                  Company Overview
                </Heading>
                <StatGroup>
                  <Stat>
                    <StatLabel color="gray.500">Establishments</StatLabel>
                    <StatNumber color={accentColor}>
                      {companyData.total_establishments || 0}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel color="gray.500">Total Parcels</StatLabel>
                    <StatNumber color={accentColor}>{companyData.total_parcels || 0}</StatNumber>
                  </Stat>
                  {companyData.employee_count && (
                    <Stat>
                      <StatLabel color="gray.500">Employees</StatLabel>
                      <StatNumber color={accentColor}>{companyData.employee_count}</StatNumber>
                    </Stat>
                  )}
                </StatGroup>
              </CardBody>
            </Card>

            {/* Contact Information */}
            <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <Heading size="md" color={textColor} mb={4}>
                  Contact Information
                </Heading>
                <VStack spacing={4} align="stretch">
                  {companyData.address && (
                    <HStack spacing={3}>
                      <Icon as={FaMapMarkerAlt} color={accentColor} />
                      <Text color={textColor}>
                        {companyData.address}
                        {companyData.city && `, ${companyData.city}`}
                        {companyData.state && `, ${companyData.state}`}
                        {companyData.country && `, ${companyData.country}`}
                      </Text>
                    </HStack>
                  )}
                  {companyData.phone && (
                    <HStack spacing={3}>
                      <Icon as={FaPhone} color={accentColor} />
                      <Link href={`tel:${companyData.phone}`} color={textColor}>
                        {companyData.phone}
                      </Link>
                    </HStack>
                  )}
                  {companyData.email && (
                    <HStack spacing={3}>
                      <Icon as={FaEnvelope} color={accentColor} />
                      <Link href={`mailto:${companyData.email}`} color={textColor}>
                        {companyData.email}
                      </Link>
                    </HStack>
                  )}
                  {companyData.contact_email && companyData.contact_email !== companyData.email && (
                    <HStack spacing={3}>
                      <Icon as={FaEnvelope} color={accentColor} />
                      <Text color="gray.500" fontSize="sm">
                        Contact:
                      </Text>
                      <Link href={`mailto:${companyData.contact_email}`} color={textColor}>
                        {companyData.contact_email}
                      </Link>
                    </HStack>
                  )}
                  {companyData.website && (
                    <HStack spacing={3}>
                      <Icon as={FaGlobe} color={accentColor} />
                      <Link
                        href={companyData.website}
                        isExternal
                        color={textColor}
                        _hover={{ color: accentColor }}
                      >
                        {companyData.website}
                        <Icon as={FaExternalLinkAlt} ml={2} boxSize={3} />
                      </Link>
                    </HStack>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Social Media */}
            {(companyData.facebook || companyData.instagram) && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    Social Media
                  </Heading>
                  <HStack spacing={4}>
                    {companyData.facebook && (
                      <Button
                        as={Link}
                        href={companyData.facebook}
                        isExternal
                        leftIcon={<FaFacebook />}
                        colorScheme="facebook"
                        variant="outline"
                        size="sm"
                      >
                        Facebook
                      </Button>
                    )}
                    {companyData.instagram && (
                      <Button
                        as={Link}
                        href={companyData.instagram}
                        isExternal
                        leftIcon={<FaInstagram />}
                        colorScheme="pink"
                        variant="outline"
                        size="sm"
                      >
                        Instagram
                      </Button>
                    )}
                  </HStack>
                </CardBody>
              </Card>
            )}

            {/* Certifications */}
            {companyData.certifications && companyData.certifications.length > 0 && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    <HStack>
                      <Icon as={FaCertificate} color={accentColor} />
                      <Text>Certifications</Text>
                    </HStack>
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    {companyData.certifications.map((cert, index) => (
                      <Badge
                        key={index}
                        colorScheme="green"
                        variant="subtle"
                        px={3}
                        py={2}
                        borderRadius="md"
                        fontSize="sm"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}

            {/* Legal Information */}
            {companyData.fiscal_id && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    Legal Information
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text color="gray.500" fontSize="sm">
                        Tax ID:
                      </Text>
                      <Text color={textColor} fontSize="sm" fontFamily="mono">
                        {companyData.fiscal_id}
                      </Text>
                    </HStack>
                    {companyData.established_year && (
                      <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                          Established:
                        </Text>
                        <Text color={textColor} fontSize="sm">
                          {companyData.established_year}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CompanyModal;
