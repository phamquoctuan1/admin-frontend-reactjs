import { Box, Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import studentApi from 'api/studentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectCityList, selectCityMap } from 'features/city/citySlice';
import { ListParams, Student } from 'models';
import React, { useEffect } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentFilters from '../components/StudentFilters';
import StudentTable from '../components/StudentTable';
import {
  selectStudentFilter,
  selectStudentList,
  selectStudentLoading,
  selectStudentPagination,
  studentActions,
} from '../studentSlice';

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
  const { _totalRows, _limit, _page } = useAppSelector(selectStudentPagination);
  const filter = useAppSelector(selectStudentFilter);
  const studentList = useAppSelector(selectStudentList);
  const loading = useAppSelector(selectStudentLoading);
  const cityMap = useAppSelector(selectCityMap);
  const cityList = useAppSelector(selectCityList);
  useEffect(() => {
    dispatch(studentActions.fetchStudentList(filter));
  }, [dispatch, filter]);
  const handlePageChange = (e: any, page: number) => {
    dispatch(
      studentActions.setFilter({
        ...filter,
        _page: page,
      })
    );
  };

  const handleSearchChange = (newFilter: ListParams) => {
    dispatch(studentActions.setFilterWithDebounce(newFilter));
  };
  const handleFilterChange = (newFilter: ListParams) => {
    dispatch(studentActions.setFilter(newFilter));
  };
  const handleRemoveStudent = async (student: Student) => {
    try {
      await studentApi.remove(student?.id || '');

      toast.success('Remove student successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      //Trigger to re-fetch student list with current filter
      dispatch(studentActions.setFilter({ ...filter }));
    } catch (error) {
      console.log('failed to fetch student data', error);
    }
  };
  const handleEditStudent = async (student: Student) => {
    history.push(`${match.path}/${student.id}`);
  };
  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4"> Student Management</Typography>

        <Link to={`${match.path}/add`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Add new Student
          </Button>
        </Link>
      </Box>

      <Box mb={3}>
        <StudentFilters
          filter={filter}
          cityList={cityList}
          onSearchChange={handleSearchChange}
          onChange={handleFilterChange}
        />
      </Box>

      {/* Student table */}
      <StudentTable
        studentList={studentList}
        cityMap={cityMap}
        onEdit={handleEditStudent}
        onRemove={handleRemoveStudent}
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
