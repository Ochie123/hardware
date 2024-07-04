import React, { useEffect, useState } from 'react';

import jwt_decode from "jwt-decode"
import { useQuery } from "react-query"
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from "react-router-dom"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,

} from '@mui/material';



import { profileSelector } from '../../../../../features/profile/profileSlice'
import { saveClaimsAction } from '../../../../../features/auth/authSlice'


const ProfileDetails = ({ className, user, ...rest }) => {

  const dispatch = useDispatch();
  const { profile } = useSelector(profileSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);

 // console.log(users)
  const token = localStorage.getItem('token');
  //console.log(token);
  const savedClaims = JSON.parse(localStorage.getItem('claims'));
  
  useEffect(() => {
    if (token && !savedClaims) {
      const claims = jwt_decode(token);
      dispatch(saveClaimsAction(claims));
      localStorage.setItem('claims', JSON.stringify(claims));
    }
  }, [token, savedClaims, dispatch]);
 
  return (
    <Card className="" {...rest}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Avatar className="" src={user?.avatar} />
          <Typography
            className=""
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            username
          </Typography>
 
        </Box>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="text">
          Remove picture
        </Button>
      </CardActions>
    </Card>
  )
}



export default ProfileDetails;
