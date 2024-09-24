import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { AuthProvider, useAuth } from 'hooks/useAuth';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));
const ErrorPage = Loadable(lazy(() => import('pages/errors/error-page')));

// ==============================|| DEFAULT ROUTING ||============================== //
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    // user is not authenticated
    return <Navigate to="/payment/default" />;
  }
  return children;
};
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: (
    <AuthProvider>
      <ProtectedRoute>
        <MinimalLayout />
      </ProtectedRoute>
    </AuthProvider>
  ),
  errorElement: <ErrorPage />,
  children: [
    {
      path: '/',
      element: <AuthLogin />
    },
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    }
  ]
};

export default LoginRoutes;
