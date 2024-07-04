import React, { useEffect } from 'react';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
} from '@mui/material';
import Header from './Header';
import Results from './Results';
import Page from '../../../../components/Page';
import data from '../../../../data/Products.json';

function ProductListView() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Page className={classes.root} title="Product List">
      <Container maxWidth={false}>
        <Header />
        {data && (
          <Box mt={3}>
            <Results products={data} />
          </Box>
        )}
        <Backdrop
          className=""
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Page>
  );
}

const useStyles = (theme) => ({
  root: {},
});

export default ProductListView;
