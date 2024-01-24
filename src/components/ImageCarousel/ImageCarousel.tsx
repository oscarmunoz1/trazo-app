import { Box, Flex, Image, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import BgMusicCard from 'assets/img/BgMusicCard.png';

type ImageCarouselProps = {
  imagesList: string[];
};

const ImageCarousel = (props: ImageCarouselProps) => {
  const { imagesList } = props;

  const [currentImage, setCurrentImage] = useState<string>(BgMusicCard);

  useEffect(() => {
    if (imagesList && imagesList.length > 0) {
      setCurrentImage(imagesList[0]);
    }
  }, [imagesList]);

  return (
    <Flex direction="column" me={{ lg: '48px', xl: '48px' }} mb={{ sm: '24px', lg: '0px' }}>
      <Box
        w={{ sm: '80%', md: '60%', lg: '380px', xl: '400px' }}
        h={{ sm: '80%', md: '60%', lg: '230px', xl: '300px' }}
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
                src={image}
                w="100%"
                h="100%"
                borderRadius="15px"
                cursor="pointer"
                onClick={(e) => setCurrentImage(e.target.src)}
              />
            </Box>
          ))}
      </Stack>
    </Flex>
  );
};

export default ImageCarousel;
