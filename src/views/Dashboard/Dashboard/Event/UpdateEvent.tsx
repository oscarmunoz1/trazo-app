// Chakra imports
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
// Component imports
// @ts-ignore
import NewEventComponent from '../components/forms/NewEvent';

interface UpdateEventProps {
  isEdit?: boolean;
}

function UpdateEvent({ isEdit = false }: UpdateEventProps) {
  const { eventId } = useParams();
  const NewEvent = NewEventComponent as React.ComponentType<any>;

  return (
    <Box>
      <NewEvent isEdit={isEdit} eventId={eventId} />
    </Box>
  );
}

export default UpdateEvent;
