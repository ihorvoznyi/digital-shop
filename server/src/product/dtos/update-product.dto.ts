import { IFeatureValue } from '../../feature/interfaces';

export class UpdateProductDto {
  name: string;
  description: string;
  image: string;
  price: number;
  features: IFeatureValue[];
}
