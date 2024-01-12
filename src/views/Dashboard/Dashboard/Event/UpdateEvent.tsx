import BoxBackground from '../components/BoxBackground';
import EditEvent from '../components/forms/EditEvent';
// Chakra imports
import { Flex } from '@chakra-ui/react';
import NewEvent from '../components/forms/NewEvent';

function UpdateEvent({ isEdit = false }) {
  return (
    <BoxBackground
      title={isEdit ? 'Edit the selected Event' : 'Add a new Event'}
      subtitle={
        isEdit
          ? 'Modify the form below to edit the selected event.'
          : 'Complete the form below to add a new event to your parcel history.'
      }>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        {isEdit ? <EditEvent /> : <NewEvent />}
      </Flex>
    </BoxBackground>
  );
}

export default UpdateEvent;
