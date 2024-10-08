import React from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';

import Page from '../../../src/components/Page'

const NotFoundPage = () => {
  const mobileDevice = useMediaQuery('(max-width:650px)');

  return (
    <Page title="Not Found Page">
      <Container>
        <Box
          height={mobileDevice ? '50vh' : '100vh'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={mobileDevice ? 'h2' : 'h2'}>
            Page Not Found. 
            <br/> 
            Please check your link.
          </Typography>
        </Box>
      </Container>
    </Page>
  );
};

export default NotFoundPage;
