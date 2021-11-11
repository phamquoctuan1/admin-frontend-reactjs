import { Box, Grid, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { BuildOutlined, ChatRounded, PeopleAlt } from '@material-ui/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { useEffect } from 'react';
import StatisticItem from './components/StatisticItem';
import StudentRankingList from './components/StudentRankingList';
import Widget from './components/Widget';
import {
  dashboardActions,
  selectDashboardStatistics,
  selecteDashboardLoading,
  selectHighestStudentList,
  selectLowestStudentList,
  selectRankingByCityList,
} from './dashboardSlice';

const useStyles = makeStyles((theme) => ({
  root: { position: 'relative', paddingTop: theme.spacing(1) },
  loading: { position: 'absolute', top: theme.spacing(-1), width: '100%' },
}));
export default function Dashboard() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selecteDashboardLoading);
  const statistics = useAppSelector(selectDashboardStatistics);
  const highestStudentList = useAppSelector(selectHighestStudentList);
  const lowestStudentList = useAppSelector(selectLowestStudentList);
  const rankingByCityList = useAppSelector(selectRankingByCityList);

  useEffect(() => {
    dispatch(dashboardActions.fetchData());
  }, [dispatch]);

  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      {/* Statistic section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticItem
            icon={<PeopleAlt fontSize="large" color="primary" />}
            label="male"
            value={statistics.maleCount}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatisticItem
            icon={<PeopleAlt fontSize="large" color="primary" />}
            label="female"
            value={statistics.femaleCount}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatisticItem
            icon={<BuildOutlined fontSize="large" color="primary" />}
            label="mark >= 8"
            value={statistics.highMarkCount}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatisticItem
            icon={<ChatRounded fontSize="large" color="primary" />}
            label="mark <= 5"
            value={statistics.lowMarkCount}
          />
        </Grid>
      </Grid>

      {/* All student ranking */}
      <Box mt={4}>
        <Typography variant="h4" align="center">
          All Student
        </Typography>
        <Box mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Widget title="Student with highest mark">
                {' '}
                <StudentRankingList studentList={highestStudentList} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Widget title="Student with lowest mark">
                <StudentRankingList studentList={lowestStudentList} />
              </Widget>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Ranking by city */}
      <Box mt={4}>
        <Typography variant="h4" align="center">
          Ranking by city
        </Typography>
        <Box mt={2}>
          <Grid container spacing={3}>
            {rankingByCityList.map((ranking) => (
              <Grid key={ranking.cityId} item xs={12} md={6} lg={3}>
                <Widget title={ranking.cityName}>
                  <StudentRankingList studentList={ranking.rankList} />
                </Widget>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}