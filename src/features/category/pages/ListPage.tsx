import { Box, Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import categoryApi from 'api/categoryApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AxiosError } from 'axios';
import { Category } from 'models';
import React, { useEffect } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  categoryActions,
  selectCategoryFilter,
  selectCategoryList,
  selectCategoryLoading
} from '../categorySlice';
import CategoryTable from '../components/CategoryTable';


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
  const MySwal = withReactContent(Swal);
  const match = useRouteMatch();
  const history = useHistory();

  const classes = useStyles();
  const dispatch = useAppDispatch();

  const filter = useAppSelector(selectCategoryFilter);
  const categoryList = useAppSelector(selectCategoryList);
  const loading = useAppSelector(selectCategoryLoading);

  useEffect(() => {
    dispatch(categoryActions.fetchCategoryList());
  }, [dispatch, filter]);
  
 
  const handleRemoveCategory = async (category: Category) => {
    try {
      const response = await categoryApi.remove(category?.id || 0);
      toast.success(response.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      //Trigger to re-fetch student list with current filter
      dispatch(categoryActions.setFilter({ ...filter }));
    } catch (error) {
     let msg = (error as AxiosError).response?.data.message;
     MySwal.fire(msg, 'Thử lại sau', 'error');
    }
  };
  const handleEditCategory = async (category: Category) => {
    history.push(`${match.path}/${category.id}`);
  };
  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4"> Quản lý danh mục</Typography>
        <Link to={`${match.path}/add`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Thêm danh mục mới
          </Button>
        </Link>
      </Box>

      {/* <Box mb={3}>
        <ProductFilters
          filter={filter}
          onSearchChange={handleSearchChange}
          onChange={handleFilterChange}
        />
      </Box> */}

      {/* Student table */}
      <CategoryTable
        categoryList={categoryList}
        onEdit={handleEditCategory}
        onRemove={handleRemoveCategory}
      />
      {/* Pagination */}
    </Box>
  );
}
