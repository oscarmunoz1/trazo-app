import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast, Box, Text } from '@chakra-ui/react';
import { StandardProductionForm } from '../../../../components/Forms/StandardProductionForm';
import {
  useCreateProductionMutation,
  useUpdateProductionMutation,
  useGetHistoryQuery
} from 'store/api/historyApi';
import { useGetEstablishmentProductsQuery } from 'store/api/productApi';

interface UpdateProductionProps {
  isEdit?: boolean;
}

interface RootState {
  company: {
    currentCompany: any;
    currentParcel: any;
  };
}

function UpdateProduction({ isEdit = false }: UpdateProductionProps) {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const { establishmentId, parcelId, productionId } = useParams();
  const currentCompany = useSelector((state: RootState) => state.company.currentCompany);
  const currentParcel = useSelector((state: RootState) => state.company.currentParcel);
  const [productOptions, setProductOptions] = useState<Array<{ value: string; label: string }>>([]);

  // RTK Query hooks following the working pattern from NewProduction.tsx
  const [createProduction, { isLoading: isCreating }] = useCreateProductionMutation();
  const [updateProduction, { isLoading: isUpdating }] = useUpdateProductionMutation();

  // Get production data for edit mode
  const {
    data: productionData,
    isLoading: isLoadingProduction,
    isError: isProductionError
  } = useGetHistoryQuery(productionId || '', {
    skip: !isEdit || !productionId
  });

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
          value: product.id.toString(),
          label: product.name
        }))
      );
    }
  }, [isSuccessProducts, dataProducts]);

  // Re-trigger form initialization when productOptions are loaded
  // This is needed because the API returns product as a string name,
  // and we need productOptions to map it to an ID
  const [formInitialized, setFormInitialized] = useState(false);
  useEffect(() => {
    if (isEdit && productionData && productOptions.length > 0 && !formInitialized) {
      console.log('Re-initializing form with product options available');
      setFormInitialized(true);
      // The form will automatically re-render with updated getInitialData()
    }
  }, [isEdit, productionData, productOptions, formInitialized]);

  // Debug effect to log when things are ready
  useEffect(() => {
    console.log('Data readiness check:', {
      isEdit,
      hasProductionData: !!productionData,
      hasProductOptions: productOptions.length > 0,
      productionDataProduct: productionData?.product,
      productOptionsCount: productOptions.length,
      isLoadingProduction,
      isSuccessProducts,
      formInitialized,
      canInitializeForm: isEdit && productionData && productOptions.length > 0
    });
  }, [
    isEdit,
    productionData,
    productOptions,
    isLoadingProduction,
    isSuccessProducts,
    formInitialized
  ]);

  // Helper function to parse age of plants
  const parseAgeOfPlants = (value: any) => {
    if (!value) return 0;

    // If it's already a number, return it
    if (typeof value === 'number') return value;

    // If it's a string, try to extract the numeric value
    if (typeof value === 'string') {
      // Remove any non-numeric characters except decimal point
      const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));

      // If the string contains "year", convert years to days (assuming 365 days per year)
      if (value.toLowerCase().includes('year')) {
        return Math.round(numericValue * 365);
      }

      // If it contains "month", convert months to days (assuming 30 days per month)
      if (value.toLowerCase().includes('month')) {
        return Math.round(numericValue * 30);
      }

      // Otherwise, assume it's already in days
      return numericValue || 0;
    }

    return 0;
  };

  // Format production data for form
  const getInitialData = () => {
    if (!isEdit || !productionData) {
      console.log('Not in edit mode or no production data:', { isEdit, productionData });
      return {};
    }

    console.log('Raw production data received:', productionData);
    console.log('Product data structure:', {
      hasProduct: !!productionData.product,
      productData: productionData.product,
      productType: typeof productionData.product
    });
    console.log('Age of plants data:', {
      rawValue: productionData.age_of_plants,
      type: typeof productionData.age_of_plants
    });

    // Handle different possible data structures
    let productId = '';
    let productName = '';

    if (productionData.product) {
      if (typeof productionData.product === 'object' && productionData.product.id) {
        // Product is an object with id and name
        productId = productionData.product.id?.toString() || '';
        productName = productionData.product.name || '';
      } else if (typeof productionData.product === 'string') {
        // Product is just a string name - need to find the ID from productOptions
        productName = productionData.product;
        const foundProduct = productOptions.find((opt) => opt.label === productName);
        productId = foundProduct?.value || '';

        console.log('Product string mapping:', {
          productNameFromAPI: productName,
          foundProduct,
          resultingProductId: productId
        });
      } else if (typeof productionData.product === 'number') {
        // Product is just an ID number
        productId = productionData.product.toString();
        const foundProduct = productOptions.find((opt) => opt.value === productId);
        productName = foundProduct?.label || '';
      }
    }

    const initialData = {
      productId,
      productName,
      date: productionData.start_date
        ? new Date(productionData.start_date).toISOString().slice(0, 16)
        : '',
      type: productionData.type || 'OR',
      isOutdoor: productionData.is_outdoor !== false, // Default to true if not specified
      ageOfPlants: parseAgeOfPlants(productionData.age_of_plants), // Handle different formats
      numberOfPlants: parseInt(productionData.number_of_plants) || 0, // Ensure it's an integer
      soilPh: parseFloat(productionData.soil_ph) || 7.0, // Ensure it's a number
      observation: productionData.observation || ''
    };

    console.log('Formatted initial form data:', initialData);
    console.log('Product field values:', {
      productId: initialData.productId,
      productName: initialData.productName,
      willSetSelectedProduct: !!(initialData.productId && initialData.productName)
    });

    return initialData;
  };

  const handleSubmit = async (data: any) => {
    try {
      console.log('Form submission data:', data);
      console.log('Production ID from params:', productionId);
      console.log('Is edit mode:', isEdit);

      const productionPayload = {
        start_date: data.date,
        finish_date: productionData?.finish_date || null, // Preserve existing finish_date if any
        type: data.type,
        is_outdoor: data.isOutdoor,
        age_of_plants: data.ageOfPlants || 0,
        number_of_plants: data.numberOfPlants || 0,
        soil_ph: data.soilPh || 7.0,
        observation: data.observation || '',
        product: {
          id: data.productId,
          name: data.productName,
          isNew: data.productId?.startsWith('new_')
        },
        parcel: parseInt(parcelId!)
      };

      console.log('Production payload:', productionPayload);

      if (isEdit && productionId) {
        console.log('Calling updateProduction with historyId:', productionId);

        await updateProduction({
          historyId: productionId,
          ...productionPayload
        }).unwrap();

        toast({
          title: intl.formatMessage({ id: 'app.success' }) || 'Success',
          description:
            intl.formatMessage({ id: 'app.productionUpdated' }) ||
            'Production updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        console.log('Calling createProduction');

        await createProduction(productionPayload).unwrap();

        toast({
          title: intl.formatMessage({ id: 'app.success' }) || 'Success',
          description:
            intl.formatMessage({ id: 'app.productionCreated' }) ||
            'Production created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }

      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`);
    } catch (error) {
      console.error('Failed to save production:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }) || 'Error',
        description: isEdit
          ? intl.formatMessage({ id: 'app.failedToUpdateProduction' }) ||
            'Failed to update production'
          : intl.formatMessage({ id: 'app.failedToCreateProduction' }) ||
            'Failed to create production',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleCancel = () => {
    if (isEdit && productionId) {
      navigate(
        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${productionId}`
      );
    } else {
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`);
    }
  };

  // Show loading state for edit mode
  if (isEdit && isLoadingProduction) {
    return (
      <Box p={8} textAlign="center">
        <Text>Loading production data...</Text>
      </Box>
    );
  }

  // Show error state for edit mode
  if (isEdit && productionData && productionData.error) {
    return (
      <Box p={8} textAlign="center">
        <Text color="red.500">Error loading production data. Please try again.</Text>
      </Box>
    );
  }

  // Don't render the form until we have the production data in edit mode
  if (isEdit && !productionData) {
    return (
      <Box p={8} textAlign="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <StandardProductionForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      initialData={getInitialData()}
      isLoading={isCreating || isUpdating}
      isEdit={isEdit}
      parcelName={currentParcel?.name || ''}
      productOptions={productOptions}
    />
  );
}

export default UpdateProduction;
