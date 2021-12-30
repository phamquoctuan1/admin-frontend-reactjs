import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
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
import { Link } from 'react-router-dom';
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
  params?: any;
  onComfirmStatus: (item: Order) => void;
  onRemoveOrder: (item: Order) => void;
}
function Row({ row, onComfirmStatus, onRemoveOrder }: RowProps) {
  // const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const handleComfirmClick = async (item: Order) => {
    await onComfirmStatus(item);
  };
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
    await onRemoveOrder(order);
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
          {row.orderType === 'Normal' ? 'Thanh toán khi nhận hàng' : row.orderType}
        </TableCell>
        <TableCell align="center">{numberWithCommas(row.amount)}</TableCell>
        <TableCell align="center">{dayjs(row.createdAt).format('MM-DD-YYYY')}</TableCell>
        <TableCell align="center">
          {row.shipmentInfo?.name_customer && row.shipmentInfo?.name_customer}
        </TableCell>
        <TableCell align="center">{row.status}</TableCell>
        <TableCell align="center">
          {row.status === 'Chờ xác nhận' && (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  handleComfirmClick(row);
                }}
              >
                Tiến hành giao hàng
              </Button>

              <hr />
              <Button
                size="small"
                color="secondary"
                onClick={() => {
                  handleRemoveClick(row);
                }}
              >
                Hủy đơn hàng
              </Button>
            </>
          )}
        </TableCell>
        <TableCell align="center">
          <Link to={`order/${row?.id}`} style={{ textDecoration: 'none' }}>
            <Button size="small" color="primary">
              Xem chi tiết
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
        <DialogTitle id="alert-dialog-title">Bạn muốn hủy đơn hàng này ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Và gửi mail thông báo cho Khách hàng <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={() => handleRemoveComfirm(selectedOrder as Order)}
            color="primary"
            variant="contained"
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export interface OrderTableProps {
  orderList: Order[];

}

export default function OrderTable({ orderList }: OrderTableProps) {
  const MySwal = withReactContent(Swal);
  const filter = useAppSelector(selectOrderFilter);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(orderActions.fetchOrderList(filter));
  }, [dispatch, filter]);
  const handleConfirmClick = async (item: Order) => {
    try {
      await orderApi.update(item.id as number);
      MySwal.fire('Thành công', 'Xác nhận đơn đặt hàng', 'success');
      dispatch(orderActions.fetchOrderList(filter));
    } catch (error) {
      let msg = (error as AxiosError).response?.data.message;
      MySwal.fire(msg, 'Xin kiểm tra lại ', 'error');
    }
  };
  const handleRemoveOrder = async (item: Order)=>{
    try { 
     await orderApi.delete(item.id as number);
      MySwal.fire('Thành công', 'Đơn hàng đã bị hủy kiểm tra thùng rác', 'success');
      dispatch(orderActions.fetchOrderList(filter));
    } catch (error) {
      let msg = (error as AxiosError).response?.data.message;
      MySwal.fire(msg, 'Xin kiểm tra lại ', 'error');
    
    }
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="center">Mã đơn đặt hàng</TableCell>
            <TableCell align="center">Phương thức thanh toán</TableCell>
            <TableCell align="center">Tổng tiền</TableCell>
            <TableCell align="center">Ngày đặt hàng</TableCell>
            <TableCell align="center">Tên khách hàng</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Hành động</TableCell>
            <TableCell align="center">Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList.map((row, index) => (
            <Row
              key={index}
              row={row}
              onComfirmStatus={handleConfirmClick}
              onRemoveOrder={handleRemoveOrder}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 