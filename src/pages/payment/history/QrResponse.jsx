// import from 3rd party
import { useTranslation } from 'react-i18next';
// material-ui
import { Box, Modal, Typography } from '@mui/material';

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
  // import i18n hook
  const { t, i18n } = useTranslation();

  if (data.reference === check) {
    return (
      <div>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {t('Result of Fund')}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {t('payerAccountName')}: {data.payerAccountName}
              <br />
              {t('transactionId')}: {data.transactionId}
              <br />
              {t('sendingBank')}: {`${data.sendingBankCode}`}
              <br />
              {t('Amount')}: {`${data.amount} บาท`}
              <br />
              {t('Date of Fund')}:{' '}
              {i18n.language == 'th'
                ? Intl.DateTimeFormat(['th-TH'], { dateStyle: 'long' }).format(Date.parse(data?.notShowDates))
                : Intl.DateTimeFormat(['en-EN'], { dateStyle: 'long' }).format(Date.parse(data?.notShowDates))}
              <br />
              {t('Time of Fund')}: {data.times}
              <br />
              {t('ref1')}: {data.reference}
              <br />
              {t('ref2')}: {data.reference2}
              <br />
              {t('ref3')}: {data.reference3}
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
};

export default QrResponse;
