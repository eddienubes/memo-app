import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box, Alert, Fade } from "@mui/material";
import GlobalStateContext from "../../contexts/global-state-context/global-state-context";
import { AxiosError } from "axios";

const timer = null;

const ErrorNotification = () => {
  const { dispatch: dispatchGS, state } = useContext(GlobalStateContext);
  const [draw, setDraw] = useState<boolean>(false);

  useEffect(() => {
    if (state.error) {
      setDraw(true);
    }
  }, [state.error]);

  useEffect(() => {
    if (draw) {
      setTimeout(() => {
        setDraw(false);
      }, 5000);
    }
  }, [dispatchGS, draw]);

  return (
    <Fade in={draw} onExited={() => dispatchGS({ type: 'setError', payload: null })}>
      <Box>
        <Alert sx={{ overflowWrap: 'break-word' }} variant="filled" severity="error">
          {state.error?.response?.data?.message || 'Something went wrong!'}
        </Alert>
      </Box>
    </Fade>
  )
}

export default ErrorNotification;