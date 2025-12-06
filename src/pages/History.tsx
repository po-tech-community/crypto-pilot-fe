// src/pages/History.tsx

type TradeSide = "BUY" | "SELL";
type TradeStatus = "Filled" | "Partially Filled" | "Cancelled";

type HistoryRow = {
  id: string;
  date: string;
  pair: string;
  side: TradeSide;
  price: string;
  amount: string;
  fee: string;
  status: TradeStatus;
};

const MOCK_HISTORY: HistoryRow[] = [
  {
    id: "ORD-2025-0001",
    date: "2025-12-01 14:32",
    pair: "BTC/USDT",
    side: "BUY",
    price: "98,450.00",
    amount: "0.015",
    fee: "0.10 USDT",
    status: "Filled",
  },
  {
    id: "ORD-2025-0002",
    date: "2025-12-01 14:18",
    pair: "ETH/USDT",
    side: "SELL",
    price: "4,230.50",
    amount: "0.80",
    fee: "0.34 USDT",
    status: "Partially Filled",
  },
  {
    id: "ORD-2025-0003",
    date: "2025-11-30 19:05",
    pair: "SOL/USDT",
    side: "BUY",
    price: "210.30",
    amount: "12.0",
    fee: "0.80 USDT",
    status: "Filled",
  },
  {
    id: "ORD-2025-0004",
    date: "2025-11-29 09:47",
    pair: "BTC/USDT",
    side: "SELL",
    price: "96,900.00",
    amount: "0.010",
    fee: "0.07 USDT",
    status: "Cancelled",
  },
];

function StatusBadge({ status }: { status: TradeStatus }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const classes =
    status === "Filled"
      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
      : status === "Partially Filled"
      ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
      : "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30";

  return <span className={`${base} ${classes}`}>{status}</span>;
}

function SidePill({ side }: { side: TradeSide }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold";

  const classes =
    side === "BUY"
      ? "bg-emerald-500/15 text-emerald-400"
      : "bg-rose-500/15 text-rose-400";

  return <span className={`${base} ${classes}`}>{side}</span>;
}

export default function History() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:px-0">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Trade history
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Mock data</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground">
            Last 24h
          </button>
          <button className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground">
            7 days
          </button>
          <button className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground">
            30 days
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-sm backdrop-blur">
        <div className="border-b border-border bg-muted/60 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Recent orders (mock)
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left">Time</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">
                  Order ID
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Pair</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">Side</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">
                  Price (USDT)
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right">
                  Amount
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Fee</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80">
              {MOCK_HISTORY.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {row.date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                    {row.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="font-medium">{row.pair}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <SidePill side={row.side} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                    {row.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                    {row.amount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {row.fee}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border bg-background/60 px-4 py-2 text-xs text-muted-foreground">
          <span>Showing {MOCK_HISTORY.length} mock orders</span>
          <button className="ml-auto rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground">
            View all orders
          </button>
        </footer>
      </section>
    </div>
  );
}
