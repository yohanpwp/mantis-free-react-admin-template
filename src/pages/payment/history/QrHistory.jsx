// import reactHooks from react
import { useEffect, useContext, useState } from 'react';
// import from 3rd party
import Swal from 'sweetalert2';
// material-ui
import { Button, Box, Modal, IconButton, Tooltip } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { FileAddFilled, EditTwoTone, DeleteTwoTone, CheckSquareFilled } from '@ant-design/icons';
// project import
import { getHistoryQrCode, history } from 'utils/qrdatabase';
import { UserContext } from 'contexts/auth-reducer/ีuserprovider/UserProvider';
import { getUserData } from 'utils/userdatabase';
import QrResponse from './QrResponse';
import getNameFromBankCode from 'utils/getNameFromBankCode';
import EditForm from '../forms/EditForm';

// ==============================|| INPUT VALUE ||============================== //

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
  textAlign: 'center',
  p: 4
};

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
  const [open, setOpen] = useState({ showStatus: false, image: false });
  const [ref1, setRef1] = useState('');
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false
  });
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

  function CustomToolbar() {
    const handleClickEdit = () => {
      if (columnVisibilityModel.id == false) {
        setColumnVisibilityModel({
          id: true
        });
      } else {
        setColumnVisibilityModel({
          id: false
        });
      }
    };
    return (
      <GridToolbarContainer>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClickEdit} size="small" color="success" startIcon={<EditTwoTone twoToneColor={'#66bb6a'} />}>
          Edit
        </Button>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const showStatus = (params) => {
    let data = params.row;
    const importValue = String(params.value).split(' ');
    const value = importValue[0];
    const ref = importValue[1];
    const handleOpen = (ref) => {
      setOpen({ showStatus: true, image: false });
      setRef1(ref);
    };
    const handleClose = () => {
      setOpen({ showStatus: false, image: false });
    };
    switch (value) {
      case 'Pending':
        return <Button color="warning">{value}</Button>;
      case 'Failed':
        return <Button color="error">{value}</Button>;
      case 'Paid':
        return (
          <>
            <Tooltip title="Click here to show your information." arrow>
              <IconButton onClick={() => handleOpen(ref)} sx={{ padding: 0, height: '15px', width: '15px' }}>
                <CheckSquareFilled style={{ fontSize: '15px', color: 'green' }} />
              </IconButton>
            </Tooltip>
            {` ${value}`}
            <QrResponse open={open.showStatus} handleClose={handleClose} data={data} check={ref1} />
          </>
        );
      default:
        return (
          <>
            <FileAddFilled style={{ fontSize: '15px', color: 'blue' }} />
            {` ${value}`}
          </>
        );
    }
  };

  const handleEdit = (params) => {
    let data = params.row;
    const id = params.value;
    const handleOpen = () => {
      setEditFormOpen(true);
      setRef1(id);
    };
    const handleClose = () => {
      setEditFormOpen(false);
    };
    return (
      <>
        <Tooltip title="Click here to edit." arrow>
          <IconButton onClick={handleOpen} sx={{ padding: 0, height: '15px', width: '15px' }}>
            <EditTwoTone style={{ fontSize: '15px', color: 'blue' }} />
          </IconButton>
        </Tooltip>
        <EditForm open={editFormOpen} handleClose={handleClose} data={data} check={ref1} />
      </>
    );
  };

  const handleDelete = (params) => {
    const id = { id: params.value };
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this QR code?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        history.deleteHistoryQrCode(id);
        Swal.fire('Deleted!', '', 'success');
      } else if (result.isDismissed) {
        return;
      }
    });
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      sortable: false,
      width: 50,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          {handleEdit(params)}
          <Tooltip title="Click here to delete." arrow>
            <IconButton onClick={() => handleDelete(params)} sx={{ padding: 0, height: '15px', width: '15px' }}>
              <DeleteTwoTone twoToneColor="#eb2f96" style={{ fontSize: '15px', marginLeft: '10px' }} />
            </IconButton>
          </Tooltip>
        </>
      )
    },
    { field: 'index', headerName: 'No.', align: 'center', headerAlign: 'center', width: 50 },
    {
      field: 'dates',
      headerName: 'Generated dates',
      sortable: false,
      width: 170,
      valueGetter: (values, rows) => `${rows.dates} ${rows.times}`
    },
    { field: 'customer', headerName: 'Customer', width: 130 },
    { field: 'reference', headerName: 'Reference', sortable: false, width: 130 },
    { field: 'amount', headerName: 'Amounts', sortable: false, align: 'center', headerAlign: 'center', width: 120 },
    {
      field: 'checkStatus',
      headerName: 'Status',
      sortable: false,
      width: 130,
      renderCell: (params) => showStatus(params)
    },
    { field: 'remark', headerName: 'Remark', sortable: false, width: 130 },
    {
      field: 'images',
      headerName: 'QR Images',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      width: 100,
      renderCell: (params) => (
        <>
          <Button onClick={() => setOpen({ showStatus: false, image: true })} color="success">
            Show
          </Button>
          <Modal
            open={open?.image}
            onClose={() => setOpen({ showStatus: false, image: false })}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <img
                src={`data:image/png;base64,${params.value}`}
                alt="QR Code"
                style={{ height: '250px', width: '250px', verticalAlign: 'middle' }}
              />
            </Box>
          </Modal>
        </>
      )
    },
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
        id: item.id,
        index: index + 1,
        images: item.qrCode,
        amount: Number(item.amounts).toFixed(2),
        customer: item.customer,
        status: item.status,
        checkStatus: item.status + ' ' + item.ref1,
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
      initialState={{
        pagination: { paginationModel }
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      pageSizeOptions={[5, 10]}
      spacing={1}
      sx={{ border: 0 }}
      slots={{ toolbar: CustomToolbar }}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
    />
  );
};

export default QrHistory;
