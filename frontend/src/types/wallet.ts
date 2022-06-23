export interface Wallet {
  id: string;
  name: string;
  asset: string;
  address: string;
  source: string;
  created: Date;
  balance: number;
  unpaidBalance: number;
}
