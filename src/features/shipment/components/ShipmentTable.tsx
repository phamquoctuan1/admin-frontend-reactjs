import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import shipmentApi from 'api/shipmentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Shipment } from 'models';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { numberWithCommas } from 'utils';
import { selectShipmentFilter, shipmentActions } from '../shipmentSlice';
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
  onComfirmStatus: (item: Shipment) => void;
  onCancelStatus: (item: Shipment) => void;
}
function Row({ row, onComfirmStatus, onCancelStatus }: RowProps) {
  const classes = useRowStyles();
  const handleComfirmClick = async (item: Shipment) => {
    await onComfirmStatus(item);
  };
  const handleCancelClick = async (item: Shipment) => {
    await onCancelStatus(item);
  };

  return (
    <React.Fragment>
      {row.orderInfo.status !== 'Chờ xác nhận' && (
        <TableRow className={classes.root}>
          <TableCell align="center">{row.id}</TableCell>
          <TableCell align="center">{row.orderInfo?.name}</TableCell>
          <TableCell align="center">{numberWithCommas(row.orderInfo?.amount)}</TableCell>
          <TableCell align="center">{row.address}</TableCell>
          <TableCell align="center">{row.phone}</TableCell>
          <TableCell align="center">{dayjs(row.ship_date).format('MM-DD-YYYY')}</TableCell>
          <TableCell align="center">{row.name_customer && row.name_customer}</TableCell>
          <TableCell align="center">{row.status}</TableCell>
          <TableCell align="center">
            {row.status === 'Đang giao hàng' && (
              <>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    handleComfirmClick(row);
                  }}
                >
                  Xác nhận giao hàng thành công
                </Button>
                <hr />
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => {
                    handleCancelClick(row);
                  }}
                >
                  Xác nhận giao hàng thất bại
                </Button>
              </>
            )}
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}></TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export interface ShipmentTableProps {
  shipmentList: Shipment[];
}

export default function ShipmentTable({ shipmentList }: ShipmentTableProps) {
  const MySwal = withReactContent(Swal);
  const filter = useAppSelector(selectShipmentFilter);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(shipmentActions.fetchShipmentList(filter));
  }, [dispatch, filter]);
  const handleConfirmClick = async (item: Shipment) => {
    try {
      await shipmentApi.update(item.id as number);
      MySwal.fire('Thành công', 'Xác nhận đơn hàng đã hoàn tất', 'success');
      dispatch(shipmentActions.fetchShipmentList(filter));
    } catch (error) {
      let msg = (error as AxiosError).response?.data.message;
      MySwal.fire(msg, 'Xin kiểm tra lại ', 'error');
    }
  }; 
  const handleCancelClick = async (item: Shipment) => {
    try {
      await shipmentApi.cancel(item.id as number);
      MySwal.fire('Thành công', 'Xác nhận đơn hàng giao không thành công', 'success');
      dispatch(shipmentActions.fetchShipmentList(filter));
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
          </TableRow>
        </TableHead>
        <TableBody>
          {shipmentList.map((row, index) => (
            <Row key={index} row={row} onComfirmStatus={handleConfirmClick} onCancelStatus={handleCancelClick} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 