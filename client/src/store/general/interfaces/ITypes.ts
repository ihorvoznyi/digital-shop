import { IProduct } from "../../product/interfaces";

export interface IFeature {
  id: string;
  name: string;
}

export interface IType {
  id: string;
  name: string;
  tag: string;
  features: IFeature[];
  products: IProduct[];
}

export interface INewType {
  typeName: string;
  tag: string;
  featureList: string[];
}
