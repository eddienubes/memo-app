import axios from 'axios';
import { Phrase } from '../common/types/data';
import { PhraseInput } from '../pages/phrases-page/phrases-page';

export default class PhrasesService {
  baseUrl = `${process.env.REACT_APP_MEMO_API_BASE_URL}/phrase`;

  async findPhrases(offset: number, limit?: number): Promise<Phrase[]> {
    try {
      const { data } = await axios.get(`${this.baseUrl}`,
        {
          withCredentials: true,
          params: {
            offset,
            limit
          }
        });
      return data.data;
    } catch (e) {
      throw e;
    }
  }

  async findPhraseTypes(): Promise<string[]> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/type`, {
        withCredentials: true
      });

      return data.data;
    } catch (e) {
      throw e;
    }
  }

  async create(phrase: PhraseInput): Promise<Phrase> {

    try {
      const { data } = await axios.post(this.baseUrl, {
          ...phrase,
          examples: phrase.examples.map(e => e.value)
        },
        {
          withCredentials: true
        });

      return data.data;
    } catch (e) {
      throw e;
    }
  }
}