export interface addReviewType {
  userId: string;
  productId: string;
  comment: string;
  estimate: number;
}

export type commentType = {
  id: string;
  author: string;
  comment: string;
  estimate: number;
}
