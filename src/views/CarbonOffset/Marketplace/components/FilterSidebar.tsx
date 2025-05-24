import React from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  useColorModeValue
} from '@chakra-ui/react';

interface Filters {
  project_type: string;
  certification: string;
  min_price: string;
  max_price: string;
  min_capacity: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (key: string, value: string) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const projectTypes = [
    'Reforestation',
    'Renewable Energy',
    'Methane Capture',
    'Ocean Conservation',
    'Soil Carbon'
  ];

  const certificationStandards = [
    'Gold Standard',
    'Verified Carbon Standard',
    'Climate Action Reserve',
    'American Carbon Registry'
  ];

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      position="sticky"
      top="4"
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md">Filters</Heading>

        <FormControl>
          <FormLabel>Project Type</FormLabel>
          <Select
            value={filters.project_type}
            onChange={(e) => onFilterChange('project_type', e.target.value)}
            placeholder="All Types"
          >
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Certification</FormLabel>
          <Select
            value={filters.certification}
            onChange={(e) => onFilterChange('certification', e.target.value)}
            placeholder="All Standards"
          >
            {certificationStandards.map((standard) => (
              <option key={standard} value={standard}>
                {standard}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Price Range (per ton)</FormLabel>
          <Box display="flex" gap={2}>
            <Input
              type="number"
              placeholder="Min"
              value={filters.min_price}
              onChange={(e) => onFilterChange('min_price', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.max_price}
              onChange={(e) => onFilterChange('max_price', e.target.value)}
            />
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Minimum Available Capacity (tons)</FormLabel>
          <Input
            type="number"
            placeholder="Min capacity"
            value={filters.min_capacity}
            onChange={(e) => onFilterChange('min_capacity', e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={() => {
            Object.keys(filters).forEach((key) => onFilterChange(key, ''));
          }}
        >
          Clear Filters
        </Button>
      </VStack>
    </Box>
  );
};
