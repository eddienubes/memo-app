import axios from 'axios';
import { Answer, Test } from "../common/types/data";

export default class TestService {
  baseUrl = `${process.env.REACT_APP_MEMO_API_BASE_URL}/test`;

  async findTests(): Promise<Test[]> {
    try {
      const { data } = await axios.get(this.baseUrl, {
        withCredentials: true
      });

      return data.data;
    } catch (e) {
      throw e;
    }
  }

  async answer(answerId: number, testId: number): Promise<Answer> {
    console.log('ANSWER', answerId, testId);
    try {
      const { data } = await axios.post(`${this.baseUrl}/${testId}/answer/${answerId}`, {}, {
        withCredentials: true
      });

      return data.data;
    } catch (e) {
      throw e;
    }
  }

  async create(type: string): Promise<Test[]> {
    try {
      const { data } = await axios.post(this.baseUrl, {}, {
        withCredentials: true,
        params: {
          type
        }
      });

      return data.data;
    } catch (e: any) {

      throw e;
    }
  }
}