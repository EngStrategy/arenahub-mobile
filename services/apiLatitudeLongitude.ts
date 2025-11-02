import axios from "axios";

const apiLatitudeLongitude = axios.create({
  baseURL: "https://cep.awesomeapi.com.br/json/",
  timeout: 10000,
});

export default apiLatitudeLongitude;