import React, { useContext, useEffect, useState } from 'react';
import { Box, Alert, Fade } from "@mui/material";
import GlobalStateContext from "../../contexts/global-state-context/global-state-context";


const Notification = () => {
  const { dispatch: dispatchGS, state } = useContext(GlobalStateContext);
  const [draw, setDraw] = useState<boolean>(false);

  useEffect(() => {
    if (state.notification) {
      setDraw(true);
    }
  }, [state.notification]);

  useEffect(() => {
    if (draw) {
      setTimeout(() => {
        setDraw(false);
      }, 5000);
    }
  }, [dispatchGS, draw]);

  return (
    <Fade in={draw} onExited={() => dispatchGS({ type: 'setNotification', payload: null })}>
      <Box>
        <Alert sx={{ overflowWrap: 'break-word' }} variant="filled" severity="success">
          {state.notification || 'Success!'}
        </Alert>
      </Box>
    </Fade>
  )
}

export default Notification;