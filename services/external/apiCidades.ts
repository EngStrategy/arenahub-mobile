import axios from "axios";

const apiCidades = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades",
  timeout: 10000,
});

export default apiCidades;
