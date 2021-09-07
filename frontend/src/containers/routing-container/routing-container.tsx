import React, { useContext } from 'react';
import { Switch } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import DrawerHeader from '../../components/drawer-header';
import AppBar from '../../components/app-bar';
import Drawer from '../../components/drawer';
import PhrasesPage from '../../pages/phrases-page';
import TestsPage from "../../pages/tests-page";
import GlobalStateContext from "../../contexts/global-state-context/global-state-context";
import NotificationContainer from "../notification-container";

const RoutingContainer = () => {
  const [open, setOpen] = React.useState(false);
  const { state } = useContext(GlobalStateContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', position: 'relative' }}>
        <NotificationContainer/>
        <AppBar handleDrawerOpen={handleDrawerOpen} open={open}/>
        <Drawer handleDrawerClose={handleDrawerClose} open={open}/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader/>
          <Switch>
            <Route path={`/phrases`}>
              <PhrasesPage/>
            </Route>
            <Route path={`/tests`}>
              <TestsPage/>
            </Route>
          </Switch>
        </Box>
      </Box>
    </Router>
  )
}


export default RoutingContainer;