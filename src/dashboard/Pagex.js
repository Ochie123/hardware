
import React, { Suspense } from 'react';
import { Grid } from '@mui/material';

import DashboardSidebarNavigation from './dashboard-sidebar-navigation';



const Dashboardx = ({ children }) => {
  //const mobileDevice = useMediaQuery('(max-width:650px)');

  return (
    <Suspense>
      <Grid container>
        <Grid item xs={12} md={2}>
          <DashboardSidebarNavigation />
        </Grid>
        <Grid item xs={12} md={10}>
          {children}
        </Grid>
      </Grid>
    </Suspense>
  );
};

export default Dashboardx;
