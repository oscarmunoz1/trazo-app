// Chakra imports
import {
  Badge,
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
  useDisclosure
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FaRegCheckCircle, FaRegDotCircle } from 'react-icons/fa';
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

function ProfileProduction() {
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

  return (
    <BoxBackground
      title={'Production Detail'}
      subtitle={'Here you can see the information of the production you have selected.'}>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
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
                      navigate(`/admin/dashboard/establishment/${establishmentId}/change`)
                    }>
                    <Flex color={textColor} cursor="pointer" align="center" p="4px">
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
                <ImageCarousel imagesList={historyData?.images} />
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
                    Product
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
                    CERTIFIED
                  </Badge>
                  <Flex direction="column">
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Location:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.location}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Establishment:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.name}
                      </Text>
                    </Flex>

                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Parcel:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {historyData?.parcel}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Production:{' '}
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
              <Flex>
                <Flex px="24px" py="24px" width={{ md: '100%', lg: '50%' }} direction={'column'}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold" pb="24px">
                    Events
                  </Text>
                  <Flex>
                    <Flex direction="column" width={'100%'} paddingBottom={'24px'}>
                      {historyData?.events?.map((event, index, arr) => {
                        return (
                          <TimelineRow
                            key={event.id}
                            logo={event.certified ? FaRegCheckCircle : FaRegDotCircle}
                            title={event.type}
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
                <Flex px="24px" py="24px" width={'400px'} height={'400px'} direction={'column'}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold" pb="24px">
                    QR Code
                  </Text>
                  <Image src={historyData?.qr_code} alt="illustration" />
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
