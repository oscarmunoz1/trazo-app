import React from 'react';
import { SimpleGrid, Button, VStack, Icon, Text, useColorModeValue, Grid } from '@chakra-ui/react';

const SelectionGrid = ({
  options,
  selectedValue,
  onSelect,
  columns = { base: 1, md: 2, lg: 4 },
  renderOption,
  size = 'md',
  variant = 'button', // 'button' | 'card'
  allowMultiple = false,
  selectedValues = [],
  colorScheme = 'green',
  showDescriptions = true,
  height = { base: '120px', md: '140px' }
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const descriptionColor = useColorModeValue('gray.500', 'gray.400');

  const isSelected = (optionValue) => {
    if (allowMultiple) {
      return selectedValues.includes(optionValue);
    }
    return selectedValue === optionValue;
  };

  const handleSelect = (optionValue) => {
    if (allowMultiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onSelect(newValues);
    } else {
      onSelect(optionValue);
    }
  };

  const defaultRenderOption = (option) => (
    <VStack spacing={3} align="center" textAlign="center" h="100%">
      {option.icon && (
        <Icon
          as={option.icon}
          boxSize={{ base: 6, md: 8 }}
          color={
            isSelected(option.value)
              ? `${option.color || colorScheme}.600`
              : `${option.color || colorScheme}.500`
          }
          transition="all 0.3s ease"
        />
      )}

      <VStack spacing={1} align="center" flex="1">
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="bold"
          color={textColor}
          lineHeight="1.2"
        >
          {option.label}
        </Text>

        {showDescriptions && option.description && (
          <Text
            fontSize="xs"
            color={descriptionColor}
            lineHeight="1.3"
            noOfLines={2}
            whiteSpace="normal"
            textAlign="center"
          >
            {option.description}
          </Text>
        )}
      </VStack>
    </VStack>
  );

  if (variant === 'button') {
    return (
      <Grid templateColumns={columns} gap={4} w="100%">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={isSelected(option.value) ? 'solid' : 'outline'}
            colorScheme={option.color || colorScheme}
            size="lg"
            height={height}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            p={4}
            onClick={() => handleSelect(option.value)}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            transition="all 0.2s"
            whiteSpace="normal"
            overflow="hidden"
          >
            {renderOption
              ? renderOption(option, isSelected(option.value))
              : defaultRenderOption(option)}
          </Button>
        ))}
      </Grid>
    );
  }

  // Card variant
  return (
    <SimpleGrid columns={columns} spacing={4} w="100%">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="unstyled"
          height="auto"
          p={0}
          onClick={() => handleSelect(option.value)}
        >
          <VStack
            w="100%"
            h={height}
            p={4}
            border={isSelected(option.value) ? '2px solid' : '1px solid'}
            borderColor={
              isSelected(option.value) ? `${option.color || colorScheme}.500` : borderColor
            }
            bg={isSelected(option.value) ? `${option.color || colorScheme}.50` : bgColor}
            borderRadius="lg"
            cursor="pointer"
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
              borderColor: `${option.color || colorScheme}.300`
            }}
            justify="center"
            align="center"
          >
            {renderOption
              ? renderOption(option, isSelected(option.value))
              : defaultRenderOption(option)}
          </VStack>
        </Button>
      ))}
    </SimpleGrid>
  );
};

export default SelectionGrid;
