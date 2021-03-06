import * as React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Header, Sidebar } from 'components/Common';
import { Switch, Route } from 'react-router-dom';
import Dashboard from 'features/dashboard';

import ProductFeature from 'features/product';
import CategoryFeature from 'features/category';
import OrderFeature from 'features/order';
import CustomerFeature from 'features/customer';
import ShipmentFeature from 'features/shipment';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridAutoColumns: '240px 1fr',
    gridTemplateAreas: `"header header" "sidebar main"`,

    minHeight: '100vh',
  },
  header: {
    gridArea: 'header',
  },
  sidebar: {
    gridArea: 'sidebar',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    gridArea: 'main',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 3),
  },
}));
export function AdminLayout() {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Header />
      </Box>
      <Box className={classes.sidebar}>
        <Sidebar />
      </Box>
      <Box className={classes.main}>
        <Switch>
          <Route path="/admin/dashboard">
            <Dashboard />
          </Route>
          <Route path="/admin/product">
            <ProductFeature />
          </Route>
          <Route path="/admin/category">
            <CategoryFeature />
          </Route>
          <Route path="/admin/order">
            <OrderFeature />
          </Route>
          <Route path="/admin/customer">
            <CustomerFeature />
          </Route>
          <Route path="/admin/shipment">
            <ShipmentFeature />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}
