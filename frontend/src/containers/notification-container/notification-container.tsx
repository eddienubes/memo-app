import React from 'react';
import { Box } from "@mui/material";
import Notification from "../../components/notification";
import ErrorNotification from "../../components/error-notification";


const NotificationContainer = () => {
  return (
    <Box sx={{
      position: 'fixed',
      display: 'flex',
      top: '15%',
      zIndex: 99999,
      left: '50%',
      transform: 'translate(-50%, -50%)',
      flexDirection: 'column',
      overflowWrap: 'break-word',
      gap: '20px'
    }}>
      <Notification/>
      <ErrorNotification/>
    </Box>
  )
}

export default NotificationContainer;