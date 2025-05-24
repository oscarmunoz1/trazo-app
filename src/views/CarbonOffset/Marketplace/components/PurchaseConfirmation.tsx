import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';

interface Project {
  id: number;
  name: string;
  price_per_ton: number;
  available_capacity: number;
}

interface PurchaseConfirmationProps {
  project: Project;
  onPurchase: (amount: number) => void;
  isLoading: boolean;
}

export const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  project,
  onPurchase,
  isLoading
}) => {
  const [amount, setAmount] = useState<number>(1);
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const totalPrice = amount * project.price_per_ton;

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= project.available_capacity) {
      setAmount(numValue);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {project.name}
        </Text>
        <Text color="gray.600">Price per ton: ${project.price_per_ton}</Text>
        <Text color="gray.600">Available capacity: {project.available_capacity} tons</Text>
      </Box>

      <Divider />

      <FormControl>
        <FormLabel>Amount to Purchase (tons)</FormLabel>
        <NumberInput
          value={amount}
          onChange={handleAmountChange}
          min={1}
          max={project.available_capacity}
          precision={2}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Box
        p={4}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <Flex justify="space-between" mb={2}>
          <Text>Price per ton:</Text>
          <Text>${project.price_per_ton}</Text>
        </Flex>
        <Flex justify="space-between" mb={2}>
          <Text>Amount:</Text>
          <Text>{amount} tons</Text>
        </Flex>
        <Divider my={2} />
        <Flex justify="space-between" fontWeight="bold">
          <Text>Total:</Text>
          <Text color="green.500">${totalPrice.toFixed(2)}</Text>
        </Flex>
      </Box>

      <Button
        colorScheme="green"
        size="lg"
        onClick={() => onPurchase(amount)}
        isLoading={isLoading}
        loadingText="Processing..."
      >
        Confirm Purchase
      </Button>
    </VStack>
  );
};
