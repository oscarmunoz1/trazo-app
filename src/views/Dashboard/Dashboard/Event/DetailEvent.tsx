// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import BgMusicCard from 'assets/img/BgMusicCard.png';
import BoxBackground from '../components/BoxBackground';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { useGetEventQuery } from 'store/api/historyApi';
import { useSelector } from 'react-redux';

function ProfileEstablishment() {
  const textColor = useColorModeValue('gray.700', 'white');
  const navigate = useNavigate();
  const { establishmentId, parcelId, eventId } = useParams();
  const [establishment, setEstablishment] = useState(null);
  const [parcel, setParcel] = useState(null);
  const [eventType, setEventType] = useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('event_type')) {
      setEventType(searchParams.get('event_type'));
    }
  }, [searchParams]);

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  const {
    data: eventData,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetEventQuery(
    { companyId: currentCompany?.id, establishmentId, parcelId, eventId, eventType },
    {
      skip: !eventId || !parcelId || !establishmentId || !currentCompany?.id || !eventType
    }
  );

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);

  useEffect(() => {
    let establishment;
    if (establishments) {
      establishment = establishments.filter(
        (establishment) => establishment.id.toString() === establishmentId
      )[0];

      setEstablishment(establishment);
      setParcel(establishment.parcels.filter((parcel) => parcel.id === parseInt(parcelId))[0]);
    }
  }, [establishmentId, establishments]);

  return (
    <BoxBackground title="Event detail" subtitle="Here you can see the information of the event.">
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px" w="100%">
        <Card
          mt={{ md: '24px' }}
          maxWidth={{ sm: '100%', md: '100%', lg: '80%' }}
          px="0px"
          pt={{ sm: '16px', md: '32px', lg: '0px' }}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px">
          <CardHeader justifyContent="end">
            {/* <Flex
              direction={{ sm: "column", md: "row" }}
              align="flex-start"
              py={{ md: "12px" }}
              px="24px"
            >
              <Button p="0px" bg="transparent" mb={{ sm: "10px", md: "0px" }}>
                <Flex
                  color={textColor}
                  cursor="pointer"
                  align="center"
                  p="12px"
                >
                  <Icon as={FaTrashAlt} me="4px" />
                </Flex>
              </Button>
              <Button
                p="0px"
                bg="transparent"
                onClick={() =>
                  navigate(
                    `/admin/dashboard/establishment/${establishmentId}/change`
                  )
                }
              >
                <Flex
                  color={textColor}
                  cursor="pointer"
                  align="center"
                  p="12px"
                >
                  <Icon as={FaPencilAlt} me="4px" />
                </Flex>
              </Button>
            </Flex> */}
            <Flex p="24px" align="center" justify="center">
              <Menu isOpen={isOpen1} onClose={onClose1}>
                <MenuButton onClick={onOpen1} alignSelf="flex-start">
                  <Icon as={IoEllipsisVerticalSharp} color="gray.400" w="20px" h="20px" />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/${eventId}/change?event_type=${eventType}`
                      )
                    }>
                    <Flex color={textColor} cursor="pointer" align="center" p="4px">
                      {/* <Icon as={FaPencilAlt} me="4px" /> */}
                      <Text fontSize="sm" fontWeight="500">
                        EDIT
                      </Text>
                    </Flex>
                  </MenuItem>
                  <MenuItem>
                    <Flex color="red.500" cursor="pointer" align="center" p="4px">
                      {/* <Icon as={FaTrashAlt} me="4px" /> */}
                      <Text fontSize="sm" fontWeight="500">
                        DELETE
                      </Text>
                    </Flex>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </CardHeader>
          <CardBody px={{ sm: '16px', md: '32px', lg: '48px' }}>
            <Flex direction={'column'}>
              <Flex direction={{ sm: 'column', lg: 'row' }} mb={{ sm: '42px', lg: '48px' }}>
                <Flex
                  direction="column"
                  me={{ lg: '48px', xl: '48px' }}
                  mb={{ sm: '24px', lg: '0px' }}>
                  <Box
                    w={{ sm: '100%', md: '100%', lg: '380px', xl: '400px' }}
                    h={{ sm: '200px', md: '500px', lg: '230px', xl: '300px' }}
                    mb="26px"
                    mx={{ sm: 'auto', lg: '0px' }}>
                    <Image
                      src={eventData?.image || BgMusicCard}
                      w="100%"
                      h="100%"
                      borderRadius="15px"
                    />
                  </Box>
                </Flex>
                {/* <Flex
                  direction="column"
                  me={{ lg: '48px', xl: '48px' }}
                  mb={{ sm: '24px', lg: '0px' }}>
                  <Box
                    w={{ sm: '275px', md: '670px', lg: '380px', xl: '400px' }}
                    h={{ sm: '200px', md: '500px', lg: '230px', xl: '300px' }}
                    mb="26px"
                    mx={{ sm: 'auto', lg: '0px' }}>
                    <Image
                      src={
                        establishment?.image
                          ? `${import.meta.env.VITE_APP_BACKEND_URL}${establishment?.image}`
                          : productPage1
                      }
                      w="100%"
                      h="100%"
                      borderRadius="15px"
                    />
                  </Box>
                  <Stack
                    direction="row"
                    spacing={{ sm: '20px', md: '35px', lg: '20px' }}
                    mx="auto"
                    mb={{ sm: '24px', lg: '0px' }}>
                    <Box
                      w={{ sm: '36px', md: '90px', lg: '60px' }}
                      h={{ sm: '36px', md: '90px', lg: '60px' }}>
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
                    <Box
                      w={{ sm: '36px', md: '90px', lg: '60px' }}
                      h={{ sm: '36px', md: '90px', lg: '60px' }}>
                      <Image
                        src={productPage2}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                    <Box
                      w={{ sm: '36px', md: '90px', lg: '60px' }}
                      h={{ sm: '36px', md: '90px', lg: '60px' }}>
                      <Image
                        src={productPage3}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                    <Box
                      w={{ sm: '36px', md: '90px', lg: '60px' }}
                      h={{ sm: '36px', md: '90px', lg: '60px' }}>
                      <Image
                        src={productPage4}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                    <Box
                      w={{ sm: '36px', md: '90px', lg: '60px' }}
                      h={{ sm: '36px', md: '90px', lg: '60px' }}>
                      <Image
                        src={productPage2}
                        w="100%"
                        h="100%"
                        borderRadius="15px"
                        cursor="pointer"
                        onClick={(e) => setCurrentImage(e.target.src)}
                      />
                    </Box>
                  </Stack>
                </Flex> */}
                <Flex direction="column">
                  <Text color={textColor} fontSize="3xl" fontWeight="bold" mb="12px">
                    {eventData?.name}
                  </Text>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    Parcel
                  </Text>

                  <Text
                    color={textColor}
                    fontWeight="semi-bold"
                    fontSize="1.8xl"
                    mb="12px"
                    textDecor={'underline'}
                    cursor={'pointer'}
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`
                      )
                    }>
                    {parcel?.name}
                  </Text>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    Establishment
                  </Text>

                  <Text
                    color={textColor}
                    fontWeight="semi-bold"
                    fontSize="1.8xl"
                    mb="12px"
                    textDecor={'underline'}
                    cursor={'pointer'}
                    onClick={() => navigate(`/admin/dashboard/establishment/${establishmentId}`)}>
                    {establishment?.name}
                  </Text>

                  {/* <Badge
                    colorScheme="green"
                    w="95px"
                    h="28px"
                    mb="40px"
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    CERTIFIED
                  </Badge> */}
                  <Flex direction="column">
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Date:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {eventData?.date && new Date(eventData?.date).toLocaleDateString('en-US')}
                      </Text>
                    </Flex>

                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        City:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.city}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        State:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.state}
                      </Text>
                    </Flex>
                    {establishment?.zone && (
                      <Flex align="center" mb="10px">
                        <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                          Zone:
                        </Text>
                        <Text fontSize="md" color="gray.500" fontWeight="400">
                          {establishment?.zone}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
              <Flex px="24px" pb="24px">
                <HTMLRenderer htmlString={eventData?.description} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </BoxBackground>
  );
}

export default ProfileEstablishment;
