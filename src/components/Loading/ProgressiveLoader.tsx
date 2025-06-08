import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Card,
  CardBody,
  SimpleGrid,
  Container,
  Flex
} from '@chakra-ui/react';

// Step 5: Progressive Loading Types
export type LoadingStage = 'initial' | 'primary' | 'secondary' | 'complete';

// Step 5: Universal Skeleton Components for 3-second target optimization

// Dashboard Skeleton - Priority loading for producer dashboard
export const DashboardSkeleton = () => (
  <Container maxW="7xl" mx="auto" py={8}>
    <VStack spacing={8}>
      {/* Header Statistics */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} w="full">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} boxShadow="md" borderRadius="xl">
            <CardBody>
              <VStack spacing={3}>
                <SkeletonCircle size="50px" />
                <VStack spacing={2}>
                  <Skeleton height="24px" width="80px" />
                  <Skeleton height="16px" width="120px" />
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Main Content Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
        {/* Chart Skeleton */}
        <Card boxShadow="lg" borderRadius="xl">
          <CardBody p={6}>
            <VStack spacing={4}>
              <Skeleton height="24px" width="200px" />
              <Box w="full" h="300px" bg="gray.100" borderRadius="lg">
                <Skeleton height="100%" width="100%" />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* List Skeleton */}
        <Card boxShadow="lg" borderRadius="xl">
          <CardBody p={6}>
            <VStack spacing={4}>
              <Skeleton height="24px" width="180px" />
              <VStack spacing={3} w="full">
                {[1, 2, 3, 4, 5].map((i) => (
                  <HStack key={i} w="full" spacing={4}>
                    <SkeletonCircle size="40px" />
                    <VStack align="start" flex={1} spacing={2}>
                      <Skeleton height="16px" width="60%" />
                      <Skeleton height="12px" width="40%" />
                    </VStack>
                    <Skeleton height="32px" width="80px" />
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  </Container>
);

// Carbon Dashboard Skeleton - Specialized for carbon metrics
export const CarbonDashboardSkeleton = () => (
  <Container maxW="7xl" mx="auto" py={8}>
    <VStack spacing={8}>
      {/* Carbon Score Display */}
      <Card boxShadow="xl" borderRadius="2xl" w="full">
        <CardBody p={8}>
          <VStack spacing={6}>
            <Skeleton height="32px" width="300px" />
            <SkeletonCircle size="150px" />
            <VStack spacing={2}>
              <Skeleton height="20px" width="250px" />
              <Skeleton height="16px" width="200px" />
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Metrics Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
        {[1, 2, 3].map((i) => (
          <Card key={i} boxShadow="lg" borderRadius="xl">
            <CardBody p={6}>
              <VStack spacing={4}>
                <SkeletonCircle size="80px" />
                <VStack spacing={2}>
                  <Skeleton height="20px" width="120px" />
                  <Skeleton height="16px" width="100px" />
                </VStack>
                <Skeleton height="100px" width="100%" />
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  </Container>
);

// Form Skeleton - For creation/editing screens
export const FormSkeleton = () => (
  <Container maxW="4xl" mx="auto" py={8}>
    <VStack spacing={8}>
      {/* Header */}
      <VStack spacing={4} w="full">
        <Skeleton height="40px" width="300px" />
        <Skeleton height="20px" width="500px" />
      </VStack>

      {/* Form Cards */}
      <VStack spacing={6} w="full">
        {[1, 2, 3].map((i) => (
          <Card key={i} boxShadow="lg" borderRadius="xl" w="full">
            <CardBody p={6}>
              <VStack spacing={4}>
                <Skeleton height="24px" width="200px" />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  {[1, 2, 3, 4].map((j) => (
                    <VStack key={j} align="start" spacing={2}>
                      <Skeleton height="16px" width="100px" />
                      <Skeleton height="40px" width="100%" />
                    </VStack>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Action Buttons */}
      <HStack spacing={4}>
        <Skeleton height="40px" width="120px" />
        <Skeleton height="40px" width="120px" />
      </HStack>
    </VStack>
  </Container>
);

// Table Skeleton - For data lists and tables
export const TableSkeleton = () => (
  <Container maxW="7xl" mx="auto" py={8}>
    <VStack spacing={6}>
      {/* Header with Search */}
      <Flex justify="space-between" align="center" w="full">
        <Skeleton height="32px" width="200px" />
        <HStack spacing={3}>
          <Skeleton height="40px" width="200px" />
          <Skeleton height="40px" width="120px" />
        </HStack>
      </Flex>

      {/* Table */}
      <Card boxShadow="lg" borderRadius="xl" w="full">
        <CardBody p={0}>
          <VStack spacing={0} w="full">
            {/* Table Header */}
            <Box w="full" p={4} bg="gray.50" borderTopRadius="xl">
              <HStack spacing={8}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height="16px" width="100px" />
                ))}
              </HStack>
            </Box>

            {/* Table Rows */}
            <VStack spacing={0} w="full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Box key={i} w="full" p={4} borderBottom="1px solid" borderColor="gray.200">
                  <HStack spacing={8}>
                    <SkeletonCircle size="32px" />
                    <Skeleton height="16px" width="150px" />
                    <Skeleton height="16px" width="100px" />
                    <Skeleton height="16px" width="80px" />
                    <Skeleton height="32px" width="80px" />
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  </Container>
);

// Mobile Optimized Skeletons
export const MobileListSkeleton = () => (
  <VStack spacing={4} p={4}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i} boxShadow="md" borderRadius="xl" w="full">
        <CardBody p={4}>
          <HStack spacing={4}>
            <SkeletonCircle size="50px" />
            <VStack align="start" flex={1} spacing={2}>
              <Skeleton height="16px" width="70%" />
              <Skeleton height="14px" width="50%" />
              <Skeleton height="12px" width="40%" />
            </VStack>
            <VStack spacing={2}>
              <Skeleton height="20px" width="60px" />
              <Skeleton height="16px" width="40px" />
            </VStack>
          </HStack>
        </CardBody>
      </Card>
    ))}
  </VStack>
);

// Settings/Profile Skeleton
export const ProfileSkeleton = () => (
  <Container maxW="4xl" mx="auto" py={8}>
    <VStack spacing={8}>
      {/* Profile Header */}
      <Card boxShadow="lg" borderRadius="xl" w="full">
        <CardBody p={8}>
          <VStack spacing={6}>
            <SkeletonCircle size="120px" />
            <VStack spacing={2}>
              <Skeleton height="24px" width="200px" />
              <Skeleton height="16px" width="150px" />
            </VStack>
            <HStack spacing={4}>
              <Skeleton height="40px" width="120px" />
              <Skeleton height="40px" width="120px" />
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Settings Sections */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} boxShadow="md" borderRadius="xl">
            <CardBody p={6}>
              <VStack spacing={4}>
                <HStack w="full" justify="space-between">
                  <Skeleton height="20px" width="120px" />
                  <SkeletonCircle size="24px" />
                </HStack>
                <VStack spacing={3} w="full">
                  {[1, 2, 3].map((j) => (
                    <HStack key={j} w="full" justify="space-between">
                      <Skeleton height="16px" width="100px" />
                      <Skeleton height="32px" width="60px" />
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  </Container>
);

// Generic Loading Component with Stage-based Display
interface ProgressiveLoaderProps {
  stage: LoadingStage;
  type?: 'dashboard' | 'carbon' | 'form' | 'table' | 'profile' | 'mobile-list';
  children?: React.ReactNode;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  stage,
  type = 'dashboard',
  children
}) => {
  if (stage === 'complete') {
    return <>{children}</>;
  }

  const SkeletonComponent = {
    dashboard: DashboardSkeleton,
    carbon: CarbonDashboardSkeleton,
    form: FormSkeleton,
    table: TableSkeleton,
    profile: ProfileSkeleton,
    'mobile-list': MobileListSkeleton
  }[type];

  return <SkeletonComponent />;
};

export default ProgressiveLoader;
