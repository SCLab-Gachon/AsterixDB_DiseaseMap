import axios from 'axios'

const API_URL = 'http://sclab.gachon.ac.kr:19002/query/service'

export default {
  init() {
    axios.defaults.baseURL = API_URL
    axios.defaults.headers.post['Content-Type'] =
      'application/x-www-form-urlencoded'
  },
  query(statement) {
    return axios.post('', { statement: `use feeds;${statement}` })
  }
}
