/* eslint-disable */ 
"use client"
import React, { useState } from 'react';
import { Link} from "react-router-dom";
import { useSelector } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RedeemIcon from '@mui/icons-material/Redeem';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import DiscountIcon from '@mui/icons-material/Discount';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  ListSubheader,
  Typography,
  useMediaQuery,
  Toolbar,
  AppBar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  PieChart as PieChartIcon,
  ShoppingCart as ShoppingCartIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  List as ListIcon,
  FilePlus as FilePlusIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  DollarSign as DollarSignIcon,
  LogOut as LogOutIcon,
} from 'react-feather';

import { RootState } from '../store/reducers';

const DashboardSidebarNavigation = () => {
  const { profile } = useSelector((state) => state.profile);
  const [openSections, setOpenSections] = useState({
    products: false,
    marketing: false,
    finance: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileDevice = useMediaQuery('(max-width:650px)', { noSsr: true });

  const handleClick = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };
  

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
  };
  console.log(profile)

  const drawer = (
    <div>
      <Box p={2}>
        <Box display="flex" justifyContent="center">
          <Avatar alt="User" src="" />
        </Box>
        <Box mt={2} textAlign="center">
          <Typography>{profile?.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            Shop name: shop.name
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        <Link href="/admin" passHref>
          <ListItem component="a">
            <ListItemIcon>
              <PieChartIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        <ListSubheader>Management</ListSubheader>
        <ListItem onClick={() => handleClick('products')}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
          {openSections.products ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </ListItem>
        <Collapse in={openSections.products} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to="/">
              <ListItem component="a">
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="List Products" />
              </ListItem>
            </Link>
            <Link to="/create-product">
              <ListItem component="a">
                <ListItemIcon>
                  <FilePlusIcon />
                </ListItemIcon>
                <ListItemText primary="Create Product" />
              </ListItem>
            </Link>
          </List>
        </Collapse>
        <ListSubheader>Marketing</ListSubheader>
        <ListItem onClick={() => handleClick('marketing')}>
          <ListItemIcon>
            <RedeemIcon />
          </ListItemIcon>
          <ListItemText primary="Marketing" />
          {openSections.marketing ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </ListItem>
        <Collapse in={openSections.marketing} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href="/dashboard/promotion/create" passHref>
              <ListItem component="a">
                <ListItemIcon>
                  <LocalOfferIcon />
                </ListItemIcon>
                <ListItemText primary="Promotions" />
              </ListItem>
            </Link>
            <Link href="/dashboard/coupon/create" passHref>
              <ListItem component="a">
                <ListItemIcon>
                  <DiscountIcon />
                </ListItemIcon>
                <ListItemText primary="Coupons" />
              </ListItem>
            </Link>
          </List>
        </Collapse>
        <ListSubheader>Finance</ListSubheader>
        <ListItem onClick={() => handleClick('finance')}>
          <ListItemIcon>
            <DollarSignIcon />
          </ListItemIcon>
          <ListItemText primary="Finance" />
          {openSections.finance ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </ListItem>
        <Collapse in={openSections.finance} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href="/dashboard/wallet" passHref>
              <ListItem component="a">
                <ListItemIcon>
                  <AccountBalanceWalletIcon />
                </ListItemIcon>
                <ListItemText primary="Wallet" />
              </ListItem>
            </Link>
            <Link href="/dashboard/payout" passHref>
              <ListItem component="a">
                <ListItemIcon>
                  <PaidIcon />
                </ListItemIcon>
                <ListItemText primary="Payout Methods" />
              </ListItem>
            </Link>
          </List>
        </Collapse>
        <ListSubheader>Pages</ListSubheader>
        <Link href="/dashboard/account" passHref>
          <ListItem component="a">
            <ListItemIcon>
              <UserIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
        </Link>
        <a href="/" onClick={handleLogout} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem>
            <ListItemIcon>
              <LogOutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </a>
      </List>
      <Divider />
    </div>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ display: { md: 'none' }, zIndex: theme => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar />
          {/* Add main content here */}
        </Box>
      </Box>
    </>
  );
};

export default DashboardSidebarNavigation;
const drawerWidth = 220;
