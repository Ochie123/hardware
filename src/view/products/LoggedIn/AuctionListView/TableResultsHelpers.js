import React from 'react';
import Label from '../../../../components/Label';

export const applyFilters = (products, query, filters) => {
  return products.filter((product) => {
    let matches = true;

    if (query && !product.title.toLowerCase().includes(query.toLowerCase())) {
      matches = false;
    }

    if (filters.category && product.category !== filters.category) {
      matches = false;
    }

    if (filters.inStock && !['in_stock', 'limited'].includes(product.quantity)) {
      matches = false;
    }

    return matches;
  });
};

export const applyPagination = (products, page, limit) => {
  return products.slice(page * limit, page * limit + limit);
};

export const getInventoryLabel = (quantity) => {
  let inventoryType;
  if (quantity < 1) {
    inventoryType = 'out_of_stock';
  } else if (quantity < 5) {
    inventoryType = 'limited';
  } else {
    inventoryType = 'in_stock';
  }

  const map = {
    in_stock: {
      text: 'In Stock',
      color: 'success',
    },
    limited: {
      text: 'Limited',
      color: 'warning',
    },
    out_of_stock: {
      text: 'Out of Stock',
      color: 'error',
    },
  };

  const { text, color } = map[inventoryType];

  return <Label color={color}>{text}</Label>;
};
