import { Box, Flex, Image, Stack } from '@chakra-ui/react';

import BgMusicCard from 'assets/img/BgMusicCard.png';
import { useState } from 'react';

type ImageCarouselProps = {
  imagesList: string[];
};

const ImageCarousel = (props: ImageCarouselProps) => {
  const { imagesList } = props;
  const [currentImage, setCurrentImage] = useState<string>(
    imagesList && imagesList.length > 0
      ? `${import.meta.env.VITE_APP_BACKEND_URL}${imagesList[0]}`
      : BgMusicCard
  );

  return (
    <Flex direction="column" me={{ lg: '48px', xl: '48px' }} mb={{ sm: '24px', lg: '0px' }}>
      <Box
        w={{ sm: '275px', md: '670px', lg: '380px', xl: '400px' }}
        h={{ sm: '200px', md: '500px', lg: '230px', xl: '300px' }}
        mb="26px"
        mx={{ sm: 'auto', lg: '0px' }}>
        <Image src={currentImage} w="100%" h="100%" borderRadius="15px" />
      </Box>
      <Stack
        direction="row"
        spacing={{ sm: '20px', md: '35px', lg: '20px' }}
        mx="auto"
        mb={{ sm: '24px', lg: '0px' }}>
        {imagesList &&
          imagesList.length > 0 &&
          imagesList.map((image) => (
            <Box
              w={{ sm: '36px', md: '90px', lg: '60px' }}
              h={{ sm: '36px', md: '90px', lg: '60px' }}>
              <Image
                src={`${import.meta.env.VITE_APP_BACKEND_URL}${image}`}
                w="100%"
                h="100%"
                borderRadius="15px"
                cursor="pointer"
                onClick={(e) => setCurrentImage(e.target.src)}
              />
            </Box>
          ))}

        {/* <Box w={{ sm: '36px', md: '90px', lg: '60px' }} h={{ sm: '36px', md: '90px', lg: '60px' }}>
          <Image
            src={
              establishment?.image
                ? `${import.meta.env.VITE_APP_BACKEND_URL}${establishment?.image}`
                : productPage1
            }
            w="100%"
            h="100%"
            borderRadius="15px"
            cursor="pointer"
            onClick={(e) => setCurrentImage(e.target.src)}
          />
        </Box>
        <Box w={{ sm: '36px', md: '90px', lg: '60px' }} h={{ sm: '36px', md: '90px', lg: '60px' }}>
          <Image
            src={productPage2}
            w="100%"
            h="100%"
            borderRadius="15px"
            cursor="pointer"
            onClick={(e) => setCurrentImage(e.target.src)}
          />
        </Box>
        <Box w={{ sm: '36px', md: '90px', lg: '60px' }} h={{ sm: '36px', md: '90px', lg: '60px' }}>
          <Image
            src={productPage3}
            w="100%"
            h="100%"
            borderRadius="15px"
            cursor="pointer"
            onClick={(e) => setCurrentImage(e.target.src)}
          />
        </Box>
        <Box w={{ sm: '36px', md: '90px', lg: '60px' }} h={{ sm: '36px', md: '90px', lg: '60px' }}>
          <Image
            src={productPage4}
            w="100%"
            h="100%"
            borderRadius="15px"
            cursor="pointer"
            onClick={(e) => setCurrentImage(e.target.src)}
          />
        </Box>
        <Box w={{ sm: '36px', md: '90px', lg: '60px' }} h={{ sm: '36px', md: '90px', lg: '60px' }}>
          <Image
            src={productPage2}
            w="100%"
            h="100%"
            borderRadius="15px"
            cursor="pointer"
            onClick={(e) => setCurrentImage(e.target.src)}
          />
        </Box> */}
      </Stack>
    </Flex>
  );
};

export default ImageCarousel;
