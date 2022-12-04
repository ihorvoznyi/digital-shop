import { commentType } from './IReview';

export type featureType = {
  id: string;
  feature: string;
  value: string | number | boolean;
}

export type typeType = {
  id: string;
  name: string;
  tag: string;
}

export type typeBrand = {
  id: string;
  name: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  price: number;
  rating: number;
  brand: typeBrand;
  type: typeType;
  image: string;
  features: featureType[];
  comments: commentType[];
}

export interface IProductFeature {
  id: string;
  value: string;
}

export interface INewProduct {
  name: string;
  description: string;
  price: number;
  brand: string;
  type: string;
  image: string;
  features: IProductFeature[];
}

export interface IUpdateProduct extends INewProduct {
  id: string;
  oldImage: string;
}
