import React, { useContext } from 'react';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar';
import { APP_BAR_DRAWER_WIDTH } from '../../utils/constants';
import BackgroundLoadingBar from "../background-loading-bar";
import GlobalStateContext from "../../contexts/global-state-context/global-state-context";


interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface IProps {
  handleDrawerOpen: () => void;
  open: boolean;
}

const ABar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: APP_BAR_DRAWER_WIDTH,
    width: `calc(100% - ${APP_BAR_DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const AppBar: React.FC<IProps> = (props) => {
  const { open, handleDrawerOpen } = props;
  const { state: globalState } = useContext(GlobalStateContext);


  return (
    <ABar position="fixed" open={open}>
      { globalState.backgroundLoading ? <BackgroundLoadingBar/> : null }
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          memo
        </Typography>
      </Toolbar>
    </ABar>
  )
}

export default AppBar;