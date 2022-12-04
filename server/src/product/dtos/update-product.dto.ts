import { IFeatureValue } from '../../feature/interfaces';

export class UpdateProductDto {
  name: string;
  description: string;
  isActive: boolean;
  image: string;
  brand: string;
  price: number;
  features: IFeatureValue[];
}
