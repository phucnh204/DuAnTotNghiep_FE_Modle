import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 10000,
    headers:{
        "token":"Tppp"
    }
});
export default api 