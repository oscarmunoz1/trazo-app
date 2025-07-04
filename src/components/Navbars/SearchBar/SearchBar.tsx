import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue
} from '@chakra-ui/react';

import React from 'react';
import { SearchIcon } from '@chakra-ui/icons';

type SearchBarProps = {
  variant?: string;
  children: React.ReactNode;
};

export function SearchBar(props: SearchBarProps) {
  const { variant, children, ...rest } = props;
  // Chakra Color Mode
  const mainTeal = useColorModeValue('green.500', 'green.400');
  const searchIconColor = useColorModeValue('gray.700', 'gray.200');
  const inputBg = useColorModeValue('white', 'gray.800');
  return (
    <InputGroup
      bg={inputBg}
      borderRadius="15px"
      w="200px"
      _focus={{
        borderColor: { mainTeal }
      }}
      _active={{
        borderColor: { mainTeal }
      }}
    >
      <InputLeftElement
        children={
          <IconButton
            bg="inherit"
            borderRadius="inherit"
            _hover={{
              transform: 'none'
            }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent'
            }}
            _focus={{
              boxShadow: 'none'
            }}
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
          ></IconButton>
        }
      />
      <Input fontSize="xs" py="11px" placeholder="Type here..." borderRadius="inherit" />
    </InputGroup>
  );
}
