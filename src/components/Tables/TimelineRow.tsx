import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import React, { useRef } from 'react';

import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function TimelineRow(props) {
  const { logo, title, date, color, isLast, url } = props;
  const menuButtonRef = useRef();
  const textColor = useColorModeValue('gray.700', 'white.300');
  const bgIconColor = useColorModeValue('white.300', 'gray.700');
  const navigate = useNavigate();

  return (
    <Flex alignItems="center" minH="78px" justifyContent="start" mb="5px">
      <Flex direction="column" h="100%" mb="auto">
        <Icon
          as={logo}
          bg={bgIconColor}
          color={color}
          h={'30px'}
          w={'26px'}
          pe="6px"
          zIndex="1"
          position="relative"
          right={''}
          left={'-8px'}
        />
        {!isLast && <Box w="2px" bg="gray.200" h={'100%'} minH={'48px'}></Box>}
      </Flex>
      <Flex direction="column" justifyContent="flex-start" h="100%" w="100%">
        <Flex
          textAlign={'start'}
          p="10px"
          w="100%"
          _focus={{
            boxShadow: 'none'
          }}
          _hover={{
            borderRadius: '10px',
            bg: 'gray.100'
          }}
          cursor="pointer"
          onClick={() => navigate(url)}
        >
          <Flex direction="column" w="100%">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {title}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal" mb={'14px'}>
              {date}
            </Text>
          </Flex>
          {/* <Menu>
            <MenuButton variant="outline" ref={menuButtonRef}>
              <Button
                p="0px"
                bg="transparent"
                zIndex={1}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icon as={FaEllipsisH} color="gray.700" cursor="pointer" />
              </Button>
            </MenuButton>
            <MenuList zIndex={2}>
              <MenuItem>New Tab</MenuItem>
              <MenuItem>New Window</MenuItem>
              <MenuItem>Open Closed Tab</MenuItem>
              <MenuItem>Open File...</MenuItem>
            </MenuList>
          </Menu> */}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default TimelineRow;
