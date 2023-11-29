// Chakra imports
import { Button, Link, Stack, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';

type ScansRowProps = {
  date: string;
  product: string;
  location: string;
  parcel: string;
  comment: string;
};

const ScansRow = (props: ScansRowProps) => {
  const { date, product, location, parcel, comment } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Tr pe="0px" paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
      <Td pe="0px" paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Text color={textColor} fontSize="sm" fontWeight="bold">
          {date}
        </Text>
      </Td>
      <Td pe="0px" paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Text color={textColor} fontSize="sm">
          {product}
        </Text>
      </Td>
      <Td paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Text color={textColor} fontSize="sm">
          {location}
        </Text>
      </Td>
      <Td paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Text color={textColor} fontSize="sm">
          {parcel}
        </Text>
      </Td>
      <Td paddingInlineStart={'20px'} paddingInlineEnd={'20px'}>
        <Button
          onClick={() => console.log('click')}
          variant="no-hover"
          bg="green.400"
          w="100px"
          h="35px"
          disabled={comment === ''}
          fontSize="xs"
          color="#fff"
          fontWeight="bold"
          alignSelf={{ sm: 'flex-start', md: 'flex-end' }}
          mt={{ sm: '16px', md: '0px' }}>
          VIEW
        </Button>
      </Td>
    </Tr>
  );
};

export default ScansRow;
