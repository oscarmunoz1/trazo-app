import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { StandardFinishProductionForm } from '../../../../components/Forms';
import { useFinishCurrentHistoryMutation } from 'store/api/historyApi.js';

function FinishProduction() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { parcelId, establishmentId, productionId } = useParams();
  const currentCompany = useSelector((state: any) => state.company.currentCompany);

  const [finishCurrentHistory, { isLoading, isSuccess }] = useFinishCurrentHistoryMutation();

  const handleSubmit = (data: any) => {
    finishCurrentHistory({
      companyId: currentCompany?.id,
      establishmentId,
      parcelId: parcelId,
      historyData: {
        ...data,
        album: {
          images: data.images
        }
      }
    });
  };

  const handleCancel = () => {
    navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
  };

  // Handle successful submission
  React.useEffect(() => {
    if (isSuccess) {
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
    }
  }, [isSuccess, navigate, establishmentId, parcelId]);

  return (
    <StandardFinishProductionForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

export default FinishProduction;
