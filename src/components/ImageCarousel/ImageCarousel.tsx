import { Box, Flex, Image, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import BgMusicCard from 'assets/img/BgMusicCard.png';

type ImageItem = string | { id: string; image: string; name: string };

type ImageCarouselProps = {
  imagesList: ImageItem[];
};

const ImageCarousel = (props: ImageCarouselProps) => {
  const { imagesList } = props;

  const [currentImage, setCurrentImage] = useState<{ url: string; name?: string }>({
    url: BgMusicCard,
    name: 'Product Image'
  });

  // Helper function to extract image URL and name from different formats
  const getImageData = (item: ImageItem): { url: string; name?: string } => {
    if (typeof item === 'string') {
      return { url: item };
    }
    return { url: item.image, name: item.name };
  };

  useEffect(() => {
    if (imagesList && imagesList.length > 0) {
      const firstImage = getImageData(imagesList[0]);
      setCurrentImage(firstImage);
    } else {
      // Fallback to default image when no images provided
      setCurrentImage({
        url: BgMusicCard,
        name: 'Product Image'
      });
    }
  }, [imagesList]);

  // Always show the carousel, even with fallback image
  return (
    <Flex direction="column" me={{ lg: '48px', xl: '48px' }} mb={{ sm: '24px', lg: '0px' }}>
      <Box
        w={{ sm: '80%', md: '60%', lg: '380px', xl: '100%' }}
        h={{ sm: '80%', md: '60%', lg: '230px', xl: '300px' }}
        mb="26px"
        mx={{ sm: 'auto', lg: '0px' }}
        position="relative">
        <Image
          src={currentImage.url}
          alt={currentImage.name || 'Product image'}
          w="100%"
          h="100%"
          borderRadius="15px"
          objectFit="cover"
          bg="transparent"
          fallbackSrc={BgMusicCard}
        />

        {/* Image name overlay for fallback/placeholder images */}
        {currentImage.name && currentImage.name.includes('Representative') && (
          <Box
            position="absolute"
            bottom={2}
            left={2}
            right={2}
            bg="blackAlpha.700"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs">
            <Text textAlign="center" noOfLines={1}>
              {currentImage.name}
            </Text>
          </Box>
        )}
      </Box>

      {/* Thumbnail strip - only show if we have multiple images */}
      {imagesList && imagesList.length > 1 && (
        <Stack
          direction="row"
          spacing={{ sm: '20px', md: '35px', lg: '20px' }}
          mx="auto"
          mb={{ sm: '24px', lg: '0px' }}>
          {imagesList.map((image, index) => {
            const imageData = getImageData(image);
            const imageKey = typeof image === 'string' ? `img_${index}` : image.id;

            return (
              <Box
                key={imageKey}
                w={{ sm: '36px', md: '90px', lg: '60px' }}
                h={{ sm: '36px', md: '90px', lg: '60px' }}>
                <Image
                  src={imageData.url}
                  alt={imageData.name || `Product image ${index + 1}`}
                  w="100%"
                  h="100%"
                  borderRadius="15px"
                  cursor="pointer"
                  objectFit="cover"
                  border={currentImage.url === imageData.url ? '2px solid' : 'none'}
                  borderColor="green.500"
                  onClick={() => setCurrentImage(imageData)}
                  fallbackSrc={BgMusicCard}
                  _hover={{
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Flex>
  );
};

export default ImageCarousel;
