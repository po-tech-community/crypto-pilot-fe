import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Deposit, ListDeposit } from "@/types/wallet";


function StatusBadge({ status }: { status: Deposit["status"] }) {
  if (status === "COMPLETED") {
    return <Badge className="rounded-full">completed</Badge>;
  }
  if (status === "FAILED") {
    return <Badge variant="destructive" className="rounded-full">failed</Badge>;
  }
  return <Badge variant="secondary" className="rounded-full">pending</Badge>;
}

function shortenHash(hash: string, length = 8) {
  if (!hash || hash.length <= length * 2 + 3) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

export function DepositHistory({
  deposits,
  selectedId,
  onSelect
}: {
  deposits: Deposit[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>deposit history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {deposits.length === 0 && (
          <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
            no deposits yet
          </div>
        )}

        {deposits.map((d) => (
          <button
            key={d._id}
            onClick={() => onSelect(d._id)}
            className={`w-full rounded-2xl border p-3 text-left transition hover:bg-muted/40 ${
              selectedId === d._id ? "bg-muted/40 border-primary" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{d.asset}</span>
                  <span className="text-xs text-muted-foreground">{d.network}</span>
                  <StatusBadge status={d.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(d.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm">{d.amount}</p>
                <p className="text-xs text-muted-foreground">
                  {d.txHash ? shortenHash(d.txHash) : "no tx yet"}
                </p>
              </div>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}