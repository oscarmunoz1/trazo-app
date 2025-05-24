// Chakra imports
import { Button, Flex, Grid, Icon, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import BgMusicCard from 'assets/img/BgMusicCard.png';
// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CarouselCard from './CarouselCard';
import { FaPlus } from 'react-icons/fa';
// Assets
import avatar2 from 'assets/img/avatars/avatar2.png';
import avatar4 from 'assets/img/avatars/avatar4.png';
import avatar6 from 'assets/img/avatars/avatar6.png';
import { useIntl } from 'react-intl';

type CarouselHorizontalProps = {
  title: string;
  description: string;
  data: any[];
};

const CarouselHorizontal = ({ title, description, data }: CarouselHorizontalProps) => {
  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const intl = useIntl();
  const navigate = useNavigate();
  const { establishmentId } = useParams();

  return (
    <Card p="16px">
      <CardHeader p="12px 5px" mb="12px">
        <Flex justify={'space-between'} width={'100%'}>
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              {title}
            </Text>
            <Text fontSize="sm" color="gray.500" fontWeight="400">
              {description}
            </Text>
          </Flex>
          <Button
            p="0px"
            w={{ base: '64px', md: '77px' }}
            h={{ base: '64px', md: '77px' }}
            bg="transparent"
            color="green.500"
            borderRadius="15px"
            border="2px dashed"
            borderColor="green.200"
            _hover={{
              bg: 'green.50',
              borderColor: 'green.500'
            }}
            onClick={() => navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/add`)}
          >
            <Flex direction="column" justifyContent="center" align="center" h="120px">
              <Icon as={FaPlus} w="15px" h="15px" mb="10px" />
              <Text fontSize="md" fontWeight="bold">
                {intl.formatMessage({ id: 'app.new' })}
              </Text>
            </Flex>
          </Button>
        </Flex>
      </CardHeader>
      <CardBody px="5px">
        {data && data.length > 0 ? (
          <Grid
            templateColumns={{
              sm: '1fr',
              md: '1fr 1fr',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(3, 1fr)',
              '2xl': 'repeat(4, 1fr)'
            }}
            templateRows={{ sm: '1fr', md: '1fr', xl: '1fr' }}
            gap="24px"
          >
            {data.map((parcel) => (
              <CarouselCard
                id={parcel.id}
                image={parcel.image || BgMusicCard}
                name={parcel.name}
                category={parcel.product || intl.formatMessage({ id: 'app.noCurrentProduction' })}
                buttonText={intl.formatMessage({ id: 'app.viewParcel' }).toUpperCase()}
                avatars={parcel.members?.map((member) => member.image || '')}
              />
            ))}
          </Grid>
        ) : (
          <Flex width={'100%'} height={'70px'} justifyContent="center">
            <Text
              display={'flex'}
              fontSize={'md'}
              fontWeight={'300'}
              justifyContent={'center'}
              alignItems={'center'}
              textAlign={'center'}
            >
              {intl.formatMessage({ id: 'app.noParcelsYet' })}
            </Text>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default CarouselHorizontal;
