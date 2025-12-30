import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import type { Deposit } from "@/types/wallet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function StatusBadge({ status }: { status: Deposit["status"] }) {
  if (status === "COMPLETED") {
    return <Badge className="rounded-full">completed</Badge>;
  }
  if (status === "FAILED") {
    return <Badge variant="destructive" className="rounded-full">failed</Badge>;
  }
  return <Badge variant="secondary" className="rounded-full">pending</Badge>;
}

export function WalletOverview({
  deposits,
  assets,
  onOpenDeposit,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  isLoading,
  currentPage
}: {
  deposits?: Deposit[];
  assets: { symbol: string; name: string }[];
  onOpenDeposit: (id: string) => void;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
  currentPage: number;
}) {
  const depositsList = Array.isArray(deposits) ? deposits : [];

  const balances = depositsList
    .filter((d) => d.status === "COMPLETED")
    .reduce((acc, d) => {
      acc[d.asset] = (Number(acc[d.asset] || 0) + Number(d.amount)).toString();
      return acc;
    }, {} as Record<string, string>);

  const assetsWithBalance = assets.filter(
    (a) => Number(balances[a.symbol] || 0) > 0
  );

  return (
    <div className="grid gap-4 lg:grid-cols-1">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assetsWithBalance.length === 0 ? (
            <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
              No balance yet. Complete deposits to see your balance.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {assetsWithBalance.map((a) => (
                <Card key={a.symbol} className="rounded-2xl">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{a.symbol}</p>
                    <p className="text-xl font-semibold">{balances[a.symbol]}</p>
                    <p className="text-xs text-muted-foreground">{a.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Latest Deposits</p>
              <p className="text-xs text-muted-foreground">Click to view details</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {depositsList.map((d) => (
                    <button
                      key={d._id}
                      onClick={() => onOpenDeposit(d._id)}
                      className="w-full rounded-2xl border p-3 text-left transition hover:bg-muted/40"
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
                        <span className="text-sm">{d.amount}</span>
                      </div>
                    </button>
                  ))}
                  {depositsList.length === 0 && (
                    <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
                      no deposits yet. switch to deposit tab to create one.
                    </div>
                  )}
                </div>

                {(hasPrev || hasNext) && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={onPrev}
                          aria-disabled={!hasPrev}
                          className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <span className="text-sm px-4">{currentPage}</span>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          onClick={onNext}
                          aria-disabled={!hasNext}
                          className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}