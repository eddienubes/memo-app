import React, { Dispatch, FormEventHandler, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider, InputLabel, Select, Slider, TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Actions, PhraseInput } from '../../pages/phrases-page/phrases-page';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { v4 as uuid } from 'uuid'

interface IProps {
  open: boolean;
  handleClose: () => void,
  handleFormSubmit: FormEventHandler
  types: string[],
  formState: PhraseInput,
  dispatch: React.Dispatch<Actions>
}

const Example: React.FC<{
  handleDelete: () => void;
  example: string;
  id: string;
}> = ({ handleDelete, example, id }) => {
  return (
    <Box
      key={id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',

        whiteSpace: 'normal',
        overflowWrap: 'break-word'
      }}>
      <Typography sx={{ whiteSpace: 'normal', overflowWrap: 'break-word' }} key={id + 'para'} paragraph>
        {example}
      </Typography>
      <Button
        key={id + 'button d'}
        type="button"
        variant="contained"
        color="primary"
        size="small"
        startIcon={<CloseIcon/>}
        onClick={handleDelete}
      >
      </Button>
    </Box>
  )
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

const CreatePhraseModal: React.FC<IProps> = (
  { open, handleClose, types, formState, dispatch, handleFormSubmit }) => {
  console.log(formState);
  const [currentExample, setCurrentExample] = useState<string>('');

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
            create a new phrase
          </Typography>
          {/*<Typography id="transition-modal-description" sx={{ mt: 2 }}>*/}
          {/*  Duis mollis, est non commodo luctus, nisi erat porttitor ligula.*/}
          {/*</Typography>*/}

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
                  value={formState.type}
                  onBlur={(e) => dispatch({ type: 'type', payload: e.target.value })}
                >
                  {
                    types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)
                  }
                </Select>
                <TextField size="small" required
                           onBlur={e => dispatch({ type: 'phrase', payload: e.target.value })}
                           id="filled-basic" label="phrase" variant="filled"/>
                <TextField size="small" required
                           onBlur={e => dispatch({ type: 'definition', payload: e.target.value })}
                           id="filled-basic" label="definition" variant="filled"/>
                <Typography>Examples: </Typography>
                {
                  formState.examples.map(e => {
                    return (
                      <Example
                        key={e.id + 'ex'}
                        id={e.id}
                        handleDelete={() => dispatch({ type: 'deleteExample', payload: e.id })}
                        example={e.value}
                      />
                    )
                  })
                }
                <TextField size="small"
                           defaultValue={currentExample}
                           onBlur={(e) => setCurrentExample(e.target.value)}
                           id="filled-basic" label="example" variant="filled"/>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<ControlPointIcon/>}
                  onClick={e => {
                    if (currentExample) {
                      dispatch({ type: 'addExamples', payload: { id: uuid(), value: currentExample } });
                      setCurrentExample('');
                    }
                  }}
                />
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
                  save
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
    ;
}


export default CreatePhraseModal;