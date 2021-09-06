import React, { useContext, useEffect, useState } from 'react';
import GlobalStateContext, { IGlobalStateContext } from './global-state-context';
import ServicesContext from '../service-context/service-context';
import { LinearProgress } from '@mui/material';


const GlobalStateContextProvider: React.FC = ({ children }) => {
  const { authService } = useContext(ServicesContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalState, setGlobalState] = useState<IGlobalStateContext>({
    user: null,
    loggedIn: false
  });


  useEffect(() => {
    setLoading(true);
    authService
      .authenticate()
      .then(user => {
        setGlobalState(state => {
          return {
            user,
            loggedIn: true
          }
        });
        setLoading(false)
      })
      .catch(e => setLoading(false))
  
  }, [authService]);

  if (loading) {
    return <LinearProgress/>;
  }

  return (
    <GlobalStateContext.Provider value={globalState}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export default GlobalStateContextProvider;
