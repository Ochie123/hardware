import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import { createStyles, makeStyles } from '@mui/icons-material';
import {Drawer} from '@mui/material';
import {List }from '@mui/material';
import { ListItem} from '@mui/material';
import {ListItemIcon }from '@mui/material';
import {ListItemText} from '@mui/material';
import HandymanIcon from '@mui/icons-material/Handyman';
import Toolbar from '@mui/material/Toolbar';
//import { useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router"
import authSlice from '../store/slices/auth'
import useSWR from "swr"
import { fetcher } from '../utils/axios'

//import { RootState } from 'store/reducers';
import {
  Avatar,
  Box,
  Divider,

  MenuItem,
  Menu,
  Collapse,
  ListSubheader,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { 
  LogOut as LogOutIcon, 
  Hexagon as HexagonIcon,
  PieChart as PieChartIcon,
  ShoppingCart as ShoppingCartIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  List as ListIcon,
  FilePlus as FilePlusIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  DollarSign as DollarSignIcon,
} from 'react-feather';

const HeaderProfile = () => {
  const account = useSelector(state => state.auth.account)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // @ts-ignore
  const userId = account?.id

  const user = useSWR(`/user/${userId}/`, fetcher)


  const [anchorEl, setAnchorEl] = React.useState(null);

  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout())
    navigate("/")
  }
  const handleClicks = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" onClick={handleClick}>
        <Avatar
          variant="circle"
          alt="User"
          className=""
          src=""
        />
      </Box>
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #d3d4d5',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
              <Box p={2}>
              <Box display="flex" justifyContent="center">
              <Avatar
                 variant={"circle"}
                 alt="User"
                 className=""
                 src="{profile.avatar}"
               />
              </Box>
              <Box mt={2} textAlign="center">
                <Typography>{user.data?.username}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Your tier:<h2>hello</h2> {user.data?.username}
                </Typography>
              </Box>
            </Box>
        <Divider />

      
              <List>
                <ListSubheader>Reports</ListSubheader>
                <Link className=""to="reports/">
                  <ListItem>
                    <ListItemIcon>
                      <PieChartIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Dashboard'} />
                  </ListItem>
                </Link>
                <ListSubheader>My Auctions</ListSubheader>
                <ListItem onClick={handleClicks}>
                  <ListItemIcon>
                    <HandymanIcon />
                  </ListItemIcon>
                  <ListItemText primary="Auctions" />
                  {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                  <Link className="" to="list-auctions/">
                      <ListItem className=''>
                        <ListItemIcon>
                          <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary="List Auctions" />
                      </ListItem>
                    </Link>
                    <Link className="" to="create-auction/">
                      <ListItem className="">
                        <ListItemIcon>
                          <FilePlusIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create Auction" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>


                <ListSubheader>Applications</ListSubheader>
                <Link className="" to="calendar/">
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Calendar'} />
                  </ListItem>
                </Link>

                <ListSubheader>Pages</ListSubheader>
                <Link className="" to="account/">
                  <ListItem>
                    <ListItemIcon>
                      <UserIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Account'} />
                  </ListItem>
                </Link>
                <Link className="pricing/">
                  <ListItem>
                    <ListItemIcon>
                      <DollarSignIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Pricing'} />
                  </ListItem>
                </Link>
              </List>
            
        <a className='' href="/">
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </a>
      </Menu>
    </div>
  );
};

export default HeaderProfile;

