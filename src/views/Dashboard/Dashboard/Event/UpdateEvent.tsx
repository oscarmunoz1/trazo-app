import BoxBackground from '../components/BoxBackground';
import EditEvent from '../components/forms/EditEvent';
// Chakra imports
import { Flex } from '@chakra-ui/react';
import NewEvent from '../components/forms/NewEvent';
import { useIntl } from 'react-intl';

function UpdateEvent({ isEdit = false }) {
  const intl = useIntl();
  return (
    <BoxBackground
      title={isEdit ? intl.formatMessage({ id: 'app.editEvent' }) : intl.formatMessage({ id: 'app.addNewEvent' })}
      subtitle={
        isEdit
          ? intl.formatMessage({ id: 'app.editEventDescription' })
          : intl.formatMessage({ id: 'app.addNewEventDescription' })
      }>
      {isEdit ? <EditEvent /> : <NewEvent />}
    </BoxBackground>
  );
}

export default UpdateEvent;
