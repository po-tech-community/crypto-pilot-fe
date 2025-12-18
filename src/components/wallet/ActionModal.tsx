import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ActionModal({
  mode,
  amount,
  setAmount,
  onClose,
  onConfirm,
  submitting,
  error,
  maxAmount,
}: {
  mode: "Deposit" | "Withdraw";
  amount: string;
  setAmount: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  submitting?: boolean;
  error?: string | null;
  maxAmount?: number;
}) {
  const n = Number(amount);
  const canSubmit = Number.isFinite(n) && n > 0 && !submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{mode} Funds</p>
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Close
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount"
              inputMode="decimal"/>
            {mode === "Withdraw" && typeof maxAmount === "number" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setAmount(maxAmount.toFixed(2))}
                disabled={submitting || maxAmount <= 0}>
                Max
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {mode === "Withdraw"? "Withdrawal must not exceed available balance": null}
          </p>
          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button className="w-full" onClick={onConfirm} disabled={!canSubmit}>
            {submitting? "Processing": mode === "Deposit"? "Deposit": "Withdraw"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}