import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { APP_BAR_DRAWER_WIDTH } from '../../utils/constants';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ListItemText from '@mui/material/ListItemText';
import React, { useContext } from 'react';
import DrawerHeader from '../drawer-header';
import GoogleIcon from '@mui/icons-material/Google';
import GoogleButton from '../google-button';
import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import { useHistory } from 'react-router';
import GlobalStateContext from '../../contexts/global-state-context/global-state-context';
import { Avatar } from '@mui/material';

interface IProps {
  handleDrawerClose: () => void;
  open: boolean;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: APP_BAR_DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});


const DrawerStyled = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: APP_BAR_DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Drawer: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const globalState = useContext(GlobalStateContext);

  const { open, handleDrawerClose } = props;

  const drawerClickHandler = (path: string) => () => {
    history.push(path);
  }

  return (
    <DrawerStyled variant="permanent" open={open}>
      <DrawerHeader>
        memo menu
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
        </IconButton>
      </DrawerHeader>
      <Divider/>
      <List>
        <ListItem button key={'text'} onClick={drawerClickHandler('phrases')}>
          <ListItemIcon>
            <FormatColorTextRoundedIcon/>
          </ListItemIcon>
          <ListItemText primary={'Phrases'}/>
        </ListItem>
      </List>
      <Divider/>
      <List>
        {
          globalState.loggedIn ?
            <ListItem button key={'Sign in'}>
              <ListItemIcon>
                <Avatar sx={{ width: 25, height: 25 }} alt="avatar" src={globalState.user?.googleAvatar}/>
              </ListItemIcon>
              <ListItemText primary={'Signed in'}/>
            </ListItem>
            :
            <GoogleButton render={
              <ListItem button key={'Sign in'}>
                <ListItemIcon>
                  <GoogleIcon/>
                </ListItemIcon>
                <ListItemText primary={'Sign in'}/>
              </ListItem>
            }/>
        }
      </List>
    </DrawerStyled>
  );
}


export default Drawer;
