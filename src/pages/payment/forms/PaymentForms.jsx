import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment, { inputAdornmentClasses } from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| INPUT VALUES ||============================ //




// ============================|| OUTPUT VALUES ||============================ //
export default function PaymentForm() {
  return (
    //... other form fields...
    <div>
      <Formik
        initialValues={{
          customerName: '',
          amount: '',
          remark: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          customerName: Yup.string().max(255).required('Customer Name is required'),
          amount: Yup.number().positive().required('Amount is required')
        })}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Customer"
                  name="customerName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customerName}
                  error={Boolean(touched.customerName && errors.customerName)}
                />
                {touched.username && errors.username && (
                  <FormHelperText error id="standard-weight-helper-textcustomer-name">
                    {errors.username}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Amounts"
                  name="amount"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.amount}
                  error={Boolean(touched.amount && errors.amount)}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">฿</InputAdornment>,
                    }
                  }}
                  helperText="Fill your amounts here"
                />
              </Grid>
              <Grid item xs>
                <TextField fullWidth id="outlined-required" label="Remark" defaultValue="-" name="remark" />
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create QR Code
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}
