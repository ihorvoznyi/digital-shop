import { Product, Type } from '../../database/entities';

export interface IFeature {
  feature: string;
  value: string | number | boolean;
}

export interface IFeatureValue {
  id: string;
  value: string;
}

export interface IFeatureType {
  type: Type;
  name: string;
}

export interface IProductFeature {
  type: Type;
  product: Product;
  features: IFeatureValue[];
}
