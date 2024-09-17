import axios from 'axios';

// ส่ง request ให้กับ API

export async function checkLogin(value) {
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let config = {
    url: import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_DATABASE_LOGIN : import.meta.env.VITE_DATABASE_LOGIN,
    method: 'post',
    data: value // ส่งข้อมูล username, password ไปยัง API
  };
  // ส่ง request และรับ response ที่ได้มา
  try {
    let response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
}

export async function registerUser(value) {
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let config = {
    url: import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_DATABASE_REGISTER : import.meta.env.VITE_DATABASE_REGISTER,
    'content-type': 'application/json',
    method: 'post',
    data: value // ส่งข้อมูล username, password ไปยัง API
  };
  // ส่ง request และรับ response ที่ได้มา
  try {
    let response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function getUserData(username) {
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let config = {
    url: import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_GET_USER + username : import.meta.env.VITE_GET_USER + username,
    'content-type': 'application/json',
    method: 'post',
    data: { username: username } // ส่งข้อมูล username ไปยัง API
  };
  // ส่ง request และรับ response ที่ได้มา
  try {
    let response = await axios.request(config);
    if (username) {
      return response.data;
    } else {
      return 'Error: Username or Password is missing';
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}
