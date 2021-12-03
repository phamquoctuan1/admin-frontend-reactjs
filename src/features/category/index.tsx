import { Box } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import AddEditPage from './pages/AddEditPage';
import ListPage from './pages/ListPage';

export default function CategoryFeature() {
  const match = useRouteMatch();
  return (
    <Box>
      <Switch>
        <Route path={match.path} exact>
          <ListPage />
        </Route>
        <Route path={`${match.path}/add`}>
          <AddEditPage />
        </Route>
        <Route path={`${match.path}/:categoryId`}>
          <AddEditPage />
        </Route>
      </Switch>
    </Box>
  );
}
