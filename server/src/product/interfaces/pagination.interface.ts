import { IProduct } from './product.interface';

type CoutProductType = [IProduct[], number];

export interface IPaginateProps {
  data: CoutProductType;
  page: number;
  limit: number;
}
