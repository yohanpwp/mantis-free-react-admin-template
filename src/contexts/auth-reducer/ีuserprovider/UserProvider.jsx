import { createContext, useState } from 'react';

// สร้าง global state  สำหรับเก็บข้อมูล state
export const UserContext = createContext();

// สร้าง Provider สำหรับให้ทุกคนใช้งาน global state ครอบกับ router
const UserProvider = (props) => {
  const [username, setUsername] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [remark, setRemark] = useState('');

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        data,
        setData,
        isLoading,
        setIsLoading,
        isClicked,
        setIsClicked,
        isSubmitted,
        setIsSubmitted,
        customerName,
        setCustomerName,
        remark,
        setRemark
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
