import axios from "axios";
import { IOrder } from "../interfaces";

const URL = 'http://localhost:8080/orders';

export const createOrder = async(order: IOrder) => {
  try {
    await axios.post(URL, order, {
      headers: {  Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
    
    return 200; // Status: 200 (success)
  } catch {
    return 400; // Bad Request
  }
}

export const getOrders = async(userId: string) => {
  const response = await axios.get(URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  console.log(response.data);

  return response.data;
}