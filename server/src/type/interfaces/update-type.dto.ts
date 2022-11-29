interface IUpdateFeature {
  id: string;
  name: string;
}

export class UpdateTypeDto {
  name: string;
  tag: string;
  newFeatures: string[];
  deleteFeatures: string[];
  updateFeatures: IUpdateFeature[];
}
