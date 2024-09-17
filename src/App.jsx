import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import UserProvider from 'contexts/auth-reducer/ีuserprovider/UserProvider';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
