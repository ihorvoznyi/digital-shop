interface IUpdateFeature {
  id: string;
  name: string;
  flag: string;
}

export class UpdateTypeDto {
  name: string;
  tag: string;
  features: IUpdateFeature[];
}
