import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Icon,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  SimpleGrid,
  Image,
  Button,
  Flex
} from '@chakra-ui/react';
import { FaLeaf, FaStar, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Backend API structure for similar products
interface BackendSimilarProduct {
  id: string;
  product: {
    name: string;
  };
  reputation: number;
  image?: string;
}

interface SimilarProductsProps {
  products?: BackendSimilarProduct[];
  currentProductId?: string;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  products = [],
  currentProductId
}) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Filter out current product and limit to 4 similar products
  const filteredProducts = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);

  if (filteredProducts.length === 0) {
    return null;
  }

  const handleProductClick = (productId: string) => {
    navigate(`/production/${productId}`, { replace: true });
  };

  return (
    <Card bg={bgColor} shadow="lg" borderRadius="xl" w="full">
      <CardHeader>
        <HStack spacing={3} justify="space-between">
          <HStack spacing={3}>
            <Icon as={FaLeaf} color="green.500" boxSize={6} />
            <Heading size="md" color={textColor}>
              Similar Products
            </Heading>
          </HStack>
          {products.length > 4 && (
            <Button variant="ghost" size="sm" rightIcon={<FaArrowRight />}>
              View All
            </Button>
          )}
        </HStack>
      </CardHeader>

      <CardBody pt={0}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              bg={useColorModeValue('gray.50', 'gray.700')}
              shadow="sm"
              borderRadius="lg"
              cursor="pointer"
              onClick={() => handleProductClick(product.id)}
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <CardBody p={4}>
                <VStack spacing={3} align="stretch">
                  {/* Product Image */}
                  <Box
                    h="120px"
                    bg="gray.200"
                    borderRadius="md"
                    overflow="hidden"
                    position="relative"
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.product.name}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    ) : (
                      <Flex
                        align="center"
                        justify="center"
                        h="full"
                        bg="linear-gradient(135deg, #e6f7e6 0%, #b3d9b3 100%)"
                      >
                        <Icon as={FaLeaf} boxSize={8} color="green.600" />
                      </Flex>
                    )}
                  </Box>

                  {/* Product Info */}
                  <VStack spacing={2} align="start">
                    <Heading size="sm" color={textColor} noOfLines={2}>
                      {product.product.name}
                    </Heading>

                    <HStack spacing={2} justify="space-between" w="full">
                      <HStack spacing={1}>
                        <Icon as={FaStar} color="orange.400" boxSize={3} />
                        <Text fontSize="xs" color={mutedColor}>
                          {product.reputation.toFixed(1)}
                        </Text>
                      </HStack>

                      <Badge colorScheme="green" size="sm" borderRadius="full">
                        Verified
                      </Badge>
                    </HStack>

                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      w="full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      View Details
                    </Button>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* View More Button */}
        {products.length > 4 && (
          <Flex justify="center" mt={6}>
            <Button variant="outline" colorScheme="green" size="sm" rightIcon={<FaArrowRight />}>
              View {products.length - 4} More Similar Products
            </Button>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};
