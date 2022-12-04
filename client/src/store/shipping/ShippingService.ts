import axios from "axios";

import { shippingStore } from "./Shipping";

import { IWarehouses } from "./interfaces/IWarehouses";

const API_KEY = 'e17f15fb792d3d57c4d2d5dacfa92c15';
const ENTRY_POINT = 'https://api.novaposhta.ua/v2.0/json/';

export const fetchWarehouses = async(city: string) => {
  const response: IWarehouses  = (await axios.post(ENTRY_POINT, {
    apiKey: API_KEY,
    modelName: 'Address',
    calledMethod: 'getWarehouses',
    methodProperties: {
      CityName: city,
    }
  })).data;

  const data = response.data.map((item) => item.Description);
  shippingStore.warehouses = [...data];

  return data;
}