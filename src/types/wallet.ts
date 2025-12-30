export type DepositStatus = "PENDING" | "COMPLETED" | "FAILED";

export type Deposit = {
  _id: string;
  userId: string;
  asset: string;
  network: string;
  address: string;
  amount: string;
  txHash?: string | null;
  confirmations: number;
  status: DepositStatus;
  createdAt: string;
  updatedAt: string;


};

export type ListDeposit = {
  data: Deposit[];
};

export type CreateDeposit = {
  asset: string;
  network: string;
  amount?: string;
};

export type AssetNetwork = {
    key: string;
    label: string;
    addressFormat: "btc" | "evm" | "tron";
    requiredConfirmations: number;
  };
  
export type Asset = {
    symbol: string;
    name: string;
    minDeposit: string;
    estimatedBlockTimeSec: number;
    networks: AssetNetwork[];
  };