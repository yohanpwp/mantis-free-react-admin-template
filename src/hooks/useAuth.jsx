import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import from 3rd party
import Swal from 'sweetalert2';

//project import
import { getUserData } from 'utils/userdatabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // create user data provider instance
  const [userData, setUserData] = useState({});
  //synchronizes the state value with the browser’s local storage
  const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const value = window.localStorage.getItem(keyName);
        if (value) {
          return JSON.parse(value);
        } else {
          return defaultValue;
        }
      } catch (err) {
        return defaultValue;
      }
    });
    const setValue = (newValue) => {
      try {
        if (newValue === null) {
          window.localStorage.removeItem(keyName);
        } else {
          window.localStorage.setItem(keyName, JSON.stringify(newValue));
        }
      } catch (err) {
        console.log(err);
      }
      setStoredValue(newValue);
    };
    return [storedValue, setValue];
  };

  const [user, setUser] = useLocalStorage('token', null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
    Swal.fire({
      icon: 'success',
      title: 'Login Success',
      showConfirmButton: false,
      timer: 3000
    }).then(
      setTimeout(function () {
        navigate('/payment/default');
      }, 3000)
    );
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      userData,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
