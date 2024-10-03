import axios from 'axios';
// ฟังก์ชั่นตั้งเวลาจากเวลาปัจจุบันกี่นาที
function addTimeinMinutes(min) {
  const dateoptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const timeoptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  const present = new Date().getTime() + min * 60000;
  const presentdate = Intl.DateTimeFormat('fr-CA', dateoptions).format(present);
  const presenttime = Intl.DateTimeFormat('en-Us', timeoptions).format(present);
  return `${presentdate} ${presenttime}`;
}

// ฟังก์ชั้นสร้าง UUID เพื่อสง่ Header ให้กับ api
function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ฟังก์ชั้นสร้างรหัสที่มีความยาวกี่ตัวอักษร จากเลขฐานสิบหก
const getRanHex = (size) => {
  let result = [];
  let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

  for (let n = 0; n < size; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join('');
};

const guid = generateUUID(); //สร้าง guid ใหม่ที่จะใช้ในการส่งค่า authorization เป็น header ใน request

// ฟังก์ชั้นขอ  token จาก api ของ scb
export async function postToken(url) {
  //สร้างฟังก์ชั้นเพื่อขอ Token

  let config = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      resourceOwnerId: 'l78c16602cd0b24922a2d42292cf71cc7f',
      requestUId: guid,
      'accept-language': 'EN'
    }
  };
  try {
    const response = await axios.request(config);
    return response.data.data.accessToken; // รับค่า access token ที่ขอข้อมูลจาก api
  } catch {
    (err) => {
      console.log(err);
    };
  }
}

// ฟังก์ชั่นสร้าง qr code โดยรับจำนวนเงินจาก input ในหน้า ui
export async function getQRCode(token, amount) {
  let expiryDate = addTimeinMinutes(3);
  let ranHex8digits = getRanHex(8); //random hexadecimal generator 8 digits
  const qrHead = {
    'Content-Type': 'application/json',
    authorization: 'Bearer ' + token, //ต้องรับค่า token ไว้ให้ นปก.
    resourceOwnerId: 'l78c16602cd0b24922a2d42292cf71cc7f',
    requestUId: guid,
    'accept-language': 'EN'
  };
  const qrBody = {
    qrType: 'PP',
    ppType: 'BILLERID',
    ppId: '010555413150501',
    amount: amount,
    expiryDate: expiryDate,
    numberOfTimes: 1,
    ref1: ranHex8digits,
    ref2: 'RFC2',
    ref3: 'VER',
    token: token
  };

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.scb.eorder.smart-ms2.com/api/scb/qrcode',
    headers: qrHead,
    data: JSON.stringify(qrBody)
  };
  try {
    const response = await axios.request(config);
    return { image: response.data.data.qrImage, qrBody: qrBody }; //ดึงข้อมูล qrImage จาก property data ใน web API
  } catch {
    (err) => {
      console.log(err.response.data);
    };
  }
}

// ฟังก์ชั่นบันทีกข้อมูลการสร้าง QR Code ส่งฐานข้อมูลเก็บเป็นประวัติ
export async function postSaveHistoryQrCode(value) {
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let token = window.localStorage.getItem('token');
  const tokenWithoutQuotes = token?.replace(/"/g, '');
  let config = {
    url: import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_HISTORY_DATABASE : import.meta.env.VITE_HISTORY_DATABASE,
    'content-type': 'application/json',
    method: 'post',
    headers: {
      authorization: 'Bearer ' + tokenWithoutQuotes
    },
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

// ฟังก์ชั่นเรียกดูข้อมูลการสร้าง QR Code จากฐานข้อมูลเก็บเป็นประวัติ
export async function getHistoryQrCode(value) {
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let url =
    import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_GET_HISTORY_DATABASE : import.meta.env.VITE_GET_HISTORY_DATABASE;
  // ส่ง request และรับ response ที่ได้มา
  try {
    let response = await axios.post(url, value);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

// ฟังก์ชั่นเรียกดูข้อมูลการจ่ายเงิน QR Code จากฐานข้อมูลเก็บเป็นประวัติ
export const checkQrResponse = async (ref) => {
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let url = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_GET_QR_RESPONSE : import.meta.env.VITE_GET_QR_RESPONSE;
  let data = { ref1: ref };
  // ส่ง request และรับ response ที่ได้มา
  try {
    let response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// ฟังก์ชั่นแก้ไขข้อมูลการ QR Code จากฐานข้อมูล
const editHistoryQrCode = async (value) => {
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let token = window.localStorage.getItem('token');
  const tokenWithoutQuotes = token?.replace(/"/g, '');
  let config = {
    url:
      import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_EDIT_HISTORY_DATABASE : import.meta.env.VITE_EDIT_HISTORY_DATABASE,
    'content-type': 'application/json',
    maxBodyLength: Infinity,
    method: 'put',
    headers: {
      authorization: 'Bearer ' + tokenWithoutQuotes
    },
    data: value // ส่งข้อมูล id,customer,status,remark ไปยัง API
  };
  // ส่ง request และรับ response ที่ได้มา
  try {
    let response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// ฟังก์ชั่นลบข้อมูลการ QR Code จากฐานข้อมูล
const deleteHistoryQrCode = async (value) => {
  let token = window.localStorage.getItem('token');
  const tokenWithoutQuotes = token?.replace(/"/g, '');
  // ตั้งค่า URL ของ API ที่ต้องการใช้
  let config = {
    url:
      import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_API_DELETE_HISTORY_DATABASE
        : import.meta.env.VITE_DELETE_HISTORY_DATABASE,
    'content-type': 'application/json',
    maxBodyLength: Infinity,
    method: 'put',
    headers: {
      authorization: 'Bearer ' + tokenWithoutQuotes
    },
    data: value // ส่งข้อมูล id ไปยัง API
  };
  // ส่ง request และรับ response ที่ได้มา
  
    let response = await axios.request(config);
    return response.data;
  
};

export const history = { editHistoryQrCode, deleteHistoryQrCode };
