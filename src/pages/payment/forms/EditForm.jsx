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
import Stack from '@mui/material/Stack';
import { Box, Modal, Typography, TextField, Select, MenuItem } from '@mui/material';
import { CloseCircleFilled } from '@ant-design/icons';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { history } from 'utils/qrdatabase';

// ==============================|| INPUT STYLE ||============================== //
const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  width: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const closeButtonStyle = {
  position: 'absolute',
  top: '0%',
  right: '0%',
  transform: 'translate(-50%, 50%)'
};

// ============================|| OUTPUT VALUES ||============================ //

const EditForm = (props) => {
  let { open, handleClose, check, qrData, setRefreshData } = props;

  const handleEdit = async (values) => {
    let result = await history.editHistoryQrCode(values);
    if (result) {
      handleClose();
      setRefreshData(true);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Edit data successfully'
      });
    } else {
      handleClose();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot edit data'
      });
    }
  };

  if (qrData.id === check) {
    return (
      <>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={boxStyle}>
            <IconButton onClick={handleClose} sx={closeButtonStyle}>
              <CloseCircleFilled />
            </IconButton>
            <Typography id="modal-modal-title" variant="h4" component="h1">
              Edit description
            </Typography>
            <Typography sx={{ marginBottom: '20px' }}>รหัสอ้างอิง: {qrData.reference}</Typography>
            <Formik
              initialValues={{
                id: qrData.id,
                customerName: qrData.customer,
                status: qrData.status,
                remark: qrData.remark
              }}
              validationSchema={Yup.object({
                customerName: Yup.string().required('Name is required')
              })}
              onSubmit={(values) => {
                handleEdit(values);
              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, handleReset, initialValues }) => (
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
                      {touched.customerName && errors.customerName && (
                        <FormHelperText error id="standard-weight-helper-textcustomer-name">
                          {errors.customerName}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        select
                        id="demo-simple-select"
                        name="status"
                        value={values.status}
                        label="Status"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      >
                        <MenuItem value={'Created'}>Created</MenuItem>
                        <MenuItem value={'Canceled'}>Canceled</MenuItem>
                        <MenuItem value={'Paid'}>Paid</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="outlined-required"
                        label="Remark"
                        name="remark"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                            disabled={
                              isSubmitting || values == initialValues || !(touched.customerName || touched.status || touched.remark)
                            }
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                            onSubmit={handleSubmit}
                          >
                            Edit
                          </Button>
                        </AnimateButton>
                        <AnimateButton>
                          <Button disableElevation size="large" type="reset" variant="contained" color="secondary" onReset={handleReset}>
                            Reset
                          </Button>
                        </AnimateButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Box>
        </Modal>
      </>
    );
  }
};

export default EditForm;
