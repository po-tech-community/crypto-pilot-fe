import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, ExternalLink, Loader2, XCircle } from "lucide-react";
import type { Deposit } from "@/types/wallet";
import { getExplorerUrl, useConfirmationCountdown } from "@/api/wallet/ultilities";
import { ASSETS } from "@/api/wallet/constant";
import { Progress } from "../ui/progress";

function StatusBadge({ status }: { status: Deposit["status"] }) {
  if (status === "COMPLETED") return <Badge>completed</Badge>;
  if (status === "FAILED") return <Badge variant="destructive">failed</Badge>;
  return <Badge variant="secondary">pending</Badge>;
}

function StatusIcon({ status }: { status: Deposit["status"] }) {
  if (status === "COMPLETED") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === "FAILED") return <XCircle className="h-5 w-5 text-red-500" />;
  return <Loader2 className="h-5 w-5 animate-spin text-gray-500" />;
}

function shortenHash(hash: string, length = 10) {
  if (!hash || hash.length <= length * 2 + 3) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

export function DepositDetailsCard({
  deposit,
  requiredConfirmations,
  estimatedBlockTimeSec,
}: {
  deposit: Deposit | null;
  requiredConfirmations: number;
  estimatedBlockTimeSec: number;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const confirmations = deposit?.confirmations ?? 0;
  const requiredConfirmation = ASSETS .find(a => a.symbol === deposit?.asset) ?.networks.find(n => n.key === deposit?.network) ?.requiredConfirmations ?? 1;
  const estimatedBlockTimeSecs = ASSETS.find(a => a.symbol === deposit?.asset)?.estimatedBlockTimeSec ?? 60;

  const hasTx = Boolean(deposit?.txHash);

  const { estimatedProgress, remainingSec } =
    useConfirmationCountdown(
      confirmations,
      requiredConfirmation,
      estimatedBlockTimeSecs,
      hasTx
    );

  const progress = useMemo(() => {
    if (!deposit) return 0;

    if (confirmations > 0) {
      return Math.min(
        100,
        (confirmations / requiredConfirmations) * 100
      );
    }

    return estimatedProgress;
  }, [
    deposit,
    confirmations,
    requiredConfirmations,
    estimatedProgress,
  ]);

  if (!deposit) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>deposit details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
            create a deposit to see address and confirmations
          </div>
        </CardContent>
      </Card>
    );
  }

  const explorerUrl = deposit.txHash
    ? getExplorerUrl(deposit.network, deposit.txHash)
    : "";

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>deposit details</CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {deposit.asset} deposit
                </h3>
                <StatusBadge status={deposit.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                network: {deposit.network}
              </p>
            </div>
            <StatusIcon status={deposit.status} />
          </div>

          <Alert>
            <AlertTitle>
              send only {deposit.asset} via {deposit.network}
            </AlertTitle>
            <AlertDescription>
              sending other assets or using different networks can cause permanent loss
            </AlertDescription>
          </Alert>

          <div className="rounded-2xl border p-3">
            <p className="text-xs text-muted-foreground">deposit address</p>
            <div className="mt-1 flex justify-between gap-2">
              <code className="break-all text-sm">{deposit.address}</code>
              <Button size="sm" variant="secondary" onClick={() => copyToClipboard(deposit.address)}>
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border p-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>confirmations</span>
              <span>{confirmations} / {requiredConfirmations}</span>
            </div>
            <Progress value={progress} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {deposit.status === "COMPLETED"
                ? "successfully completed"
                : confirmations > 0 && confirmations < requiredConfirmations
                  ? `time remaining: ~${Math.ceil(remainingSec / 60)} min`
                  : hasTx
                    ? `time remaining: ~${Math.ceil(remainingSec / 60)} min`
                    : "waiting for transaction"}
            </p>
          </div>

          <div className="rounded-2xl border p-3">
            <p className="text-xs text-muted-foreground">amount</p>
            <p>{deposit.amount}</p>
          </div>

          <div className="rounded-2xl border p-3">
            <p className="text-xs text-muted-foreground">transaction hash</p>
            {deposit.txHash ? (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline"
              >
                {shortenHash(deposit.txHash, 12)}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">not detected yet</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            created: {new Date(deposit.createdAt).toLocaleString()}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
