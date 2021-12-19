import { Box, Button, Card, CardContent, createStyles, Grid, Theme, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import orderApi from 'api/orderApi';
import dayjs from 'dayjs';
import { Order, OrderDetails } from 'models';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { numberWithCommas } from 'utils';
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});
export interface RowProps {
  row?: OrderDetails[];
}
function Row({ row }: RowProps) {
  const classes = useRowStyles();
  return (
    <React.Fragment>
      {row?.map((item, index) => (
        <TableRow className={classes.root} key={index}>
          <TableCell component="th" scope="row">
            {item?.productName}
          </TableCell>
          <TableCell>{item?.quantity}</TableCell>
          <TableCell>{numberWithCommas(item?.price)}</TableCell>
          <TableCell>{item?.color}</TableCell>
          <TableCell>{item?.size}</TableCell>
          <TableCell>{dayjs(item?.createdAt).format('MM-DD-YYYY')}</TableCell>
          <TableCell>{numberWithCommas(item?.price*item?.quantity)}</TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  );
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    box: {
      width: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    card: {
      minWidth: '500px',
    },
    text: {
      color: theme.palette.text.primary,
      fontWeight: 'bold',
      fontSize: 14,
    },
  })
);
export default function OrderDetail() {
   const classes = useStyles();
const { orderId } = useParams<{ orderId: string }>();
    const [order,setOrder]  =useState<Order>()
  useEffect(() => {
      try {
          async function getOrder() {
            const response = await orderApi.getById(Number(orderId));
            setOrder(response);
          }
          getOrder();
      } catch (error) {
          console.log(error);
      }
      
  }, [orderId]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Link to="/admin/order">
          <Button variant="contained" color="primary">
            Quay lại
          </Button>
        </Link>
        <Card className={classes.card}>
          <CardContent>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Tên khách hàng
              </Typography>
              <Typography className={classes.text} variant="h5" component="h2">
                {order?.shipmentInfo.name_customer}
              </Typography>
            </Box>
            <Box mt={4} mb={4}>
              <Typography color="textSecondary">Địa chỉ giao hàng</Typography>
              <Typography variant="body2" component="h3" className={classes.text}>
                {order?.shipmentInfo.address}
              </Typography>
            </Box>
            <Box>
              <Typography color="textSecondary">Số điện thoại</Typography>
              <Typography variant="body2" component="h3" className={classes.text}>
                {order?.shipmentInfo.phone}
              </Typography>
            </Box>
            <Box mt={4}>
              <Typography color="textSecondary">Email</Typography>
              <Typography variant="body2" component="h3" className={classes.text}>
                {order?.shipmentInfo?.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Box mt={4} width="100%">
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng </TableCell>
                  <TableCell>Đơn giá</TableCell>
                  <TableCell>Màu </TableCell>
                  <TableCell>Kích cỡ</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Row row={order?.OrderDetails} />
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
      <Grid item xs={6}></Grid>
      <Box mt={4}>
        <Grid item xs={6}>
          <Box className={classes.box}>
            <Typography color="textPrimary">Phí ship :</Typography>
            <Typography variant="body2" component="h3" className={classes.text}>
              {numberWithCommas(order?.shipmentInfo.ship_cost)}
            </Typography>
          </Box>
          <Box className={classes.box}>
            <Typography color="textPrimary">Tổng tiền :</Typography>
            <Typography variant="body2" component="h3" className={classes.text}>
              {numberWithCommas(order?.amount)}
            </Typography>
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
}
