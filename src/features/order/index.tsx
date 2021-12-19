import { Box } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import OrderTrashTable from './components/OrderTrashTable';

import ListPage from './pages/ListPage';
import OrderDetail from './pages/OrderDetail';

export default function OrderFeature() {
  const match = useRouteMatch();
  return (
    <Box>
      <Switch>
        <Route path={match.path} exact>
          <ListPage />
        </Route>
        <Route exact path={`${match.path}/trash`}>
          <OrderTrashTable />
        </Route>
        <Route path={`${match.path}/:orderId`}>
          <OrderDetail />
        </Route>
      </Switch>
    </Box>
  );
}
