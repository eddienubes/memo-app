import React, { ReactElement } from 'react';
import GoogleLogin from 'react-google-login';
import { useGoogleAuth } from '../../hooks/use-google-auth';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router';

interface IProps {
  render: ReactElement
}

const GoogleButton: React.FC<IProps> = ({ render }) => {
  const { handleSuccess } = useGoogleAuth();
  const originUrl = window.location.origin;

  const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID;

  return (
    <GoogleLogin
      render={(renderProps) => React.cloneElement(render, {
        onClick: renderProps.onClick,
        disabled: renderProps.disabled
      })}
      clientId={clientId}
      onSuccess={handleSuccess}
      redirectUri={originUrl}
    />
  );
}

export default GoogleButton;