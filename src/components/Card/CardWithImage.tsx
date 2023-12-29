// Chakra imports
import { Button, Flex, Icon, Spacer, Text, useColorModeValue } from '@chakra-ui/react';

import { BsArrowRight } from 'react-icons/bs';
// Custom components
import Card from './Card';
import CardBody from './CardBody';
import { useNavigate } from 'react-router-dom';

type CardWithImageProps = {
  title: string;
  name: string;
  image: HTMLImageElement;
  readMoreLink: string;
};

const CardWithImage = ({ title, name, image, readMoreLink }: CardWithImageProps) => {
  const navigate = useNavigate();

  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Card minHeight={'290.5px'} p="1.2rem">
      <CardBody width={'100%'}>
        <Flex flexDirection={{ sm: 'column', lg: 'row' }} w="100%">
          <Flex flexDirection="column" h="100%" lineHeight="1.6" width={{ lg: '45%' }}>
            <Text fontSize="sm" color="gray.400" fontWeight="bold">
              {title}
            </Text>
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              {name}
            </Text>
            <Spacer />
            <Flex align="center">
              <Button
                p="0px"
                variant="no-hover"
                bg="transparent"
                my={{ sm: '1.5rem', lg: '0px' }}
                onClick={() => navigate(readMoreLink)}>
                <Text
                  fontSize="sm"
                  color={textColor}
                  fontWeight="bold"
                  cursor="pointer"
                  transition="all .5s ease"
                  my={{ sm: '1.5rem', lg: '0px' }}
                  _hover={{ me: '4px' }}>
                  Read more
                </Text>
                <Icon
                  as={BsArrowRight}
                  w="20px"
                  h="20px"
                  fontSize="2xl"
                  transition="all .5s ease"
                  mx=".3rem"
                  cursor="pointer"
                  pt="4px"
                  _hover={{ transform: 'translateX(20%)' }}
                />
              </Button>
            </Flex>
          </Flex>
          <Spacer />
          <Flex
            bg="green.300"
            align="center"
            justify="center"
            borderRadius="15px"
            width={{ sm: '100%', md: '320px' }}
            height="250px"
            minH={'250px'}>
            {image}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CardWithImage;
