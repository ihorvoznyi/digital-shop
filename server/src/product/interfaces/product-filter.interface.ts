export class IProductFilter {
  names?: string[];
  types?: string[];
  brands?: string[];
  priceRange?: [number, number] | number[];
  features?: string[];
}

export class IFilterQuery {
  priceRange?: string;
  brands?: string;
  features?;
}
