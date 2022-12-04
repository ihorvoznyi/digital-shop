import { IFeature } from '../../feature/interfaces';
import { IReview } from './review.interface';

type typeType = {
  id: string;
  name: string;
  tag: string;
};

type brandType = {
  id: string;
  name: string;
};

export interface IProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  brand: brandType;
  type: typeType;
  price: number;
  rating: number;
  features: IFeature[];
  comments: IReview[];
}
