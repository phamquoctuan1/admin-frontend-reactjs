import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import dayjs from 'dayjs';
import { User } from 'models';
import React, { useState } from 'react';
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
  row: User;
}
function Row({ row }: RowProps) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">{row.email}</TableCell>
        <TableCell align="center">{row.phone}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Đơn hàng đã đặt
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
                  {row?.orderInfo?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.shipmentInfo.address}</TableCell>
                      <TableCell>{numberWithCommas(item.shipmentInfo.ship_cost)}</TableCell>
                      <TableCell>{item.shipmentInfo.estimated_time}</TableCell>
                      <TableCell>{item.shipmentInfo.phone}</TableCell>
                      <TableCell>
                        {dayjs(item.shipmentInfo.ship_date).format('MM-DD-YYYY')}
                      </TableCell>
                      <TableCell>
                        {item.shipmentInfo.status ? 'Đang giao' : 'Chưa gửi hàng'}
                      </TableCell>
                      <TableCell align="right">
                        <Link to={`order/${item.id}`} style={{ textDecoration: 'none' }}>
                          <Button size="small" color="primary">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export interface OrderTableProps {
  userList?: User[];
}

export default function CustomerTable({userList }: OrderTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">Tên khách hàng</TableCell>
            <TableCell align="center">Email liên hệ</TableCell>
            <TableCell align="center">Số điện thoại</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList?.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 