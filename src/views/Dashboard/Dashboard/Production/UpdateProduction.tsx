import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast, Box, Text } from '@chakra-ui/react';
import { StandardProductionForm } from '../../../../components/Forms/StandardProductionForm';
import { useGetPublicHistoryQuery } from 'store/api/historyApi';
import { useStartProductionMutation } from 'store/api/companyApi';

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

  // RTK Query hooks - using startProduction for create operations
  const [startProduction, { isLoading: isStarting }] = useStartProductionMutation();

  // Get production data for edit mode
  const {
    data: productionData,
    isLoading: isLoadingProduction,
    isError: isProductionError
  } = useGetPublicHistoryQuery(productionId || '', {
    skip: !isEdit || !productionId
  });

  // Get products for the establishment - simplified approach
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    // For now, we'll use a simple product list since the productApi import has issues
    // In production, this would fetch from the establishment's product catalog
    const defaultProducts = [
      { value: '1', label: 'Orange' },
      { value: '2', label: 'Apple' },
      { value: '3', label: 'Tomato' },
      { value: '4', label: 'Lettuce' },
      { value: '5', label: 'Corn' },
      { value: '6', label: 'Basil' },
      { value: '7', label: 'Bean' },
      { value: '8', label: 'Almond' }
    ];
    setProductOptions(defaultProducts);
    setProductsLoaded(true);
  }, []);

  // Re-trigger form initialization when productOptions are loaded
  const [formInitialized, setFormInitialized] = useState(false);
  useEffect(() => {
    if (isEdit && productionData && productOptions.length > 0 && !formInitialized) {
      console.log('Re-initializing form with product options available');
      setFormInitialized(true);
    }
  }, [isEdit, productionData, productOptions, formInitialized]);

  // Helper function to parse age of plants
  const parseAgeOfPlants = (value: any) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
      if (value.toLowerCase().includes('year')) {
        return Math.round(numericValue * 365);
      }
      if (value.toLowerCase().includes('month')) {
        return Math.round(numericValue * 30);
      }
      return numericValue || 0;
    }
    return 0;
  };

  // Format production data for form - simplified for create mode
  const getInitialData = () => {
    if (!isEdit) {
      return {
        type: 'OR',
        isOutdoor: true,
        enableBlockchain: true,
        productionMethod: 'conventional',
        irrigationMethod: 'drip'
      };
    }

    if (!productionData) {
      return {};
    }

    // For edit mode, extract what we can from the productionData
    const productName = productionData.product?.name || productionData.name || '';
    const foundProduct = productOptions.find((opt) => opt.label === productName);

    return {
      productId: foundProduct?.value || '',
      productName: productName,
      date: productionData.start_date
        ? new Date(productionData.start_date).toISOString().slice(0, 16)
        : '',
      type: 'OR', // Default since we don't have this in PublicHistory
      isOutdoor: true, // Default
      ageOfPlants: 0,
      numberOfPlants: 0,
      soilPh: 7.0,
      enableBlockchain: true,
      productionMethod: 'conventional',
      irrigationMethod: 'drip'
    };
  };

  const handleSubmit = async (data: any) => {
    try {
      console.log('Form submitted with data:', data);

      if (isEdit) {
        // For edit mode, we would need different API
        toast({
          title: 'Edit Mode',
          description: 'Edit functionality will be implemented with dedicated API endpoint',
          status: 'info',
          duration: 5000,
          isClosable: true
        });
        return;
      }

      // For create mode, use startProduction API
      const productionPayload = {
        name: data.productName || data.productId,
        parcel_id: parseInt(parcelId || '0'),
        crop_type: data.productName || 'Unknown',
        start_date: data.date,
        expected_harvest: data.expectedHarvest,
        description: '',
        production_method: data.productionMethod || 'conventional',
        irrigation_method: data.irrigationMethod || 'drip',
        age_of_plants: data.ageOfPlants?.toString() || '0',
        number_of_plants: data.numberOfPlants || 0,
        soil_ph: data.soilPh || 7.0,
        is_outdoor: data.isOutdoor,
        type: data.type || 'OR',
        notes: ''
      };

      console.log('Calling startProduction with payload:', productionPayload);

      await startProduction(productionPayload).unwrap();

      toast({
        title: intl.formatMessage({ id: 'app.success' }),
        description: isEdit
          ? intl.formatMessage({ id: 'app.productionUpdatedSuccessfully' })
          : intl.formatMessage({ id: 'app.productionCreatedSuccessfully' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Navigate back
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`);
    } catch (error: any) {
      console.error('Error saving production:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description:
          error?.data?.message || intl.formatMessage({ id: 'app.errorSavingProduction' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleCancel = () => {
    navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`);
  };

  // Show loading state for edit mode
  if (isEdit && isLoadingProduction) {
    return (
      <Box p={8} textAlign="center">
        <Text>Loading production data...</Text>
      </Box>
    );
  }

  if (isEdit && isProductionError) {
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
      isLoading={isStarting}
      isEdit={isEdit}
      parcelName={currentParcel?.name || ''}
      productOptions={productOptions}
    />
  );
}

export default UpdateProduction;
