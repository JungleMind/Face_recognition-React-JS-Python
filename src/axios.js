import axios from 'axios'

export default axios.create({
    baseURL:
    'http://localhost:8000/',
    // headers:{
    //     Accept:"application/json",
    //     'Access-Control-Allow-Origin':"*",
    // },
});