// Chakra imports
import { Button, Flex, Link, Stack, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import { useIntl } from 'react-intl';

type ScansRowProps = {
  date: string;
  product: string;
  location: string;
  parcel: string;
  comment: string;
};

const ScansRow = (props: ScansRowProps) => {
  const intl = useIntl();
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
          bg={comment ? 'green.400' : 'white'}
          w="100px"
          h="35px"
          fontSize="xs"
          color={comment ? '#fff' : '#CBD5E0'}
          border={comment ? 'none' : '1px solid #CBD5E0'}
          cursor={comment ? 'pointer' : 'default'}
          fontWeight="bold"
          alignSelf={{ sm: 'flex-start', md: 'flex-end' }}
          mt={{ sm: '16px', md: '0px' }}>
          {intl.formatMessage({ id: 'app.view' })}
        </Button>
      </Td>
    </Tr>
  );
};

export default ScansRow;
