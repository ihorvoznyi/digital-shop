interface IFeature {
  id: string;
  name: string;
}

export interface IClientType {
  id: string;
  name: string;
  features: IFeature[];
}
