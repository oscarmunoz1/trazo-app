import BoxBackground from '../components/BoxBackground';
import EditParcel from '../components/forms/EditParcel';
import NewParcel from '../components/forms/NewParcel';

function AddParcel({ isEdit = false }) {
  return (
    <BoxBackground
      title={isEdit ? 'Edit the selected Parcel' : 'Add a new Parcel'}
      subtitle={
        isEdit
          ? 'Modify the form below to edit the selected parcel.'
          : 'Complete the form below to add a new parcel to your establishment.'
      }>
      {isEdit ? <EditParcel /> : <NewParcel />}
    </BoxBackground>
  );
}

export default AddParcel;
