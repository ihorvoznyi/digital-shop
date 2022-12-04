interface FeatureType {
  id: string;
  name: string;
  value: string;
}

export interface IEditProduct {
  id: string;
  name: string;
  type: string;
  image: string;
  oldImage: string;
  isActive: boolean;
  brand: {
    id: string;
    name: string;
  };
  description: string;
  price: string;
  features: FeatureType[];
};

