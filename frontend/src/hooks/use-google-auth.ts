import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useContext } from 'react';
import ServicesContext from '../contexts/service-context/service-context';

export const useGoogleAuth = () => {
  const { authService } = useContext(ServicesContext);

  const handleSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('accessToken' in response) {
      const accessToken = response.accessToken;

      authService.googleAuth(accessToken);
    }
  }

  return {
    handleSuccess,
  }
}