import axios from 'axios';
axios.defaults.withCredentials = true;
export default axios;

export const API_ENDPOINT = "https://localhost:3000/api";
