import BoxBackground from '../components/BoxBackground';
import EditEstablishment from '../components/forms/EditEstablishment';
import NewEstablishment from '../components/forms/NewEstablishment';

function AddEstablishment({ isEdit = false }) {
  return (
    <BoxBackground
      title={isEdit ? 'Edit the selected Establishment' : 'Add a new Establishment'}
      subtitle={
        isEdit
          ? 'Modify the form below to edit the selected establishment.'
          : 'Complete the form below to add a new establishment to your company.'
      }>
      {isEdit ? <EditEstablishment /> : <NewEstablishment />}
    </BoxBackground>
  );
}

export default AddEstablishment;
