import React, { useContext, useEffect, useReducer, useState } from 'react';
import GlobalStateContext, { Actions, IGlobalState, IGlobalStateContext } from './global-state-context';
import ServicesContext from '../service-context/service-context';
import { LinearProgress } from '@mui/material';

const initialState: IGlobalState = {
  user: null,
  loggedIn: false,
  error: null,
  backgroundLoading: false,
  notification: null
};

const reducer = (state: IGlobalState, action: Actions) => {
  switch (action.type) {
    case 'setError':
      return {
        ...state,
        backgroundLoading: false,
        error: action.payload
      }
    case 'setGlobalState':
      return {
        ...state,
        user: action.payload,
        loggedIn: true
      }
    case 'setBackGroundLoading':
      return {
        ...state,
        backgroundLoading: action.payload
      }
    case 'setNotification':
      return {
        ...state,
        notification: action.payload
      }
    default:
      return initialState;
  }
}

const GlobalStateContextProvider: React.FC = ({ children }) => {
  const { authService } = useContext(ServicesContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setLoading(true);
    authService
      .authenticate()
      .then(user => {
        dispatch({
          type: 'setGlobalState', payload: user
        });
        setLoading(false)
      })
      .catch(e => {
        setLoading(false);
        dispatch({
          type: 'setError', payload: e
        });
      });
  }, [authService]);

  if (loading) {
    return <LinearProgress/>;
  }

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export default GlobalStateContextProvider;
