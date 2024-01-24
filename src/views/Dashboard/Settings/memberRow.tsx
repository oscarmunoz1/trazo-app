// Chakra imports
import {
  Badge,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';

import { IoEllipsisVerticalSharp } from 'react-icons/io5';

const ScansRow = (props) => {
  const { name, establishments, role } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  return (
    <Tr pe="0px" paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
      <Td pe="0px" paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Text color={textColor} color="gray.500" fontSize={{ sm: '14px' }}>
          {name}
        </Text>
      </Td>
      <Td pe="0px" paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Flex gap="12px">
          {establishments?.map((establishment) => (
            <Badge p="4px 8px" borderRadius="12px">
              <Text color={textColor} color="gray.600" fontSize={{ sm: '12px' }}>
                {establishment}
              </Text>
            </Badge>
          ))}
          {/* <Badge p="4px 8px" borderRadius="12px" fontSize={{ sm: '12px' }} fontWeight={'weight'}>
            hola
          </Badge> */}
        </Flex>
      </Td>
      <Td paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Text color={textColor} color="gray.500" fontSize={{ sm: '14px' }}>
          {role}
        </Text>
      </Td>
      <Td paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Menu isOpen={isOpen1} onClose={onClose1}>
          <MenuButton onClick={onOpen1} alignSelf="flex-start" cursor={'pointer'}>
            <Icon as={IoEllipsisVerticalSharp} color="gray.400" w="20px" h="20px" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => {}}>
              <Flex color={textColor} cursor="pointer" align="center" p="4px">
                {/* <Icon as={FaPencilAlt} me="4px" /> */}
                <Text fontSize="sm" fontWeight="500">
                  Edit
                </Text>
              </Flex>
            </MenuItem>
            <MenuItem>
              <Flex color="red.500" cursor="pointer" align="center" p="4px">
                {/* <Icon as={FaTrashAlt} me="4px" /> */}
                <Text fontSize="sm" fontWeight="500">
                  Delete
                </Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

export default ScansRow;
