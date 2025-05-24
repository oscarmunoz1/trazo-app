// Chakra imports
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BoxBackground from '../components/BoxBackground';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { useGetParcelQuery } from 'store/api/productApi';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

function ProfileEstablishment() {
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');
  const navigate = useNavigate();
  const { establishmentId, parcelId } = useParams();
  const [establishment, setEstablishment] = useState(null);
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const currentParcel = useSelector((state) => state.product.currentParcel);

  const {
    data: parcelData,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetParcelQuery(
    { companyId: currentCompany?.id, establishmentId, parcelId },
    {
      skip:
        parcelId === undefined ||
        currentParcel?.id === parcelId ||
        currentCompany?.id === undefined ||
        !establishmentId
    }
  );

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
      title={intl.formatMessage({ id: 'app.parcelProfile' })}
      subtitle={intl.formatMessage({ id: 'app.hereYouCanSeeTheInformationOfYourParcel' })}
    >
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px" w={'100%'}>
        <Card
          mt={{ md: '24px' }}
          maxWidth={{ sm: '100%', md: '100%', lg: '80%' }}
          px="0px"
          pt={{ sm: '16px', md: '32px', lg: '0px' }}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px"
        >
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
                        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/change`
                      )
                    }
                  >
                    <Flex color={textColor} cursor="pointer" align="center" p="4px">
                      <Text fontSize="sm" fontWeight="500">
                        {intl.formatMessage({ id: 'app.edit' })}
                      </Text>
                    </Flex>
                  </MenuItem>
                  <MenuItem>
                    <Flex color="red.500" cursor="pointer" align="center" p="4px">
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
            <Flex direction={'column'}>
              <Flex direction={{ sm: 'column', lg: 'row' }} mb={{ sm: '42px', lg: '48px' }}>
                <ImageCarousel imagesList={parcelData?.images} />

                <Flex direction="column">
                  <Text color={textColor} fontSize="3xl" fontWeight="bold" mb="12px">
                    {parcelData?.name}
                  </Text>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    {intl.formatMessage({ id: 'app.company' })}
                  </Text>
                  <Text color={textColor} fontWeight="bold" fontSize="2xl" mb="12px">
                    {currentCompany?.name}
                  </Text>

                  <Flex direction="column">
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.address' })}:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.address}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.area' })}:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {parcelData?.area}
                      </Text>
                    </Flex>

                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.city' })}:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.city}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.state' })}:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishment?.state}
                      </Text>
                    </Flex>
                    {establishment?.zone && (
                      <Flex align="center" mb="10px">
                        <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                          {intl.formatMessage({ id: 'app.zone' })}:
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
                <HTMLRenderer htmlString={parcelData?.description} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </BoxBackground>
  );
}

export default ProfileEstablishment;
