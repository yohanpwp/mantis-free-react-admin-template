// import reactHooks from react
import { useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import from 3rd party
import Swal from 'sweetalert2';
// material-ui
import { Button, Box, Modal, IconButton, Tooltip } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { FileAddFilled, EditTwoTone, DeleteTwoTone, CheckSquareFilled, CloseCircleFilled, DownloadOutlined } from '@ant-design/icons';
// project import
import { getHistoryQrCode, history } from 'utils/qrdatabase';
import { UserContext } from 'contexts/auth-reducer/ีuserprovider/UserProvider';
import { getUserData } from 'utils/userdatabase';
import QrResponse from './QrResponse';
import getNameFromBankCode from 'utils/getNameFromBankCode';
import EditForm from '../forms/EditForm';
import * as ExcelJS from 'exceljs';

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
  const [refreshData, setRefreshData] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false
  });
  const { data, setData, setIsLoading } = useContext(UserContext);
  // import i18n hook
  const { t } = useTranslation();

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
        setRefreshData(false);
      }
    };
    getData();
  }, [refreshData]);

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
          {t('Edit')}
        </Button>
        <Button onClick={handleExportToExcel} size="small" color="primary" startIcon={<DownloadOutlined />}>
          {t('Export')}
        </Button>
      </GridToolbarContainer>
    );
  }

  const showStatus = (params) => {
    let data = params.row;
    const importValue = String(params.value).split(' ');
    const value = t(importValue[0]);
    const ref = importValue[1];
    const handleOpen = (ref) => {
      setOpen({ showStatus: true, image: false });
      setRef1(ref);
    };
    const handleClose = () => {
      setOpen({ showStatus: false, image: false });
    };
    switch (value) {
      case t('Canceled'):
        return (
          <>
            <CloseCircleFilled style={{ fontSize: '15px', color: 'orange' }} /> {value}
          </>
        );
      case t('Paid'):
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
    let qrData = params.row;
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
        <EditForm open={editFormOpen} handleClose={handleClose} qrData={qrData} check={ref1} setRefreshData={setRefreshData} />
      </>
    );
  };

  const handleDelete = (params) => {
    const id = { id: params.value };
    Swal.fire({
      title: t('Are you sure?'),
      text: t(`You want to delete this QR code?`),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Yes, delete it!'),
      cancelButtonText: t('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        history.deleteHistoryQrCode(id);
        setData(data.filter((item) => item.id !== id.id));
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
    { field: 'index', headerName: t('No.'), align: 'center', headerAlign: 'center', width: 50 },
    {
      field: 'dates',
      headerName: t('Generated Date'),
      sortable: false,
      width: 170,
      valueGetter: (values, rows) => `${rows.dates} ${rows.times}`
    },
    { field: 'customer', headerName: t('Customer'), width: 130 },
    { field: 'reference', headerName: t('Reference'), sortable: false, width: 130 },
    { field: 'amount', headerName: t('Amount'), sortable: false, align: 'center', headerAlign: 'center', width: 120 },
    {
      field: 'checkStatus',
      headerName: t('Status'),
      sortable: false,
      width: 130,
      renderCell: (params) => showStatus(params)
    },
    { field: 'remark', headerName: t('Remark'), sortable: false, width: 130 },
    {
      field: 'images',
      headerName: t('QR Images'),
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      width: 100,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => {
              setRef1(params.value);
              setOpen({ showStatus: false, image: true });
            }}
            color="success"
          >
            Show
          </Button>
          <Modal
            open={open?.image}
            onClose={() => {
              setOpen({ showStatus: false, image: false });
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <img
                src={`data:image/png;base64,${ref1}`}
                alt="QR Code"
                style={{ height: '250px', width: '250px', verticalAlign: 'middle' }}
              />
            </Box>
          </Modal>
        </>
      )
    },
    { field: 'payerAccountNumber', headerName: t('payerAccountNumber'), sortable: false, width: 130 },
    { field: 'payerAccountName', headerName: t('payerAccountName'), sortable: false, width: 130 },
    { field: 'sendingBankCode', headerName: t('sendingBank'), sortable: false, width: 130 },
    { field: 'receivingBankCode', headerName: t('receivingBank'), sortable: false, width: 130 },
    { field: 'transactionId', headerName: t('transactionId'), sortable: false, width: 130 }
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

  //Build an excel file
  const handleExportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const fileName = 'qr_history.xlsx';
    // Create a worksheet with the first row and column frozen
    const sheet = workbook.addWorksheet('QR History', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });
    sheet.columns = [
      { header: t('No.'), key: 'index', width: 5 },
      { header: t('Generated Date'), key: 'dates', width: 15 },
      { header: t('Customer'), key: 'customer', width: 30 },
      { header: t('Amount'), key: 'amount', width: 10 },
      { header: t('Status'), key: 'status', width: 10 },
      { header: t('ref1'), key: 'reference', width: 10 },
      { header: t('ref2'), key: 'reference2', width: 5 },
      { header: t('ref3'), key: 'reference3', width: 5 },
      { header: t('Remark'), key: 'remark', width: 15 },
      { header: t('QR Images'), key: 'images', width: 15 },
      { header: t('payerAccountNumber'), key: 'payerAccountNumber', width: 20 },
      { header: t('payerAccountName'), key: 'payerAccountName', width: 20 },
      { header: t('sendingBank'), key: 'sendingBankCode', width: 15 },
      { header: t('receivingBank'), key: 'receivingBankCode', width: 15 },
      { header: t('transactionId'), key: 'transactionId', width: 15 }
    ];
    sheet.addRows(rows);
    //Save the excel file by filename
    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

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
