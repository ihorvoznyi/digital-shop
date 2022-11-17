import { makeAutoObservable } from "mobx";
import axios from "axios";
import { ITypes } from "./interfaces/ITypes";

class GeneralStore {
  isLoading = true;
  types: ITypes[] = [];

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }

  setLoading(value: boolean) {
    this.isLoading = value;
  }

  async fetchTypes() {
    try {
      this.isLoading = true;

      const response = await axios.get('http://localhost:8080/types');

      this.types = response.data;
    } catch {
      throw new Error('Global Error');
    } finally {
      this.isLoading = false;
    }
  }
}

export const generalStore = new GeneralStore();
