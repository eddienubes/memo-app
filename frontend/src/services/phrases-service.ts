export default class PhrasesService {
  baseUrl = `${process.env.REACT_APP_MEMO_API_BASE_URL}/phrase`;

  constructor() {
    console.log(this.baseUrl);
  }
}