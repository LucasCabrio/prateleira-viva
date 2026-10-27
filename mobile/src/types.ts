export type User = { id: number; name: string; email: string };
export type Batch = {
  id: number;
  name: string;
  barcode: string;
  quantity: number;
  price: number;
  expires: string;
  category: string;
  days: number;
  discount: number;
  status: string;
  suggestedPrice: number;
};
export type Summary = {
  lots: number;
  units: number;
  atRisk: number;
  expired: number;
  urgent: number;
};
