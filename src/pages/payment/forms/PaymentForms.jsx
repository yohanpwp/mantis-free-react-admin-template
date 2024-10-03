import { useState, useContext } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import { UserContext } from 'contexts/auth-reducer/ีuserprovider/UserProvider';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { postToken, getQRCode, postSaveHistoryQrCode } from 'utils/qrdatabase';

// ============================|| INPUT VALUES ||============================ //

// ============================|| OUTPUT VALUES ||============================ //
export default function PaymentForm() {
  const { isLoading, setIsLoading, data, setData } = useContext(UserContext);
  // กำหนด state ที่ใช้ในโปรแกรม
  const [qrImage, setQrImage] = useState('');
  const [ref, setRef] = useState('');

  // เมื่อกด submit ให้ส่งค่า amount ไปยัง api  เพื่อรับ qr code
  const onSubmit = async (values) => {
    setIsLoading(true);
    if (values.amounts <= 0) {
      Swal.fire({
        icon: 'error',
        text: 'กรุณากรอกจำนวนเงินให้ถูกต้อง',
        showConfirmButton: false,
        timer: 1500
      }).then(setIsLoading(false));
      return;
    } else if (values.amounts.toString().includes('.')) {
      if (values.amounts.toString().split('.')[1].length > 2) {
        Swal.fire({
          icon: 'error',
          text: 'กรอกจำนวนเงินได้จำนวนจุดทศนิยมมากที่สุด 2 ตำแหน่งเท่านั้น',
          showConfirmButton: false,
          timer: 1500
        }).then(setIsLoading(false));
        return;
      }
    }
    //1.Get Token from SCB Api
    let url = 'https://api.scb.eorder.smart-ms2.com/api/scb/token';
    const token = await postToken(url);
    // 2. Generate QR Image from SCB Api
    const data = await getQRCode(token, values.amounts);
    const value = {
      body: data,
      amounts: values.amounts,
      token: token,
      customerName: values.customerName,
      remark: values.remark
    };
    setRef(data.qrBody);
    setData(values);
    setQrImage(data.image);
    setIsLoading(false);
    postSaveHistoryQrCode(value);
  };

  const onReset = () => {
    setRef('');
    setData('');
    setQrImage('');
  };

  return (
    //... other form fields...
    <div>
      <Formik
        initialValues={{
          customerName: '',
          amounts: '',
          remark: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          customerName: Yup.string().max(255).required('Customer Name is required'),
          amounts: Yup.number().positive().required('Amount is required')
        })}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        onReset={onReset}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, handleReset }) => (
          <form noValidate onSubmit={handleSubmit} onReset={handleReset}>
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
                  name="amounts"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.amounts}
                  error={Boolean(touched.amounts && errors.amounts)}
                  slotprops={{
                    input: {
                      endAdornment: <InputAdornment position="end">฿</InputAdornment>
                    }
                  }}
                  helperText="Fill your amounts here"
                />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  id="outlined-required"
                  label="Remark"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="remark"
                  value={values.remark}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'baseline'
                  }}
                >
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      onSubmit={handleSubmit}
                    >
                      Create QR Code
                    </Button>
                  </AnimateButton>
                  <AnimateButton>
                    <Button disableElevation size="large" type="reset" variant="contained" color="secondary" onReset={handleReset}>
                      Clear
                    </Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
            {ref && data && (
              <Grid columnSpacing={3} container={true} direction={'row'} sx={{ justifyContent: 'center' }}>
                <Grid size={9}>
                  <img style={{ marginTop: '20px' }} src={'data:image/png;base64,' + qrImage} alt="qr code you wanted" />
                </Grid>
                <Grid size={3}>
                  <Stack sx={{ margin: '50px 20px', alignContent: 'center', justifyContent: 'center' }}>
                    <Typography>รหัสอ้างอิง : {ref.ref1}</Typography>
                    <Typography>จำนวนเงิน : {data.amounts} บาท</Typography>
                    <Typography>ชื่อของลูกค้า : {data.customerName}</Typography>
                    <Typography>หมดเวลาแสกน : {' ' + ref.expiryDate.split(' ')[1] + ' น.'}</Typography>
                    {values.remark && <Typography>หมายเหตุ : {data.remark}</Typography>}
                  </Stack>
                </Grid>
              </Grid>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
}
