import EditEvent from '../components/forms/EditEvent';
// Chakra imports
import { Box } from '@chakra-ui/react';
import NewEvent from '../components/forms/NewEvent';

function UpdateEvent({ isEdit = false }) {
  return <Box>{isEdit ? <EditEvent /> : <NewEvent />}</Box>;
}

export default UpdateEvent;
