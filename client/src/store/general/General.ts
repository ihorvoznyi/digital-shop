import { makeAutoObservable } from "mobx";
import axios from "axios";
import { ITypes } from "./interfaces/ITypes";

class GeneralStore {
  isLoading = true;
  openSection: null | string = null;
  types: ITypes[] = [];

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }

  setLoading(value: boolean) {
    this.isLoading = value;
  }

  setOpenSection(section: string | null) {
    this.openSection = section;
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
