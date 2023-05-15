import axios from 'axios';
const locallhost = 'http://localhost:8080';
const instance = axios.create({
    baseURL: 'https://cmfnft.vercel.app'
});
// set content type to json
instance.defaults.headers.post['Content-Type'] = 'application/json';
export default instance;