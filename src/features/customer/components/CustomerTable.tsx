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
import userApi from 'api/userApi';
import dayjs from 'dayjs';
import { User } from 'models';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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
  onRestoreUser: (user :User) => void;
}
function Row({ row, onRestoreUser }: RowProps) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const hanldeClickUser = async (user: User) => {
    await onRestoreUser(user);
  };
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
        <TableCell align="center">
          <Button
            size="small"
            color="primary"
            onClick={() => {
              hanldeClickUser(row);
            }}
          >
            Y??u c???u kh??i ph???c m???t kh???u
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                ????n h??ng ???? ?????t
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>M?? ????n h??ng</TableCell>
                    <TableCell>?????a ch??? giao h??ng </TableCell>
                    <TableCell>Ph?? ship</TableCell>
                    <TableCell>Th???i gian giao h??ng d??? ki???n</TableCell>
                    <TableCell>S??? ??i???n th???ai</TableCell>
                    <TableCell>Ng??y ?????t</TableCell>
                    <TableCell>Tr???ng th??i</TableCell>
                    <TableCell>Chi ti???t</TableCell>
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
                        {item.shipmentInfo.status ? '??ang giao' : 'Ch??a g???i h??ng'}
                      </TableCell>
                      <TableCell align="right">
                        <Link to={`order/${item.id}`} style={{ textDecoration: 'none' }}>
                          <Button size="small" color="primary">
                            Xem chi ti???t
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
   const MySwal = withReactContent(Swal);
  const onRestoreUser = async (user: User) => {
    try {
       await userApi.RestoreUserById(user.id as number);
       MySwal.fire(
         'Th??nh c??ng',
         'T??i kho???n ???? ???????c kh??i ph???c m???t kh???u 123456789 li??n h??? kh??ch h??ng ????? ?????i m???t kh???u!',
         'success'
       );
    } catch (error) {
      MySwal.fire(
        'Th???t b???i',
        'X???y ra l???i vui l??ng th??? l???i sau!',
        'error'
      );
    }
   
  };
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">T??n kh??ch h??ng</TableCell>
            <TableCell align="center">Email li??n h???</TableCell>
            <TableCell align="center">S??? ??i???n tho???i</TableCell>{' '}
            <TableCell align="center">H??nh ?????ng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList?.map((row, index) => (
            <Row key={index} row={row} onRestoreUser={onRestoreUser} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 