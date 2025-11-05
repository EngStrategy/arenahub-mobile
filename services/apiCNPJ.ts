// src/services/apiCnpj.ts
import axios from "axios";

const apiCnpj = axios.create({
  baseURL: "https://publica.cnpj.ws/cnpj/",
  timeout: 10000,
});

export default apiCnpj;
