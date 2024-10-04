import { RouterProvider } from 'react-router-dom';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import UserProvider from 'contexts/auth-reducer/ีuserprovider/UserProvider';

import english from '../locales/en/translations.json';
import thai from '../locales/th/translations.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: english
      },
      th: {
        translation: thai
      }
    },
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const { t } = useTranslation();
  return (
    <ThemeCustomization>
      <ScrollTop>
        <UserProvider>
          <RouterProvider router={router} t={t} />
        </UserProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
