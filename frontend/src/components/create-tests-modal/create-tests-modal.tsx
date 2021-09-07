import React, { FormEventHandler } from "react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Button from "@mui/material/Button";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleFormSubmit: FormEventHandler;
  types: string[];
  currentType: string;
  handleTypeChange: (e: SelectChangeEvent) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const CreateTestsModal: React.FC<IProps> =
  ({ open,
     handleClose,
     handleFormSubmit,
     types,
     currentType,
     handleTypeChange }) => {
  console.log(currentType);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography align="left" id="transition-modal-title" variant="h6" component="h2">
            create a new tests
          </Typography>

          <Divider sx={{ margin: '10px 30px' }}/>
          <form onSubmit={handleFormSubmit}>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120, width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InputLabel id="demo-simple-select-filled-label">type</InputLabel>
                <Select
                  required
                  size="small"
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={currentType}
                  onChange={handleTypeChange}
                >
                  {
                    types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)
                  }
                </Select>
              </Box>
              <Box display="flex" sx={{
                justifyContent: 'space-between',
                width: '100%',
                margin: '10px 0'
              }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SaveAltIcon/>}
                >
                  create
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<CloseIcon/>}
                  onClick={handleClose}
                >
                  close
                </Button>
              </Box>
            </FormControl>
          </form>
        </Box>
      </Fade>
    </Modal>
  )
}

export default CreateTestsModal;