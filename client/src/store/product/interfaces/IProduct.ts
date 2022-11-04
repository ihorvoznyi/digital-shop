import { commentType } from "./IReview";

export type featureType = {
  feature: string;
  value: string | number | boolean;
}

export type typeType = {
  typeName: string;
  typeTag: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  type: typeType;
  image: string;
  features: featureType[];
  comments: commentType[];
}
