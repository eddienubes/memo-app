import React, { FormEventHandler, useState, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Divider, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { Box } from '@mui/material';
import { Test as TestData } from '../../common/types/data';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ServicesContext from '../../contexts/service-context/service-context';
import GlobalStateContext from "../../contexts/global-state-context/global-state-context";

interface IProps {
  test: TestData
}


const Test: React.FC<IProps> = ({ test }) => {
  const [err, setErr] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>('Select an option')
  const [answerId, setAnswerId] = useState<number | null>(null);
  const { testService } = useContext(ServicesContext);
  const { state, dispatch } = useContext(GlobalStateContext);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerId(+e.target.value);
  }

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    testService
      .answer(answerId, test.id)
      .then(answer => dispatch({ type: 'setNotification', payload: 'Correct' }))
      .catch(e => dispatch({ type: 'setError', payload: e }));
  }

  const border = test.done ? '1px solid green' : '1px solid red';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Card variant="elevation" sx={{ border, borderRadius: '10px' }}>
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
              <FormLabel component="legend">Phrase quiz</FormLabel>
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={answerId}
                onChange={handleRadioChange}
              >
                {
                  test.answers.map(a => {
                    return <FormControlLabel key={a.id + 'answer'} value={a.id} control={<Radio/>}
                                             label={a.definition}/>
                  })
                }
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