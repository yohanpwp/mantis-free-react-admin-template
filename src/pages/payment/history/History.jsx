//react
import { useContext } from 'react';
// material-ui
import { Grid, Stack, Paper, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';

// project import
import Routerbreadcrumbs from 'components/Routerbreadcrumbs';
import QrHistory from './QrHistory';
import { UserContext } from 'contexts/auth-reducer/ีuserprovider/UserProvider';

// ==============================|| SAMPLE PAGE ||============================== //

export default function PaymentHistoryPage() {
  const { isLoading } = useContext(UserContext);

  function FacebookCircularProgress(props) {
    return (
      <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <CircularProgress
          variant="determinate"
          sx={(theme) => ({
            color: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
              color: theme.palette.grey[800]
            })
          })}
          size={60}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={(theme) => ({
            color: '#1a90ff',
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round'
            },
            ...theme.applyStyles('dark', {
              color: '#308fe8'
            })
          })}
          size={60}
          thickness={4}
          {...props}
        />
      </Box>
    );
  }

  return (
    <Grid>
      <Routerbreadcrumbs />
      <Typography fontSize={'large'} gutterBottom>
        SCB Payment
      </Typography>
      <Stack>
        <Paper sx={{ height: 400, width: '100%', alignContent: 'center', justifyContent: 'center' }}>
          {isLoading && <FacebookCircularProgress />}
          <QrHistory />
        </Paper>
      </Stack>
    </Grid>
  );
}
