import React from 'react';
import { CssBaseline } from '@mui/material';
import RoutingContainer from './containers/routing-container';
import ErrorBoundary from './components/error-boundary';
import ServicesContextProvider from './contexts/service-context/services-context-provider';
import GlobalStateContextProvider from './contexts/global-state-context/global-state-context-provider';

export default function MiniDrawer() {
  return (
    <ServicesContextProvider>
      <GlobalStateContextProvider>
        <ErrorBoundary>
          <CssBaseline/>
          <RoutingContainer/>
        </ErrorBoundary>
      </GlobalStateContextProvider>
    </ServicesContextProvider>
  )
}