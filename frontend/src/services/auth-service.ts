import axios from 'axios';

export default class AuthService {
  baseUrl = `${process.env.REACT_APP_MEMO_API_BASE_URL}/auth`

  googleAuth(accessToken: string) {
    return axios.post(`${this.baseUrl}/google`, {
      token: accessToken
    });
  }
}