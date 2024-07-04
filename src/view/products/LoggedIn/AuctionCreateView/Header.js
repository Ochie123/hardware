import React from "react"
import { Link as RouterLink } from "react-router-dom"
import clsx from "clsx"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography,
 
  Box
} from "@mui/material"

const Header = ({ className, ...rest }) => {
 

  return (
    <Grid
      className={clsx("", className)}
      container
      justify="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/reports"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Box>
            <Typography variant="body1" color="inherit">
              Create Product
            </Typography>
          </Box>
        </Breadcrumbs>
        <Typography variant="h4" color="textPrimary">
          Create a new product
        </Typography>
      </Grid>
      <Grid item>
        <Button component={RouterLink} to="/">
          Cancel
        </Button>
      </Grid>
    </Grid>
  )
}



export default Header
