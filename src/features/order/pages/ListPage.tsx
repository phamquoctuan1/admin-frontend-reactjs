import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { useEffect } from 'react';
import OrderTable from '../components/OrderTable';
import {
  orderActions,
  selectOrderFilter,
  selectOrderList,
  selectOrderLoading,
  selectOrderPagination
} from '../orderSlice';


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    paddingTop: theme.spacing(1),
  },
  titleContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(6),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
  },
  loading: { position: 'absolute', top: theme.spacing(-1), width: '100%' },
}));
export default function ListPage() {
 
  const classes = useStyles();
  const loading = useAppSelector(selectOrderLoading);
    const pagination = useAppSelector(selectOrderPagination);
     const filter = useAppSelector(selectOrderFilter);
       const dispatch = useAppDispatch();
        const orderList = useAppSelector(selectOrderList);
       useEffect(() => {
         dispatch(orderActions.fetchOrderList(filter));
       }, [dispatch, filter]);
      
    const handlePageChange = (e: any, page: number) => {
      dispatch(
        orderActions.setFilter({
          ...filter,
          _page: page,
        })
      );
    };

  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4"> Quản lý đơn hàng</Typography>
      </Box>
      <OrderTable orderList={orderList}  />
      <Box mt={2} className={classes.pagination}>
        <Pagination
          color="primary"
          count={Math.ceil(pagination._totalRows / pagination._limit)}
          page={pagination._page}
          onChange={handlePageChange}
        />
      </Box>
      {/* Pagination */}
    </Box>
  );
}
