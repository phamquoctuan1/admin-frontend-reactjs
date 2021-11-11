import { Box, Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import productApi from 'api/productApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectCityList, selectCityMap } from 'features/city/citySlice';
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

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { _totalRows, _limit, _page } = useAppSelector(selectProductPagination);
  const filter = useAppSelector(selectProductFilter);
  const productList = useAppSelector(selectProductList);
  const loading = useAppSelector(selectProductLoading);
  const cityMap = useAppSelector(selectCityMap);
  const cityList = useAppSelector(selectCityList);
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
      await productApi.remove(product?.id || 0);

      toast.success('Remove Product successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      //Trigger to re-fetch student list with current filter
      dispatch(productActions.setFilter({ ...filter }));
    } catch (error) {
      console.log('failed to fetch product data', error);
    }
  };
  const handleEditProduct = async (product: Product) => {
    history.push(`${match.path}/${product.id}`);
  };
  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4"> Product Management</Typography>

        <Link to={`${match.path}/add`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Add new Product
          </Button>
        </Link>
      </Box>

      <Box mb={3}>
        <ProductFilters
          filter={filter}
          cityList={cityList}
          onSearchChange={handleSearchChange}
          onChange={handleFilterChange}
        />
      </Box>

      {/* Student table */}
      <ProductTable
        productList={productList}
        cityMap={cityMap}
        onEdit={handleEditProduct}
        onRemove={handleRemoveProduct}
      />
      {/* Pagination */}
      <Box mt={2} className={classes.pagination}>
        <Pagination
          count={Math.ceil(_totalRows / _limit)}
          page={_page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
