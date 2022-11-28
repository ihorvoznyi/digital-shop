import axios from "axios";

export const fetchBrands = async(keyword: string = '') => {
  const URL = 'http://localhost:8081/brands';

  const response = await axios.get(URL);

  return response.data;
}