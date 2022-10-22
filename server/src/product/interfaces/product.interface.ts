import { IFeature } from '../../feature/interfaces';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  brand: string;
  type: string;
  price: number;
  features: IFeature[];
}
