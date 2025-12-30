import { useEffect, useState } from "react";

export function useConfirmationCountdown(
  confirmations: number,
  requiredConfirmations: number,
  estimatedBlockTimeSec: number,
  hasTx: boolean
) {
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!hasTx) return;
    if (confirmations >= requiredConfirmations) return;

    const timer = setInterval(() => {
      setElapsedSec((v) => v + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasTx, confirmations, requiredConfirmations]);

  const estimatedTotalSec =
    requiredConfirmations * estimatedBlockTimeSec;

  const estimatedProgress = Math.min(
    100,
    (elapsedSec / estimatedTotalSec) * 100
  );

  const remainingSec = Math.max(
    0,
    estimatedTotalSec - elapsedSec
  );

  return { estimatedProgress, remainingSec };
}


export function getExplorerUrl(network: string, txHash: string) {
    const bases: Record<string, string> = {
      bitcoin: "https://mempool.space/tx/",
      ethereum: "https://etherscan.io/tx/",
      tron: "https://tronscan.org/#/transaction/",
      bsc: "https://bscscan.com/tx/",
    };
    return bases[network] ? `${bases[network]}${txHash}` : "";
  }