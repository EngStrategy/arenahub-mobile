import axios from "axios";

const apiCEP = axios.create({
  baseURL: "https://viacep.com.br/ws/",
  timeout: 10000,
});

export default apiCEP;
