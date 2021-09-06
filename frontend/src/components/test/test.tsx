import React, { FormEventHandler, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Divider, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { Test } from '../../common/types/data';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

interface IProps {
  test: Test
}

const Test: React.FC<IProps> = ({ test }) => {
  const [err, setErr] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>('Select an option')
  const [answerId, setAnswerId] = useState(null);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="elevation">
        <CardContent>
          {/*<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>*/}
          {/*  Phrase*/}
          {/*</Typography>*/}
          <Typography variant="h5" component="div">
            {test.phrase.value}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {test.phrase.type}
          </Typography>
          <Divider sx={{ margin: '2% 0' }}/>

        </CardContent>
        <CardActions>
          <form onSubmit={handleSubmit}>
            <FormControl
              sx={{ m: 3 }}
              component="fieldset"
              error={err}
              variant="standard"
            >
              <FormLabel component="legend">Pop quiz: Material-UI is...</FormLabel>
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={value}
                onChange={handleRadioChange}
              >
                <FormControlLabel value="best" control={<Radio />} label="The best!" />
                <FormControlLabel value="worst" control={<Radio />} label="The worst." />
              </RadioGroup>
              <FormHelperText>{helperText}</FormHelperText>
              <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                Check Answer
              </Button>
            </FormControl>
          </form>
        </CardActions>
      </Card>
    </Box>
  )
}


export default Test;