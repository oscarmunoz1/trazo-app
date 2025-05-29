import React from 'react';
import { HStack, Button, useColorModeValue } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FormNavigationButtons = ({
  onPrevious,
  onNext,
  isLoading = false,
  showPrevious = true,
  previousLabel = 'Previous',
  nextLabel = 'Continue',
  nextType = 'submit',
  nextColorScheme = 'green',
  isNextDisabled = false,
  isPreviousDisabled = false,
  spacing = 'space-between'
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack justify={spacing} pt={6} mt={4} borderTop="1px" borderColor={borderColor} w="100%">
      {showPrevious ? (
        <Button
          variant="outline"
          onClick={onPrevious}
          leftIcon={<FaChevronLeft />}
          size="md"
          px={6}
          h="42px"
          borderRadius="lg"
          fontWeight="600"
          isDisabled={isPreviousDisabled || isLoading}
          _hover={{
            transform: 'translateY(-1px)',
            boxShadow: 'md'
          }}
          transition="all 0.3s ease"
        >
          {previousLabel}
        </Button>
      ) : (
        <div /> // Spacer for layout
      )}

      <Button
        colorScheme={nextColorScheme}
        type={nextType}
        onClick={nextType !== 'submit' ? onNext : undefined}
        rightIcon={<FaChevronRight />}
        size="md"
        px={6}
        h="42px"
        borderRadius="lg"
        fontWeight="600"
        boxShadow="lg"
        isLoading={isLoading}
        isDisabled={isNextDisabled}
        _hover={{
          boxShadow: 'xl',
          transform: 'translateY(-1px)'
        }}
        transition="all 0.3s ease"
      >
        {nextLabel}
      </Button>
    </HStack>
  );
};

export default FormNavigationButtons;
