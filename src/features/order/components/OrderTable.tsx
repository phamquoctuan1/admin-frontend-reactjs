import { Button } from '@material-ui/core';
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
import { Order, Shipment } from 'models';
import React, { useEffect } from 'react';
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
  row: Shipment;
  params?: any;
  onClickStatus: (item: Order) => void;
}
function Row({ row, onClickStatus }: RowProps) {
 
  // const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const handleComfirmClick = async (item: Order) => {
    await onClickStatus(item);
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
        <TableCell align="center">{row.orderInfo.name}</TableCell>
        <TableCell align="center">{numberWithCommas(row.orderInfo.amount)}</TableCell>
        <TableCell align="center">{row.address}</TableCell>
        <TableCell align="center">{row.phone}</TableCell>
        <TableCell align="center">{dayjs(row.ship_date).format('MM-DD-YYYY')}</TableCell>
        <TableCell align="center">{row.name_customer && row.name_customer}</TableCell>
        <TableCell align="center">
          {row.orderInfo.status ? 'Đã xác nhận' : 'Chờ xác nhận'}
        </TableCell>
        <TableCell align="center">
          {row.orderInfo.status || (
            <Button
              size="small"
              color="primary"
              onClick={() => {
                handleComfirmClick(row.orderInfo);
              }}
            >
              Giao hàng
            </Button>
          )}
        </TableCell>
        <TableCell align="center">
          <Link to={`order/${row.orderInfo.id}`} style={{ textDecoration: 'none' }}>
            <Button size="small" color="primary">
              Xem chi tiết
            </Button>
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          {/* <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Chi tiết đơn hàng
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn hàng</TableCell>
                    <TableCell>Địa chỉ giao hàng </TableCell>
                    <TableCell>Phí ship</TableCell>
                    <TableCell>Thời gian giao hàng dự kiến</TableCell>
                    <TableCell>Số điện thọai</TableCell>
                    <TableCell>Ngày đặt</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Chi tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.shipmentInfo?.address}</TableCell>
                    <TableCell>{numberWithCommas(row.shipmentInfo?.ship_cost)}</TableCell>
                    <TableCell>{row.shipmentInfo?.estimated_time}</TableCell>
                    <TableCell>{row.shipmentInfo?.phone}</TableCell>
                    <TableCell>{dayjs(row.shipmentInfo?.ship_date).format('MM-DD-YYYY')}</TableCell>
                    <TableCell>
                      {row.shipmentInfo?.status ? 'Đang giao' : 'Chưa gửi hàng'}
                    </TableCell>
                    <TableCell align="right">
                      <Link to={`order/${row.id}`} style={{ textDecoration: 'none' }}>
                        <Button size="small" color="primary">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse> */}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export interface OrderTableProps {
  orderList: Shipment[];

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
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="center">Mã đơn đặt hàng</TableCell>
            <TableCell align="center">Tổng tiền</TableCell>
            <TableCell align="center">Địa chỉ giao hàng</TableCell>
            <TableCell align="center">Số điện thoại</TableCell>
            <TableCell align="center">Ngày đặt hàng</TableCell>
            <TableCell align="center">Tên khách hàng</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Hành động</TableCell>
            <TableCell align="center">Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList.map((row, index) => (
            <Row key={index} row={row} onClickStatus={handleConfirmClick} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 