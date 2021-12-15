import { Box } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import ListPage from './pages/ListPage';

export default function CustomerFeature() {
  const match = useRouteMatch();
  return (
    <Box>
      <Switch>
        <Route path={match.path} exact>
          <ListPage />
        </Route>
      </Switch>
    </Box>
  );
}
