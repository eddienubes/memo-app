import React from 'react';
import { Switch } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import DrawerHeader from '../../components/drawer-header';
import Typography from '@mui/material/Typography';
import AppBar from '../../components/app-bar';
import Drawer from '../../components/drawer';

const RoutingContainer = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <AppBar handleDrawerOpen={handleDrawerOpen} open={open}/>
        <Drawer handleDrawerClose={handleDrawerClose} open={open}/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader/>
          <Switch>
            <Route path={`/phrases`}>
              <Typography>ASS SMELLS LIKE A BAKA</Typography>
            </Route>
          </Switch>
        </Box>
      </Box>
    </Router>
  )
}


export default RoutingContainer;