import { Box, Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import productApi from 'api/productApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { ListParams, Product } from 'models';
import React, { useEffect } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductTable from '../components/ProductTable';
import ProductFilters from '../components/ProductFilters';
import {
  productActions,
  selectProductFilter,
  selectProductList,
  selectProductLoading,
  selectProductPagination,
} from '../productSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AxiosError } from 'axios';
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
  const match = useRouteMatch();
  const history = useHistory();
 const MySwal = withReactContent(Swal);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const filter = useAppSelector(selectProductFilter);
  const productList = useAppSelector(selectProductList);
  const loading = useAppSelector(selectProductLoading);
  const pagination = useAppSelector(selectProductPagination);
  useEffect(() => {
    dispatch(productActions.fetchProductList(filter));
  }, [dispatch, filter]);
  const handlePageChange = (e: any, page: number) => {
    dispatch(
      productActions.setFilter({
        ...filter,
        _page: page,
      })
    );
  };

  const handleSearchChange = (newFilter: ListParams) => {
    dispatch(productActions.setFilterWithDebounce(newFilter));
  };
  const handleFilterChange = (newFilter: ListParams) => {
    dispatch(productActions.setFilter(newFilter));
  };
  const handleRemoveProduct = async (product: Product) => {
    try {
      const response = await productApi.remove(product?.id || 0);
      toast.success(response.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(productActions.setFilter({ ...filter }));
    } catch (error) {
      let msg = (error as AxiosError).response?.data.message;
      MySwal.fire(msg, 'Thử lại sau', 'error');
    }
  };
  const handleEditProduct = async (product: Product) => {
    history.push(`${match.path}/${product.id}`);
  };
  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4"> Quản lý sản phẩm</Typography>

        <Link to={`${match.path}/add`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Thêm sẩn phẩm mới
          </Button>
        </Link>
      </Box>

      <Box mb={3}>
        <ProductFilters
          filter={filter}
          onSearchChange={handleSearchChange}
          onChange={handleFilterChange}
        />
      </Box>

      {/* Student table */}
      <ProductTable
        productList={productList}
        onEdit={handleEditProduct}
        onRemove={handleRemoveProduct}
      />
      {/* Pagination */}
      <Box mt={2} className={classes.pagination}>
        <Pagination
          color="primary"
          count={Math.ceil(pagination._totalRows / pagination._limit)}
          page={pagination._page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
