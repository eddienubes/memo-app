import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useContext } from 'react';
import ServicesContext from '../contexts/service-context/service-context';

export const useGoogleAuth = () => {
  const { authService } = useContext(ServicesContext);

  const handleSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log(response);
    if ('accessToken' in response) {
      const accessToken = response.accessToken;

      authService.googleAuth(accessToken).then(res => window.location.reload());

    }
  }

  return {
    handleSuccess,
  }
}