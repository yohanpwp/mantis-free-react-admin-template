import { verify } from 'jsonwebtoken';

// verfiy data from jwt token
export const verifyToken = () => {
  const SECRET =
    import.meta.env.MODE === 'production' ? import.meta.env.VITE_APP_BASE_SECRET_KEY : import.meta.env.VITE_APP_BASE_SECRET_KEY;
  let token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
  const user = verify(token, SECRET);
  //มั่นใจว่า user ที่เข้ามานั้นถูกต้องแล้ว โดยรีเช็คจาก Database
  console.log(user);
  return user;
};
