// material-ui
import { Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import Routerbreadcrumbs from 'components/Routerbreadcrumbs';
import QrHistory from './QrHistory';

// ==============================|| SAMPLE PAGE ||============================== //

export default function PaymentHistoryPage() {
  return (
    <Grid>
      <Routerbreadcrumbs />
      <Typography fontSize={'large'} gutterBottom>
        SCB Payment
      </Typography>
      <Stack>
        <QrHistory />
      </Stack>
    </Grid>
  );
}
