import { Button, Flex, Link, Text } from '@chakra-ui/react';

import IconBox from 'components/Icons/IconBox';
import { QuestionIcon } from '@chakra-ui/icons';
import SidebarHelpImage from 'assets/img/SidebarHelpImage.png';
import { useIntl } from 'react-intl';

const SidebarHelp = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const intl = useIntl();
  return (
    <Flex
      borderRadius="15px"
      flexDirection="column"
      bgImage={SidebarHelpImage}
      justifyContent="flex-start"
      alignItems="start"
      boxSize="border-box"
      p={sidebarWidth === 275 || !sidebarWidth ? '16px' : '12px'}
      h={sidebarWidth === 275 || !sidebarWidth ? '170px' : 'auto'}
      w={sidebarWidth === 275 || !sidebarWidth ? '100%' : '77%'}>
      <IconBox width="35px" h="35px" bg="white" mb="auto">
        <QuestionIcon color="green.400" h="18px" w="18px" />
      </IconBox>
      <Text
        fontSize="sm"
        color="white"
        fontWeight="bold"
        display={sidebarWidth === 275 || !sidebarWidth ? 'block' : 'none'}>
        {intl.formatMessage({ id: 'app.needHelp' })}
      </Text>
      <Text
        fontSize="xs"
        color="white"
        mb="10px"
        display={sidebarWidth === 275 || !sidebarWidth ? 'block' : 'none'}>
        {intl.formatMessage({ id: 'app.checkOutDocs' })}
      </Text>
      <Link w="100%" href="">
        <Button
          fontSize="10px"
          fontWeight="bold"
          w="100%"
          bg="white"
          _hover="none"
          _active={{
            bg: 'white',
            transform: 'none',
            borderColor: 'transparent'
          }}
          _focus={{
            boxShadow: 'none'
          }}
          color="black"
          display={sidebarWidth === 275 || !sidebarWidth ? 'block' : 'none'}>
          {intl.formatMessage({ id: 'app.documentation' }).toUpperCase()}
        </Button>
      </Link>
    </Flex>
  );
};

export default SidebarHelp;
