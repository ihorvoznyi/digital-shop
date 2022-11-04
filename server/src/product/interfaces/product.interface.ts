import { IFeature } from '../../feature/interfaces';
import { IReview } from './review.interface';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  brand: string;
  type: {
    typeName: string;
    typeTag: string;
  };
  price: number;
  rating: number;
  features: IFeature[];
  comments: IReview[];
}
