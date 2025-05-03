import BoxBackground from '../components/BoxBackground';
import EditParcel from '../components/forms/EditParcel';
import NewParcel from '../components/forms/NewParcel';
import { useIntl } from 'react-intl';
function AddParcel({ isEdit = false }) {
  const intl = useIntl();
  return (
    <BoxBackground
      title={
        isEdit
          ? intl.formatMessage({ id: 'app.editParcel' })
          : intl.formatMessage({ id: 'app.addParcel' })
      }
      subtitle={
        isEdit
          ? intl.formatMessage({ id: 'app.editParcelSubtitle' })
          : intl.formatMessage({ id: 'app.addParcelSubtitle' })
      }
      hideBanner={true}>
      {isEdit ? <EditParcel /> : <NewParcel />}
    </BoxBackground>
  );
}

export default AddParcel;
