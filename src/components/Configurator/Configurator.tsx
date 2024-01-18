/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra Imports
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Text,
  useColorMode
} from '@chakra-ui/react';
import { useContext, useRef } from 'react';

import { HSeparator } from 'components/Separator/Separator';
import { IoIosArrowDown } from 'react-icons/io';
import { LocaleContext } from 'i18n/LocaleContext';
import { locales } from 'i18n/i18n-config';

type ConfiguratorProps = {
  secondary: boolean;
  isOpen: boolean;
  onClose: () => void;
  fixed: boolean;
};

function Configurator(props: ConfiguratorProps) {
  const { secondary, isOpen, onClose, fixed, ...rest } = props;
  const { locale, setLocale } = useContext(LocaleContext);
  const { colorMode, toggleColorMode } = useColorMode();

  const settingsRef = useRef(null);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={'right'}
      finalFocusRef={settingsRef}
      blockScrollOnMount={false}>
      <DrawerContent>
        <DrawerHeader pt="24px" px="24px">
          <DrawerCloseButton />
          <Text fontSize="xl" fontWeight="bold" mt="16px">
            Profile Settings
          </Text>
          <Text fontSize="md" mb="16px">
            Configure your profile settings.
          </Text>
          <HSeparator />
        </DrawerHeader>
        <DrawerBody w="340px" ps="24px" pe="40px">
          <Flex flexDirection="column">
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Text fontSize="md" fontWeight="600" mb="4px">
                Dark/Light
              </Text>
              <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
              </Button>
            </Flex>

            <HSeparator />
            <Flex justifyContent="space-between" alignItems="center" mb="24px" pt="24px">
              <Text fontSize="md" fontWeight="600" mb="4px">
                Language
              </Text>
              <FormControl paddingLeft={'24px'}>
                <Select
                  borderRadius="15px"
                  color="gray.600"
                  fontSize="xs"
                  onChange={(e) => setLocale(e.target.value)}
                  value={locale}>
                  {Object.keys(locales).map((loc) => {
                    return (
                      <option value={loc} key={loc}>
                        {locales[loc].name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default Configurator;
