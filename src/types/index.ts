export interface Review {
  id: string;
  employeeName: string;
  department: string;
  reviewPeriod: { from: Date | string; to: Date | string };
  rating: number;
  comments: string;
}
