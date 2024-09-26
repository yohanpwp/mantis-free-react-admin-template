// import reactHooks from react
import { useEffect, useContext, useState } from 'react';
// import from 3rd party
import Swal from 'sweetalert2';
// material-ui
import { Button } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
// project import
import { getHistoryQrCode } from 'utils/qrdatabase';
import { UserContext } from 'contexts/auth-reducer/ีuserprovider/UserProvider';
import { getUserData } from 'utils/userdatabase';
import QrResponse from './QrResponse';
import getNameFromBankCode from 'utils/getNameFromBankCode';

// ==============================|| INPUT VALUE ||============================== //

// ==============================|| INPUT STYLE ||============================== //
const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity)
        }
      }
    }
  }
}));

// ==============================|| OUTPUT VALUE ||============================== //
const QrHistory = () => {
  // เปลี่ยน header หน้าเพจ
  document.title = 'SCB Payment - History';
  // set state
  const [open, setOpen] = useState(false);
  const [ref1, setRef1] = useState('');
  const { data, setData, setIsLoading } = useContext(UserContext);

  const getUsername = async () => {
    const userData = await getUserData();
    return userData;
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      let user = await getUsername();
      if (user) {
        let data = await getHistoryQrCode(user);
        setIsLoading(false);
        setData(data);
      }
    };
    getData();
  }, [setData]);

  const showStatus = (params) => {
    let data = params.row;
    const importValue = String(params.value).split(' ');
    const value = importValue[0];
    const ref = importValue[1];
    const handleOpen = (ref) => {
      setOpen(true);
      setRef1(ref);
    };
    const handleClose = () => {
      setOpen(false);
    };
    switch (value) {
      case 'Pending':
        return <Button color="warning">{value}</Button>;
      case 'Failed':
        return <Button color="error">{value}</Button>;
      case 'Paid':
        return (
          <div>
            <Button onClick={() => handleOpen(ref)} color="success">
              {value}
            </Button>
            <QrResponse open={open} handleClose={handleClose} data={data} check={ref1} />
          </div>
        );
      default:
        return <Button>{value}</Button>;
    }
  };
  const columns = [
    { field: 'index', headerName: 'No.', align: 'center', headerAlign: 'center', width: 50 },
    {
      field: 'images',
      headerName: 'QR Images',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      width: 100,
      renderCell: (params) => (
        <img
          src={`data:image/png;base64,${params.value}`}
          alt="QR Code"
          style={{ height: '50px', width: '50px', verticalAlign: 'middle' }}
        />
      )
    },
    { field: 'amount', headerName: 'Amounts', sortable: false, align: 'center', headerAlign: 'center', width: 120 },
    { field: 'customer', headerName: 'Customer', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      width: 130,
      renderCell: (params) => showStatus(params)
    },
    { field: 'reference', headerName: 'Reference', sortable: false, width: 130 },
    {
      field: 'dates',
      headerName: 'Generated dates',
      sortable: false,
      width: 170,
      valueGetter: (values, rows) => `${rows.dates} ${rows.times}`
    },
    { field: 'remark', headerName: 'Remark', sortable: false, width: 130 },
    { field: 'payerAccountNumber', headerName: 'payerAccountNumber', sortable: false, width: 130 },
    { field: 'payerAccountName', headerName: 'payerAccountName', sortable: false, width: 130 },
    { field: 'sendingBankCode', headerName: 'sendingBank', sortable: false, width: 130 },
    { field: 'receivingBankCode', headerName: 'receivingBank', sortable: false, width: 130 },
    { field: 'transactionId', headerName: 'transactionId', sortable: false, width: 130 }
  ];

  let rows = [];
  if (data.length === 0) {
    return;
  } else if (data.length > 0) {
    rows = data?.map((item, index) => {
      return {
        ...item,
        index: index + 1,
        images: item.qrCode,
        amount: Number(item.amounts).toFixed(2),
        customer: item.customer,
        status: item.status + ' ' + item.ref1,
        reference: item.ref1,
        reference2: item.ref2,
        reference3: item.ref3,
        qrCode: item.qrCode,
        notShowDates: item.createdAt,
        dates: Intl.DateTimeFormat(['ban', 'id']).format(Date.parse(item.createdAt)),
        times: Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(Date.parse(item.createdAt)),
        remark: item.remark,
        scbResponse: item.scbResponse,
        payerAccountNumber: item.scbResponse?.payerAccountNumber,
        payerAccountName: item.scbResponse?.payerAccountName,
        sendingBankCode: getNameFromBankCode(item.scbResponse?.sendingBankCode),
        receivingBankCode: getNameFromBankCode(item.scbResponse?.receivingBankCode),
        transactionId: item.scbResponse?.transactionId
      };
    });
  }

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <StripedDataGrid
      rows={rows}
      rowHeight={60}
      columns={columns}
      initialState={{ pagination: { paginationModel } }}
      pageSizeOptions={[5, 10]}
      spacing={1}
      sx={{ border: 0 }}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
    />
  );
};

export default QrHistory;
