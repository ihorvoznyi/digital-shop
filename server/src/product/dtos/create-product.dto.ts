import { IFeatureValue } from '../../feature/interfaces';

export class CreateProductDto {
  name: string;
  description: string;
  image: string;
  price: number;
  brand: string;
  type: string;
  features: IFeatureValue[];
}
