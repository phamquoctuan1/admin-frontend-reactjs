import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { useEffect } from 'react';
import OrderTable from '../components/ShipmentTable';
import {
  shipmentActions,
  selectShipmentFilter,
  selectShipmentList,
  selectShipmentLoading,
  selectShipmentPagination,
} from '../shipmentSlice';

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
  const loading = useAppSelector(selectShipmentLoading);
    const pagination = useAppSelector(selectShipmentPagination);
     const filter = useAppSelector(selectShipmentFilter);
       const dispatch = useAppDispatch();
        const shipmentList = useAppSelector(selectShipmentList);
       useEffect(() => {
         dispatch(shipmentActions.fetchShipmentList(filter));
       }, [dispatch, filter]);
      
    const handlePageChange = (e: any, page: number) => {
      dispatch(
        shipmentActions.setFilter({
          ...filter,
          _page: page,
        })
      );
    };

  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4"> Quản lý giao hàng</Typography>
      </Box>
      <OrderTable shipmentList={shipmentList} />
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
