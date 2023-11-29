// Chakra imports
import { Stack, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';

type SalesRowProps = {
  state: string;
  name: string;
  sales: string;
  value: string;
  bounce: string;
};

const SalesRow = (props: SalesRowProps) => {
  const { state, name, sales, value, bounce } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Tr>
      <Td minW="180px">
        <Stack direction="row" spacing="16px">
          <Text>{state}</Text>
          <Text color={textColor} fontSize="sm" fontWeight="bold">
            {name}
          </Text>
        </Stack>
      </Td>
      <Td>
        <Text color={textColor} fontSize="sm" fontWeight="bold">
          {sales}
        </Text>
      </Td>
      <Td>
        <Text color={textColor} fontSize="sm" fontWeight="bold">
          {value}
        </Text>
      </Td>
      <Td>
        <Text color={textColor} fontSize="sm" fontWeight="bold">
          {bounce}
        </Text>
      </Td>
    </Tr>
  );
};

export default SalesRow;
