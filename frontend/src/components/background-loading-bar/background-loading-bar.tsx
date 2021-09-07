import React from 'react'
import { Grid, LinearProgress } from "@mui/material";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";

const style: SxProps<Theme> = {
  // position: 'fixed',
  flexDirection: 'column',
  zIndex: 9999
};

const BackgroundLoadingBar = () => {
  return (
    <Grid container sx={style}>
      <LinearProgress/>
    </Grid>
  )
}

export default BackgroundLoadingBar;