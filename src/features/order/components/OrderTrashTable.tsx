import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import orderApi from 'api/orderApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Order } from 'models';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { numberWithCommas } from 'utils';
import { orderActions, selectOrderFilter } from '../orderSlice';
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


export interface RowProps {
  row: Order;
  onRestoreOrder: (item: Order) => void;
}
function Row({ row, onRestoreOrder }: RowProps) {
  // const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveClick = (order: Order): void => {
    setSelectedOrder(order);
    setOpen(true);
  };
  const handleRemoveComfirm = async (order: Order) => {
    await onRestoreOrder(order);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        {/* <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell> */}
        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">
          {row.orderType === 'Normal' ? 'Thanh to??n khi nh???n h??ng' : row.orderType}
        </TableCell>
        <TableCell align="center">{numberWithCommas(row.amount)}</TableCell>
        <TableCell align="center">{dayjs(row.createdAt).format('MM-DD-YYYY')}</TableCell>
        <TableCell align="center">
          {row.shipmentInfo?.name_customer && row.shipmentInfo?.name_customer}
        </TableCell>
        <TableCell align="center">{row.status}</TableCell>
        <TableCell align="center">
          {row.status === '???? h???y' && (
            <Button
              size="small"
              color="primary"
              onClick={() => {
                handleRemoveClick(row);
              }}
            >
              Kh??i ph???c
            </Button>
          )}
        </TableCell>
        <TableCell align="center">
          <Link to={`order/${row?.id}`} style={{ textDecoration: 'none' }}>
            <Button size="small" color="primary">
              Xem chi ti???t
            </Button>
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}></TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">B???n mu???n kh??i ph???c ????n h??ng n??y ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            V?? g???i mail th??ng b??o cho Kh??ch h??ng <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default" variant="outlined">
            H???y
          </Button>
          <Button
            onClick={() => handleRemoveComfirm(selectedOrder as Order)}
            color="primary"
            variant="contained"
            autoFocus
          >
            X??c nh???n
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default function OrderTrashTable() {
  const history = useHistory();
  const [orderList,setOrderList] = useState<Order[]>()
  const MySwal = withReactContent(Swal);
  const filter = useAppSelector(selectOrderFilter);
  const dispatch = useAppDispatch();
  useEffect(() => {
      const getTrashOrder = async () => {
          const response = await orderApi.getAllTrash();
          setOrderList(response?.data);
      }
      getTrashOrder();
  }, []);
  const handleRestoreOrder = async (item: Order) => {
    try {
      await orderApi.restore(item.id as number);
      MySwal.fire('Th??nh c??ng', 'Kh??i ph???c ????n ?????t h??ng', 'success').then(() => {
        history.push('/admin/order')
      });
      dispatch(orderActions.fetchOrderList(filter));
    } catch (error) {
      let msg = (error as AxiosError).response?.data.message;
      MySwal.fire(msg, 'Xin ki???m tra l???i ', 'error');
    }
  };
  return (
    <>
      <Box mb={4}>
        <Typography variant="h4">????n h??ng b??? h???y</Typography>
      </Box>
      <Link to="/admin/order">
        <Button variant="contained" color="primary">
          Quay l???i
        </Button>
      </Link>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="center">M?? ????n ?????t h??ng</TableCell>
              <TableCell align="center">Ph????ng th???c thanh to??n</TableCell>
              <TableCell align="center">T???ng ti???n</TableCell>
              <TableCell align="center">Ng??y ?????t h??ng</TableCell>
              <TableCell align="center">T??n kh??ch h??ng</TableCell>
              <TableCell align="center">Tr???ng th??i</TableCell>
              <TableCell align="center">H??nh ?????ng</TableCell>
              <TableCell align="center">Chi ti???t</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList?.map((row, index) => (
              <Row key={index} row={row} onRestoreOrder={handleRestoreOrder} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
 