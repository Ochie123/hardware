import React, { useState } from 'react';
import clsx from 'clsx';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import {
  Image as ImageIcon,
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon,
} from 'react-feather';
import {
  Box,
  Button,
  Card,
  Checkbox,
  InputAdornment,
  FormControlLabel,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';

import {
  availabilityOptions,
  categoryOptions,
  sortOptions,
} from '../../../../others/helpers/InputAuctionOptions';
import {
  applyFilters,
  applyPagination,
  getInventoryLabel,
} from './TableResultsHelpers';

const Results = ({ className, products, ...rest }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    category: null,
    availability: null,
    inStock: null,
    isShippable: null,
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    event.persist();
    let value = null;
    if (event.target.value !== 'all') {
      value = event.target.value;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value,
    }));
  };

  const handleAvailabilityChange = (event) => {
    event.persist();
    let value = null;
    if (event.target.value !== 'all') {
      value = event.target.value;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      availability: value,
    }));
  };

  const handleStockChange = (event) => {
    event.persist();
    let value = null;
    if (event.target.checked) {
      value = true;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      inStock: value,
    }));
  };

  const handleShippableChange = (event) => {
    event.persist();
    let value = null;
    if (event.target.checked) {
      value = true;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      isShippable: value,
    }));
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectAllProducts = (event) => {
    setSelectedProducts(
      event.target.checked ? products.map((product) => product.url) : []
    );
  };

  const handleSelectOneProduct = (event, productUrl) => {
    if (!selectedProducts.includes(productUrl)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productUrl]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((url) => url !== productUrl)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const applyPagination = (products, page, limit) => {
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    return products.slice(startIndex, endIndex);
  };

  const filteredProducts = applyFilters(products, query, filters);
  const paginatedProducts = applyPagination(filteredProducts, page, limit);
  const enableBulkOperations = selectedProducts.length > 0;
  const selectedSomeProducts =
    selectedProducts.length > 0 && selectedProducts.length < products.length;
  const selectedAllProducts = selectedProducts.length === products.length;

  return (
    <Card className={clsx('', className)} {...rest}>
      <Box p={2}>
        <Box display="flex" alignItems="center">
          <TextField
            className={''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small" color="action">
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
            onChange={handleQueryChange}
            placeholder="Search products"
            value={query}
            variant="outlined"
          />
          <Box flexGrow={1} />
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
        <Box mt={3} display="flex" alignItems="center">
          <TextField
            className={''}
            label="Category"
            name="category"
            onChange={handleCategoryChange}
            select
            SelectProps={{ native: true }}
            value={filters.category || 'all'}
            variant="outlined"
          >
            {categoryOptions.map((categoryOption) => (
              <option key={categoryOption.id} value={categoryOption.id}>
                {categoryOption.name}
              </option>
            ))}
          </TextField>
          <TextField
            className={''}
            label="Availability"
            name="availability"
            onChange={handleAvailabilityChange}
            select
            SelectProps={{ native: true }}
            value={filters.availability || 'all'}
            variant="outlined"
          >
            {availabilityOptions.map((avalabilityOption) => (
              <option key={avalabilityOption.id} value={avalabilityOption.id}>
                {avalabilityOption.name}
              </option>
            ))}
          </TextField>
          <FormControlLabel
            className={''}
            control={
              <Checkbox
                checked={!!filters.inStock}
                onChange={handleStockChange}
                name="inStock"
              />
            }
            label="In Stock"
          />
          <FormControlLabel
            className={''}
            control={
              <Checkbox
                checked={!!filters.isShippable}
                onChange={handleShippableChange}
                name="Shippable"
              />
            }
            label="Shippable"
          />
        </Box>
      </Box>
      {enableBulkOperations && (
        <div className={''}>
          <div className={''}>
            <Checkbox
              checked={selectedAllProducts}
              indeterminate={selectedSomeProducts}
              onChange={handleSelectAllProducts}
            />
            <Button variant="outlined" className={''}>
              Delete
            </Button>
            <Button variant="outlined" className={''}>
              Edit
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={1200}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllProducts}
                    indeterminate={selectedSomeProducts}
                    onChange={handleSelectAllProducts}
                  />
                </TableCell>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Inventory</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Attributes</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => {
                const isProductSelected = selectedProducts.includes(product.url);

                return (
                  <TableRow hover key={product.url} selected={isProductSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isProductSelected}
                        onChange={(event) =>
                          handleSelectOneProduct(event, product.url)
                        }
                        value={isProductSelected}
                      />
                    </TableCell>
                    <TableCell className={''}>
                      {product.images.length > 0 ? (
                        <img
                          alt="Product"
                          src={product.images[0].thumbnail} // Adjust accordingly
                          className={''}
                        />
                      ) : (
                        <Box p={2} bgcolor="background.dark">
                          <SvgIcon>
                            <ImageIcon />
                          </SvgIcon>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{getInventoryLabel(product.quantity)}</TableCell>
                    <TableCell>
                      {product.quantity} in stock
                      {product.variants && product.variants.length > 1 &&
                        ` in ${product.variants.length} variants`}
                    </TableCell>
                    <TableCell>{product.tags.length} tag(s)</TableCell>
                    <TableCell>{numeral(product.price).format('0,0.00')}</TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton>
                        <SvgIcon fontSize="small">
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredProducts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Card>
  );
};

export default Results;
