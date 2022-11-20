import { IOrderLine } from "../interfaces";

export const createOrder = async(order: IOrderLine[]) => {
  try {
    // const response = await axios.post(this.URL, order, {
    //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    // });
    return 200; // Status: 200 (success)
  } catch {
    return 400; // Bad Request
  }
}