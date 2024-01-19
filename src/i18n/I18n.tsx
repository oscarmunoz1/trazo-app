// Import the configuration we created earlier
import { defaultLocale, locales } from './i18n-config';

import { IntlProvider } from 'react-intl';
import { LocaleContext } from './LocaleContext';
import { useState } from 'react';

type I18nProps = {
  children: React.ReactNode;
};

export default function I18n(props: I18nProps) {
  const [locale, setLocale] = useState(defaultLocale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        locale={locale}
        defaultLocale={defaultLocale}
        messages={locales[locale].messages}>
        {props.children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
