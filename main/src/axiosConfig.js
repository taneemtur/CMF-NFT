import axios from 'axios';
const locallhost = 'http://localhost:8080';
// https://cmfnft.vercel.app
// https://cmf-api.vercel.app
const instance = axios.create({
    baseURL: "http://localhost:8080"
});
// set content type to json
instance.defaults.headers.post['Content-Type'] = 'application/json';
export default instance;