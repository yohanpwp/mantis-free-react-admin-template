// material-ui
import { Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import PaymentForm from './forms/PaymentForms';

// ==============================|| SAMPLE PAGE ||============================== //

export default function PaymentPage() {
  return (
    <Grid>
      <Typography variant="h5" gutterBottom>
        SCB Payment
      </Typography>
      <MainCard boxShadow>
        <Stack>
          <PaymentForm></PaymentForm>
        </Stack>
        <Grid>
          <Typography variant="h6">
            SCB Payment System is a comprehensive system that assists customers in managing their finances, paying bills, and managing their
            accounts. It is designed to help reduce paperwork, increase efficiency, and improve customer satisfaction.
          </Typography>
          <Typography variant="h6">
            Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif
            ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
            reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
            qui officiate descent molls anim id est labours.
          </Typography>
        </Grid>
      </MainCard>
    </Grid>
  );
}
