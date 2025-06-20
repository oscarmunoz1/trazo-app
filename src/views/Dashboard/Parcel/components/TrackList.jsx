// Chakra imports
import {
  Button,
  CircularProgress,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  HStack,
  Box,
  Badge,
  Divider,
  Tooltip,
  ButtonGroup
} from '@chakra-ui/react';
import {
  FaRegCheckCircle,
  FaRegDotCircle,
  FaClock,
  FaMicrophone,
  FaPlus,
  FaPlay,
  FaFlag,
  FaMobile,
  FaSeedling,
  FaChartLine,
  FaChevronDown,
  FaLeaf,
  FaCamera
} from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import TimelineRow from 'components/Tables/TimelineRow';
import { setCurrentHistory } from 'store/features/historySlice';
import { useGetCurrentHistoryQuery } from 'store/api/historyApi';
import { useIntl } from 'react-intl';
import QuickAddEvent from 'views/Dashboard/Dashboard/Production/QuickAddEvent';
import { EventDetailsModal } from 'components/Modals/EventDetailsModal';

// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';
import CardHeader from 'components/Card/CardHeader.tsx';

const TrackList = ({ amount }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const intl = useIntl();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFinishModal,
    onOpen: onOpenFinishModal,
    onClose: onCloseFinishModal
  } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentHistory = useSelector((state) => state.history.currentHistory);
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { establishmentId, parcelId } = useParams();

  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const {
    isOpen: isQuickAddOpen,
    onOpen: onQuickAddOpen,
    onClose: onQuickAddClose
  } = useDisclosure();
  const {
    isOpen: isAddEventMenuOpen,
    onOpen: onAddEventMenuOpen,
    onClose: onAddEventMenuClose
  } = useDisclosure();

  // Event Details Modal state
  const {
    isOpen: isEventDetailsOpen,
    onOpen: onEventDetailsOpen,
    onClose: onEventDetailsClose
  } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data, error, isLoading, isFetching, refetch } = useGetCurrentHistoryQuery(
    {
      companyId: currentCompany?.id,
      establishmentId,
      parcelId: parcelId || ''
    },
    {
      skip: !parcelId || !currentCompany || !establishmentId || currentCompany?.id === undefined
    }
  );

  useEffect(() => {
    if (data) dispatch(setCurrentHistory(data));
  }, [data]);

  const bgButton = useColorModeValue(
    'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
    'gray.800'
  );

  const handleEventCreated = () => {
    // Refetch the current history data to show the new event
    refetch();
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    onEventDetailsOpen();
  };

  const handleEventUpdated = () => {
    refetch();
    onEventDetailsClose();
  };

  const handleEventDeleted = () => {
    refetch();
    onEventDetailsClose();
  };

  return (
    <Card maxH="100%" height={'fit-content;'} minW="390px">
      <CardHeader p="0px 0px 35px 0px">
        <Flex direction="column" w="100%">
          <Flex p="0px" align="center" justify="space-between">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              {intl.formatMessage({ id: 'app.currentProduction' })}
            </Text>
            <Menu isOpen={isOpen1} onClose={onClose1}>
              <MenuButton
                onClick={onOpen1}
                alignSelf="flex-start"
                disabled={!currentHistory?.product}
                cursor={!currentHistory?.product ? 'default' : 'pointer'}>
                <Icon as={IoEllipsisVerticalSharp} color="gray.400" w="20px" h="20px" />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() =>
                    navigate(
                      `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${currentHistory?.id}/change`
                    )
                  }>
                  <Flex color={textColor} cursor="pointer" align="center" p="4px">
                    {/* <Icon as={FaPencilAlt} me="4px" /> */}
                    <Text fontSize="sm" fontWeight="500">
                      {intl.formatMessage({ id: 'app.edit' }).toUpperCase()}
                    </Text>
                  </Flex>
                </MenuItem>
                <MenuItem>
                  <Flex color="red.500" cursor="pointer" align="center" p="4px">
                    {/* <Icon as={FaTrashAlt} me="4px" /> */}
                    <Text fontSize="sm" fontWeight="500">
                      {intl.formatMessage({ id: 'app.delete' }).toUpperCase()}
                    </Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex direction="column">
            {currentHistory?.product && (
              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                {intl.formatMessage({ id: 'app.theProductionOf' })}{' '}
                <Text fontWeight="bold" as="span" color="green.300">
                  {`${currentHistory?.product}`}{' '}
                </Text>
                {intl.formatMessage({ id: 'app.hasBeenStarted' })}{' '}
                <Text fontWeight="bold" as="span" color="green.300">
                  {`${new Date(currentHistory?.start_date).toLocaleDateString('en-US')}`}{' '}
                </Text>
              </Text>
            )}
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody ps="20px" pe="0px" mb="31px" position="relative">
        <Flex direction="column" width={'100%'}>
          {isLoading ? (
            <Flex width={'100%'} height={'120px'} justifyContent={'center'} alignItems="center">
              <CircularProgress isIndeterminate value={1} color="green.300" size="25px" />
            </Flex>
          ) : (
            <>
              {currentHistory?.events?.map((event, index, arr) => {
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
                    url={`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/${event.id}?event_type=${event.event_type}`}
                    event={event}
                    members={currentHistory?.members || []}
                    isLast={index === arr.length - 1}
                    onEventClick={() => handleEventClick(event)}
                  />
                );
              })}
              {!currentHistory?.events?.length > 0 && (
                <Flex width={'100%'} height={'70px'}>
                  <Text
                    display={'flex'}
                    fontSize={'md'}
                    fontWeight={'300'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    textAlign={'center'}>
                    {currentHistory?.product
                      ? intl.formatMessage({ id: 'app.noEventsYet' })
                      : intl.formatMessage({ id: 'app.noProductionYet' })}
                  </Text>
                </Flex>
              )}
            </>
          )}
        </Flex>
      </CardBody>
      {/* Modern Action Buttons - Single Add Event Dropdown */}
      <Flex
        justify="flex-end"
        gap={3}
        p="20px"
        borderTop="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        bg={useColorModeValue('gray.50', 'gray.700')}>
        {!currentHistory?.product ? (
          <Button
            bg={bgButton}
            color="white"
            fontSize="sm"
            fontWeight="bold"
            variant="no-hover"
            minW="160px"
            h="44px"
            borderRadius="12px"
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: 'lg'
            }}
            transition="all 0.2s"
            onClick={() =>
              navigate(
                `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/add`
              )
            }>
            {intl.formatMessage({ id: 'app.startProduction' }).toUpperCase()}
          </Button>
        ) : (
          <Flex gap={3} justify="flex-end" align="center" w="100%" flexFlow={'wrap'}>
            {/* Primary Add Event Dropdown Button */}
            <Menu isOpen={isAddEventMenuOpen} onClose={onAddEventMenuClose}>
              <MenuButton
                as={Button}
                leftIcon={<Icon as={FaPlus} />}
                rightIcon={<Icon as={FaChevronDown} />}
                bg={bgButton}
                color="white"
                fontSize="sm"
                fontWeight="semibold"
                variant="no-hover"
                minW="140px"
                h="44px"
                borderRadius="12px"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg'
                }}
                _active={{
                  transform: 'translateY(0px)',
                  boxShadow: 'md'
                }}
                transition="all 0.2s"
                onClick={onAddEventMenuOpen}>
                {intl.formatMessage({ id: 'app.addEvent' })}
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.800')}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                borderRadius="12px"
                boxShadow="xl"
                py="8px"
                minW="220px">
                {/* Carbon Focus Header - NEW */}
                <Box
                  px="16px"
                  py="8px"
                  borderBottom="1px solid"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}>
                  <HStack>
                    <Icon as={FaLeaf} color="green.500" boxSize={3} />
                    <Text fontSize="xs" fontWeight="bold" color="green.600">
                      CARBON TRACKING
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Events visible to consumers via QR
                  </Text>
                </Box>

                <MenuItem
                  icon={<Icon as={FaMicrophone} color="green.500" />}
                  fontSize="sm"
                  width={'96%'}
                  fontWeight="medium"
                  py="12px"
                  px="16px"
                  borderRadius="8px"
                  mx="4px"
                  mt="4px"
                  _hover={{
                    bg: useColorModeValue('green.50', 'green.900'),
                    color: useColorModeValue('green.700', 'green.200')
                  }}
                  onClick={() => {
                    onAddEventMenuClose();
                    onQuickAddOpen();
                  }}>
                  <VStack align="start" spacing={0} flex={1}>
                    <HStack justify="space-between" width="100%">
                      <Text fontWeight="semibold">Voice Event</Text>
                      <Badge colorScheme="green" size="xs">
                        FASTEST
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      "Applied fertilizer, 200 lbs/acre"
                    </Text>
                  </VStack>
                </MenuItem>

                <MenuItem
                  icon={<Icon as={FaMobile} color="blue.500" />}
                  fontSize="sm"
                  fontWeight="medium"
                  width={'96%'}
                  py="12px"
                  px="16px"
                  borderRadius="8px"
                  mx="4px"
                  _hover={{
                    bg: useColorModeValue('blue.50', 'blue.900'),
                    color: useColorModeValue('blue.700', 'blue.200')
                  }}
                  onClick={() => {
                    onAddEventMenuClose();
                    navigate(
                      `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${currentHistory?.id}/mobile`
                    );
                  }}>
                  <VStack align="start" spacing={0} flex={1}>
                    <HStack justify="space-between" width="100%">
                      <Text fontWeight="semibold">Mobile Interface</Text>
                      <Badge colorScheme="blue" size="xs">
                        FIELD
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Touch-friendly field interface
                    </Text>
                  </VStack>
                </MenuItem>

                <MenuItem
                  icon={<Icon as={FaPlus} color="gray.600" />}
                  fontSize="sm"
                  fontWeight="medium"
                  width={'96%'}
                  py="12px"
                  px="16px"
                  borderRadius="8px"
                  mx="4px"
                  _hover={{
                    bg: useColorModeValue('gray.50', 'gray.700'),
                    color: useColorModeValue('gray.700', 'gray.200')
                  }}
                  onClick={() => {
                    onAddEventMenuClose();
                    navigate(
                      `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/add`
                    );
                  }}>
                  <VStack align="start" spacing={0} flex={1}>
                    <HStack justify="space-between" width="100%">
                      <Text fontWeight="semibold">Manual Entry</Text>
                      <Badge colorScheme="gray" size="xs">
                        DETAILED
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Full form with all details
                    </Text>
                  </VStack>
                </MenuItem>

                {/* Carbon Impact Footer - NEW */}
                <Box
                  px="16px"
                  py="8px"
                  mt="4px"
                  borderTop="1px solid"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}>
                  <HStack>
                    <Icon as={FaCamera} color="blue.400" boxSize={3} />
                    <Text fontSize="xs" color="gray.600">
                      All events appear on consumer QR scans
                    </Text>
                  </HStack>
                </Box>
              </MenuList>
            </Menu>

            {/* Finish Production Button - Only show if there are events */}
            {currentHistory?.events && currentHistory?.events.length > 0 && (
              <Button
                leftIcon={<Icon as={FaFlag} />}
                variant="outline"
                colorScheme="green"
                fontSize="sm"
                fontWeight="semibold"
                minW="160px"
                h="44px"
                borderRadius="12px"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'md'
                }}
                transition="all 0.2s"
                onClick={() =>
                  navigate(
                    `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${currentHistory?.id}/finish`
                  )
                }>
                {intl.formatMessage({ id: 'app.finishProduction' })}
              </Button>
            )}
          </Flex>
        )}
      </Flex>

      {/* Week 2 Task 2.1: Voice-to-Event System Integration */}
      <QuickAddEvent
        isOpen={isQuickAddOpen}
        onClose={onQuickAddClose}
        cropType={currentHistory?.product || 'citrus'}
        onEventAdded={(eventData) => {
          console.log('New event added from parcel dashboard:', eventData);
          handleEventCreated();
        }}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventDetailsOpen}
        onClose={onEventDetailsClose}
        event={selectedEvent}
        members={currentHistory?.members || []}
        onEventUpdated={handleEventUpdated}
        onEventDeleted={handleEventDeleted}
      />
    </Card>
  );
};

export default TrackList;
