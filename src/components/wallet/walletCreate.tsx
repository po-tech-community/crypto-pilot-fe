import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { Asset } from "@/types/wallet";


const ASSETS: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    networks: [{ key: "bitcoin", label: "Bitcoin", requiredConfirmations: 2 }],
    minDeposit: "0.0001",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    networks: [{ key: "ethereum", label: "Ethereum (ERC20)", requiredConfirmations: 12 }],
    minDeposit: "0.001",
  },
  {
    symbol: "USDT",
    name: "Tether",
    networks: [
      { key: "ethereum", label: "Ethereum (ERC20)", requiredConfirmations: 12 },
      { key: "tron", label: "Tron (TRC20)", requiredConfirmations: 20 },
      { key: "bsc", label: "BNB Smart Chain (BEP20)", requiredConfirmations: 15 },
    ],
    minDeposit: "10",
  },
];

function isPositiveNumber(value: string) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0;
}

export function CreateDepositCard({
  asset,
  setAsset,
  network,
  setNetwork,
  amount,
  setAmount,
  assetMeta,
  networkMeta,
  isCreating,
  onCreate,
}: {
  asset: string;
  setAsset: (v: string) => void;
  network: string;
  setNetwork: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  assetMeta: Asset;
  networkMeta: Asset["networks"][number];
  isCreating: boolean;
  onCreate: () => void;
}) {
  const minDeposit = assetMeta.minDeposit;
  const isAmountValid = amount.trim() === "" || isPositiveNumber(amount);
  const meetsMinimum = amount.trim() === "" || Number(amount) >= Number(minDeposit);
  const canCreate = isAmountValid && meetsMinimum && !isCreating;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>create deposit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">asset</label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="select asset" />
              </SelectTrigger>
              <SelectContent>
                {ASSETS.map((a) => (
                  <SelectItem key={a.symbol} value={a.symbol}>
                    {a.symbol} · {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">network</label>
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="select network" />
              </SelectTrigger>
              <SelectContent>
                {assetMeta.networks.map((n) => (
                  <SelectItem key={n.key} value={n.key}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              required confirmations: {networkMeta.requiredConfirmations}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">amount (optional)</label>
              <p className="text-xs text-muted-foreground">
                min: {minDeposit} {asset}
              </p>
            </div>
            <Input
              className="rounded-2xl"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="leave empty to accept any amount"
            />
            {!isAmountValid && (
              <p className="text-xs text-destructive">amount must be a positive number</p>
            )}
            {isAmountValid && !meetsMinimum && (
              <p className="text-xs text-destructive">
                amount below minimum deposit of {minDeposit} {asset}
              </p>
            )}
          </div>

          <Alert className="rounded-2xl">
            <AlertTitle>important</AlertTitle>
            <AlertDescription>
              backend will generate a deposit address for {asset} on {networkMeta.label}. do not
              send from a different network or you will lose your funds permanently.
            </AlertDescription>
          </Alert>

          <Button
            className="w-full rounded-2xl"
            disabled={!canCreate}
            onClick={onCreate}
          >
            {isCreating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> creating...
              </span>
            ) : (
              "generate deposit address"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}