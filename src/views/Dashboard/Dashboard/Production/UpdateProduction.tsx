import BoxBackground from '../components/BoxBackground';
import EditProduction from '../components/forms/EditProduction';
// Chakra imports
import { Flex } from '@chakra-ui/react';
import NewProduction from '../components/forms/NewProduction';

type UpdateProductionProps = {
  isEdit: boolean;
};

function UpdateProduction(props: UpdateProductionProps) {
  const { isEdit } = props;
  return (
    <BoxBackground
      title={isEdit ? 'Edit the selected Production' : 'Add a new Production'}
      subtitle={
        isEdit
          ? 'Modify the form below to edit the selected production.'
          : 'Complete the form below to start a new production on your parcel.'
      }>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        {isEdit ? <EditProduction /> : <NewProduction />}
      </Flex>
    </BoxBackground>
  );
}

export default UpdateProduction;
