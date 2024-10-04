import { useTranslation } from 'react-i18next';
// material-ui
import { Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import PaymentForm from './forms/PaymentForms';
import Routerbreadcrumbs from 'components/Routerbreadcrumbs';

// ==============================|| SAMPLE PAGE ||============================== //

export default function PaymentPage() {
  // เปลี่ยน header หน้าเพจ
  document.title = 'SCB Payment - Create & Scan QR Code';
  // use translation hook for i18n
  const { t, i18n } = useTranslation();
  return (
    <Grid>
      <Routerbreadcrumbs />
      <Typography fontSize={'large'} gutterBottom>
        SCB Payment
      </Typography>
      <MainCard boxShadow>
        <Stack>
          <PaymentForm></PaymentForm>
        </Stack>
      </MainCard>
    </Grid>
  );
}
