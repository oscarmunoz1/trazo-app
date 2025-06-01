import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StandardProductionForm } from '../../../../components/Forms/StandardProductionForm';
// @ts-ignore: JS module in TS file
import { useCreateProductionMutation } from 'store/api/historyApi';
// @ts-ignore: JS module in TS file
import { useGetEstablishmentProductsQuery } from 'store/api/productApi.js';
import BoxBackground from '../components/BoxBackground';
// @ts-ignore: JSX component in TS file
import EditProduction from '../components/forms/EditProduction';

type UpdateProductionProps = {
  isEdit: boolean;
};

function UpdateProduction(props: UpdateProductionProps) {
  const intl = useIntl();
  const { isEdit } = props;
  const navigate = useNavigate();
  const { establishmentId, parcelId } = useParams();
  const currentCompany = useSelector((state: any) => state.company.currentCompany);
  const currentParcel = useSelector((state: any) => state.company.currentParcel);
  const [productOptions, setProductOptions] = useState([]);

  // @ts-ignore: Mutation hook
  const [createProduction, { isLoading }] = useCreateProductionMutation();

  // Get products for the establishment
  const { data: dataProducts, isSuccess: isSuccessProducts } = useGetEstablishmentProductsQuery(
    {
      companyId: currentCompany?.id,
      establishmentId
    },
    {
      skip: !establishmentId || !currentCompany || currentCompany?.id === undefined
    }
  );

  useEffect(() => {
    if (isSuccessProducts && dataProducts) {
      setProductOptions(
        dataProducts.map((product: any) => ({
          value: product.id,
          label: product.name
        }))
      );
    }
  }, [isSuccessProducts, dataProducts]);

  // @ts-ignore: Form data parameter
  const handleSubmit = async (data) => {
    try {
      const productionData = {
        date: data.date,
        type: data.type,
        is_outdoor: data.isOutdoor,
        age_of_plants: data.ageOfPlants,
        number_of_plants: data.numberOfPlants,
        soil_ph: data.soilPh,
        observation: data.observation,
        product: {
          id: data.productId,
          name: data.productName,
          isNew: data.productId.startsWith('new_')
        },
        parcel: parseInt(parcelId!)
      };

      const result = await createProduction(productionData).unwrap();

      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`);
    } catch (error) {
      console.error('Failed to create production:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`);
  };

  if (isEdit) {
    return (
      <BoxBackground
        title={intl.formatMessage({ id: 'app.editProduction' })}
        subtitle={intl.formatMessage({ id: 'app.editProductionDescription' })}>
        <EditProduction />
      </BoxBackground>
    );
  }

  return (
    <StandardProductionForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      parcelName={currentParcel?.name || ''}
      productOptions={productOptions}
    />
  );
}

export default UpdateProduction;
