import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Divider,
  SimpleGrid,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaInfo, FaChartLine, FaBookOpen, FaMapMarkerAlt } from 'react-icons/fa';
import RegionalBenchmark from 'components/Carbon/RegionalBenchmark';

interface MobileEducationalSectionProps {
  carbonData: any;
  handleEducationOpen: (topic: string) => void;
  setShowTrustComparison: (show: boolean) => void;
}

const MobileEducationalSection: React.FC<MobileEducationalSectionProps> = ({
  carbonData,
  handleEducationOpen,
  setShowTrustComparison
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <VStack spacing={{ base: 3, md: 4 }} mt={{ base: 4, md: 6 }}>
      {/* Educational Section Header - Mobile Optimized */}
      <Box textAlign="center" mb={{ base: 2, md: 1 }} w="full">
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="semibold"
          color="gray.700"
          mb={{ base: 2, md: 1 }}
        >
          Learn More About This Data
        </Text>
        <Divider />
      </Box>

      {/* Primary Educational Buttons - Mobile-First Grid with Enhanced Touch Targets */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 3, md: 4 }} w="full">
        <Button
          size={{ base: 'md', md: 'lg' }}
          variant="outline"
          colorScheme="blue"
          leftIcon={<Icon as={FaInfo} boxSize={{ base: 4, md: 5 }} />}
          onClick={() => handleEducationOpen('carbon-scoring')}
          minH={{ base: '48px', md: '52px' }}
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="medium"
          px={{ base: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          _hover={{
            transform: 'translateY(-1px)',
            boxShadow: 'md',
            bg: 'blue.50'
          }}
          _active={{
            transform: 'translateY(0)',
            boxShadow: 'sm'
          }}
          transition="all 0.2s"
          borderWidth="1px"
          borderRadius="lg"
        >
          <Text textAlign="center" lineHeight="1.2">
            How is this calculated?
          </Text>
        </Button>

        <Button
          size={{ base: 'md', md: 'lg' }}
          variant="outline"
          colorScheme="green"
          leftIcon={<Icon as={FaChartLine} boxSize={{ base: 4, md: 5 }} />}
          onClick={() => setShowTrustComparison(true)}
          minH={{ base: '48px', md: '52px' }}
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="medium"
          px={{ base: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          _hover={{
            transform: 'translateY(-1px)',
            boxShadow: 'md',
            bg: 'green.50'
          }}
          _active={{
            transform: 'translateY(0)',
            boxShadow: 'sm'
          }}
          transition="all 0.2s"
          borderWidth="1px"
          borderRadius="lg"
        >
          <Text textAlign="center" lineHeight="1.2">
            Why trust this data?
          </Text>
        </Button>
      </SimpleGrid>

      {/* Secondary Educational Actions - Mobile Optimized with Enhanced Touch Targets */}
      <VStack spacing={{ base: 3, md: 2 }} w="full">
        <HStack spacing={{ base: 3, md: 2 }} justify="center" flexWrap="wrap" w="full">
          <Button
            size={{ base: 'sm', md: 'xs' }}
            variant="ghost"
            colorScheme="blue"
            leftIcon={<Icon as={FaBookOpen} boxSize={{ base: 3, md: 2 }} />}
            onClick={() => handleEducationOpen('usda-methodology')}
            minH={{ base: '44px', md: '40px' }}
            fontSize={{ base: 'xs', md: '2xs' }}
            px={{ base: 3, md: 2 }}
            py={{ base: 2, md: 1 }}
            _hover={{ bg: 'blue.50' }}
            _active={{ bg: 'blue.100' }}
            borderRadius="md"
          >
            USDA Standards
          </Button>

          <Button
            size={{ base: 'sm', md: 'xs' }}
            variant="ghost"
            colorScheme="green"
            leftIcon={<Icon as={FaMapMarkerAlt} boxSize={{ base: 3, md: 2 }} />}
            onClick={() => handleEducationOpen('regional-benchmarks')}
            minH={{ base: '44px', md: '40px' }}
            fontSize={{ base: 'xs', md: '2xs' }}
            px={{ base: 3, md: 2 }}
            py={{ base: 2, md: 1 }}
            _hover={{ bg: 'green.50' }}
            _active={{ bg: 'green.100' }}
            borderRadius="md"
          >
            Regional Data
          </Button>
        </HStack>

        {/* Regional Benchmark Component - Mobile Optimized */}
        {(carbonData as any)?.establishment?.id && (
          <Box w="full" mt={{ base: 2, md: 1 }}>
            <RegionalBenchmark
              establishmentId={(carbonData as any).establishment.id}
              cropType={carbonData?.cropType || 'tree_fruit'}
              carbonIntensity={carbonData?.netFootprint || 0}
              compact={true}
              showTitle={false}
            />
          </Box>
        )}
      </VStack>
    </VStack>
  );
};

export default MobileEducationalSection;
