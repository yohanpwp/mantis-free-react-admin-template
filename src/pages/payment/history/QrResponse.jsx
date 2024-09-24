// import reactHooks from react
import { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import from 3rd party

// material-ui
import { Box, Modal, Typography, Button } from '@mui/material';
// project import
import { getHistoryQrCode } from 'utils/qrdatabase';

// ==============================|| INPUT STYLE ||============================== //
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
// ==============================|| OUTPUT VALUE ||============================== //

const QrResponse = (props) => {
  // create a variable to hold the props
  const { open, handleClose, data, check } = props;

  if (data.reference === check) {
    return (
      <div>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Result of Funds Transfer (Success)
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              ชื่อผู้ชำระ: {data.payerAccountName}
              <br />
              รหัสใบแจ้งชำระ: {data.transactionId}
              <br />
              บัญชีธนาคาร: {`${data.sendingBankCode}`}
              <br />
              จำนวนเงิน: {`${data.amount} บาท`}
              <br />
              วันที่ชำระ: {Intl.DateTimeFormat(['th-TH'], { dateStyle: 'long' }).format(Date.parse(data?.notShowDates))}
              <br />
              เวลาที่ชำระ: {data.times}
              <br />
              รหัสอ้างอิง1: {data.reference}
              <br />
              รหัสอ้างอิง2: {data.reference2}
              <br />
              รหัสอ้างอิง3: {data.reference3}
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
};

export default QrResponse;
