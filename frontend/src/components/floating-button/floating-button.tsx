import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/system';

const fabStyle: SxProps = {
  position: 'fixed',
  bottom: '15px',
  right: '15px',
  zIndex: 1
};

const FloatingButton: React.FC<{ onClickHandler: () => void }> = ({ onClickHandler }) => {

  return (
    <Fab onClick={onClickHandler} sx={fabStyle} color="primary" aria-label="add">
      <AddIcon/>
    </Fab>
  )
}

export default FloatingButton;