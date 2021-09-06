import axios from 'axios';
import { User } from '../common/types/user';

export default class AuthService {
  baseUrl = `${process.env.REACT_APP_MEMO_API_BASE_URL}/auth`

  async googleAuth(accessToken: string): Promise<User> {
    try {
      const { data } = await axios.post(`${this.baseUrl}/google`, {
        token: accessToken,
      }, {
        withCredentials: true
      });

      return data.data;
    } catch (e) {
      throw e;
    }

  }

  async authenticate(): Promise<User> {
    try {
      const { data } = await axios.get(this.baseUrl, {
        withCredentials: true
      });
      return data.data;
    } catch (e) {
      throw e;
    }
  }
}