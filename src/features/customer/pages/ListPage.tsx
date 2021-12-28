import { Box, makeStyles, Typography } from '@material-ui/core';
import userApi from 'api/userApi';
import { User } from 'models';
import React, { useEffect, useState } from 'react';
import CustomerTable from '../components/CustomerTable';


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
  
  const [userList, setUserList]= useState<User[]>();
  
  useEffect(() => {
    async function getAllUsers(){
      const users = await userApi.getAll();
      setUserList(users);
    }
   getAllUsers();
  }, [])
  return (
    <Box className={classes.root}>
      <Box className={classes.titleContainer}>
        <Typography variant="h4"> Quản lý khách hàng</Typography>
      </Box>
      <CustomerTable userList={userList} />
      {/* Pagination */}
    </Box>
  );
}
