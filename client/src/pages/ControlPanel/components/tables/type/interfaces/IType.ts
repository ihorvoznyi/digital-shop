import { IEditFeature } from "./IFeature";

export interface IEditType {
  id: string;
  name: string;
  tag: string;
  features: IEditFeature[];
}

export interface IType {
  id: string;
  name: string;
  tag: string;
  features: IEditFeature[];
}