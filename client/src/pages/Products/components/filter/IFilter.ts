export interface ITypeFeatures {
  name: string;
  tag: string;      // Filter Option tag
  values: string[]; // Filter Option values
};

export interface IFilter {
  tag: string;      
  values: string[];
}