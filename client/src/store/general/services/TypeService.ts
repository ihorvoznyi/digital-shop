import axios from "axios";
import { generalStore } from "../General";

export const fetchTypes = async() => {
  try {
    generalStore.isLoading = true;

    const response = await axios.get('http://localhost:8080/types');

    generalStore.types = response.data;

    return response.data;
  } catch {
    throw new Error('Global Error');
  } finally {
    generalStore.isLoading = false;
  }
}