import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Dashboard, Folder, Person } from '@material-ui/icons';
import React,{ useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch } from 'app/hooks';
import { authActions } from 'features/auth/authSlice';
import CategoryIcon from '@material-ui/icons/Category';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ReceiptIcon from '@material-ui/icons/Receipt';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',

      '&.active > div': {
        backgroundColor: theme.palette.action.selected,
      },
    },
  })
);

export function Sidebar() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
   const token = JSON.parse(localStorage.getItem('access_token') || '{}');
   useEffect(() => {
     const task = () => {
       if (Boolean(token)) {
         return dispatch(authActions.getUser(token));
       }
       return localStorage.removeItem('access_token');
     };
     task();
   }, [token, dispatch]);
  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <NavLink to="/admin/dashboard" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>
        </NavLink>

        <NavLink to="/admin/category" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Danh mục" />
          </ListItem>
        </NavLink>

        <NavLink to="/admin/product" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <Folder />
            </ListItemIcon>
            <ListItemText primary="Sản phẩm" />
          </ListItem>
        </NavLink>

        <NavLink to="/admin/order" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Đơn hàng" />
          </ListItem>
        </NavLink>

        <NavLink to="/admin/customer" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Khách hàng" />
          </ListItem>
        </NavLink>

        <NavLink to="/admin/shipment" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="Giao hàng" />
          </ListItem>
        </NavLink>
      </List>
    </div>
  );
}
