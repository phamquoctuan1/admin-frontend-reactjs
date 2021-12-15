import { Box, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import TopPriceOrder from './components/TopPriceOrder';
import TopProductSales from './components/TopProductSales';

const useStyles = makeStyles((theme) => ({
  root: { position: 'relative', paddingTop: theme.spacing(1) },
  grid: { margin:'auto' ,marginBottom: theme.spacing(10)}
}));
export default function Dashboard() {



  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {/* {loading && <LinearProgress className={classes.loading} />} */}
      {/* Statistic section */}
      <Grid container spacing={0}>
        <Grid item xs={12} md={4} className={classes.grid}>
          <TopPriceOrder />
        </Grid>
        <Grid item xs={12} md={12} className={classes.grid}></Grid>
        <Grid item xs={12} md={10} className={classes.grid}>
          <TopProductSales />
        </Grid>
      </Grid>

      {/* All student ranking */}
    </Box>
  );
}
