export interface addReviewType {
  userId: string;
  productId: string;
  comment: string;
  estimate: number;
}

export type commentType = {
  author: string;
  comment: string;
  estimate: number;
}
