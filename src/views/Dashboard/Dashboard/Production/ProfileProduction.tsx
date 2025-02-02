// Chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FaRegCheckCircle, FaRegDotCircle } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BoxBackground from '../components/BoxBackground';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import TimelineRow from 'components/Tables/TimelineRow';
import { useGetHistoryQuery } from 'store/api/historyApi';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

function ProfileProduction() {
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');
  const navigate = useNavigate();
  const { establishmentId, productionId, parcelId } = useParams();
  const [establishment, setEstablishment] = useState(null);
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);

  const { data: historyData, isLoading, isError, isSuccess } = useGetHistoryQuery(productionId);

  useEffect(() => {
    let establishment;
    if (establishments) {
      establishment = establishments.filter(
        (establishment) => establishment.id.toString() === establishmentId
      )[0];
      setEstablishment(establishment);
    }
  }, [establishmentId, establishments]);

  const downloadQRCode = async () => {
    try {
      // Fetch the image
      const response = await fetch(historyData?.qr_code);
      const blob = await response.blob();

      // Create object URL
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${historyData?.product}-${new Date(
        historyData?.start_date
      ).toLocaleDateString()}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <BoxBackground
      title={intl.formatMessage({ id: 'app.productionDetail' })}
      subtitle={intl.formatMessage({
        id: 'app.hereYouCanSeeTheInformationOfTheProductionYouHaveSelected'
      })}>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px" width={'100%'}>
        <Card
          mt={{ md: '24px' }}
          maxWidth={{ sm: '100%', md: '100%', lg: '80%' }}
          px="0px"
          pt={{ sm: '16px', md: '32px', lg: '0px' }}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px">
          <CardHeader justifyContent="end">
            <Flex p="24px" align="center" justify="center">
              <Menu isOpen={isOpen1} onClose={onClose1}>
                <MenuButton onClick={onOpen1} alignSelf="flex-start">
                  <Icon as={IoEllipsisVerticalSharp} color="gray.400" w="20px" h="20px" />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${productionId}/change`
                      )
                    }>
                    <Flex color={textColor} cursor="pointer" align="center" p="4px">
                      <Text fontSize="sm" fontWeight="500">
                        {intl.formatMessage({ id: 'app.edit' })}
                      </Text>
                    </Flex>
                  </MenuItem>
                  <MenuItem>
                    <Flex color="red.500" cursor="pointer" align="center" p="4px">
                      {/* <Icon as={FaTrashAlt} me="4px" /> */}
                      <Text fontSize="sm" fontWeight="500">
                        {intl.formatMessage({ id: 'app.delete' })}
                      </Text>
                    </Flex>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </CardHeader>
          <CardBody px={{ sm: '16px', md: '32px', lg: '48px' }}>
            <Flex direction={'column'} w={'100%'}>
              <Flex direction={{ sm: 'column', lg: 'row' }} mb={{ sm: '42px', lg: '48px' }}>
                {historyData?.images.length > 0 && (
                  <ImageCarousel imagesList={historyData?.images} />
                )}
                <Flex direction="column">
                  <Text color={textColor} fontSize="3xl" fontWeight="bold" mb="12px">
                    {`${new Date(historyData?.start_date).toLocaleDateString()}-${new Date(
                      historyData?.finish_date
                    ).toLocaleDateString()}`}
                  </Text>
                  <Stack direction="row" spacing="12px" color="orange.300" mb="16px">
                    <Icon
                      as={
                        historyData?.reputation >= 1
                          ? BsStarFill
                          : historyData?.reputation > 0.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation >= 2
                          ? BsStarFill
                          : historyData?.reputation > 1.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation >= 3
                          ? BsStarFill
                          : historyData?.reputation > 2.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation >= 4
                          ? BsStarFill
                          : historyData?.reputation > 3.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation === 5
                          ? BsStarFill
                          : historyData?.reputation > 4.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                  </Stack>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    {intl.formatMessage({ id: 'app.product' })}
                  </Text>
                  <Text color={textColor} fontWeight="bold" fontSize="2xl" mb="12px">
                    {historyData?.product}
                  </Text>
                  <Badge
                    colorScheme="green"
                    w="95px"
                    h="28px"
                    mb="40px"
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {intl.formatMessage({ id: 'app.certified' })}
                  </Badge>
                  <Flex direction="column">
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.location' })}:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.location}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.establishment' })}:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.name}
                      </Text>
                    </Flex>

                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.parcel' })}:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {historyData?.parcel}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.production' })}:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {`${new Date(historyData?.start_date).toLocaleDateString()}-${new Date(
                          historyData?.finish_date
                        ).toLocaleDateString()}`}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Flex px="24px" pb="24px" direction={'column'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold" pb="24px">
                  {establishment?.name}
                </Text>
                <HTMLRenderer htmlString={establishment?.description} />
              </Flex>
              <Flex direction={{ base: 'column', lg: 'row' }}>
                <Flex px="24px" py="24px" width={{ md: '100%', lg: '50%' }} direction={'column'}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold" pb="24px">
                    {intl.formatMessage({ id: 'app.events' })}
                  </Text>
                  <Flex>
                    <Flex direction="column" width={'100%'} paddingBottom={'24px'}>
                      {historyData?.events?.map((event, index, arr) => {
                        return (
                          <TimelineRow
                            key={event.id}
                            logo={event.certified ? FaRegCheckCircle : FaRegDotCircle}
                            title={
                              event.event_type != 3
                                ? intl.formatMessage({ id: `${event.type}` })
                                : event.name
                            }
                            date={new Date(event.date).toDateString()}
                            color={event.certified ? 'green.300' : 'blue.400'}
                            index={index}
                            arrLength={arr.length}
                            isLast={index === arr.length - 1}
                            onClick={() =>
                              navigate(
                                `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/${event.id}`
                              )
                            }
                          />
                        );
                      })}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  px="24px"
                  py="24px"
                  maxW={'400px'}
                  w="50%"
                  direction={'column'}
                  align="center"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderRadius="2xl"
                  boxShadow="xl"
                  position="relative"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}>
                  <Flex direction="column" align="center" mb={6}>
                    <Text fontSize="2xl" color={textColor} fontWeight="bold" mb={2}>
                      {intl.formatMessage({ id: 'app.qrCode' })}
                    </Text>
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      {intl.formatMessage({ id: 'app.scanToViewDetails' })}
                    </Text>
                  </Flex>

                  <Box
                    position="relative"
                    borderRadius="2xl"
                    overflow="hidden"
                    boxShadow="2xl"
                    bg={useColorModeValue('white', 'gray.800')}
                    p={8}
                    transition="all 0.3s ease"
                    _hover={{ transform: 'scale(1.02)' }}>
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      opacity={0.5}
                      filter="blur(40px)"
                      transform="translate(0, 20px)"
                      borderRadius="2xl"
                      zIndex={0}
                    />

                    <Box position="relative" zIndex={1}>
                      <Image
                        src={historyData?.qr_code}
                        alt="QR Code"
                        w="300px"
                        h="300px"
                        objectFit="contain"
                        quality={100}
                        filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))"
                      />
                    </Box>

                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      opacity={0}
                      transition="all 0.3s ease"
                      _hover={{ opacity: 1 }}
                      bg="blackAlpha.50"
                      backdropFilter="blur(4px)"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="2xl">
                      <Button
                        leftIcon={<Icon as={FiDownload} />}
                        colorScheme="green"
                        size="lg"
                        onClick={downloadQRCode}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg'
                        }}
                        _active={{
                          transform: 'translateY(0)'
                        }}>
                        {intl.formatMessage({ id: 'app.downloadQRCode' })}
                      </Button>
                    </Flex>
                  </Box>

                  <VStack spacing={4} mt={6}>
                    <Badge
                      colorScheme="green"
                      px={4}
                      py={2}
                      borderRadius="full"
                      fontSize="md"
                      textTransform="none"
                      boxShadow="sm"
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'md'
                      }}>
                      {historyData?.product}
                    </Badge>

                    <Text fontSize="xs" color="gray.500" textAlign="center" maxW="80%">
                      {`ID: ${productionId}`}
                    </Text>
                  </VStack>
                </Flex>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </BoxBackground>
  );
}

export default ProfileProduction;
