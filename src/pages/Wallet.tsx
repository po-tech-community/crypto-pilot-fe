import { useEffect, useMemo, useState } from "react";
import { createDeposit, getAssets, getDeposit, getDepositById } from "@/api/wallet/walletAPI";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepositHistory } from "@/components/wallet/walletHistory";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { CreateDepositCard } from "@/components/wallet/walletCreate";
import { DepositDetailsCard } from "@/components/wallet/walletDetail";
import { Spinner } from "@/components/ui/spinner";
import type { Asset, Deposit, NetworkKey } from "@/types/wallet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function WalletPage() {
  const [tab, setTab] = useState<"wallet" | "deposit">("wallet");
  const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);

  const [assetSymbol, setAssetSymbol] = useState("BTC");
  const [networkKey, setNetworkKey] = useState<NetworkKey>("bitcoin");
  const [amount, setAmount] = useState("");

  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });

  const { data, isPending, error: depositErrors, isError } = useQuery({
    queryKey: ["deposits", page],
    queryFn: () =>
      getDeposit({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
    refetchInterval: 3000,
  });

  const deposits: Deposit[] = data?.data ?? [];
  const hasNext = deposits.length === PAGE_SIZE;
  const hasPrev = page > 1;

  const { data: selectedDeposit, error: depositError } = useQuery({
    queryKey: ["deposit", selectedDepositId],
    queryFn: () => getDepositById(selectedDepositId!),
    enabled: !!selectedDepositId,
    refetchInterval: 2000,
  });

  const selectedAsset = useMemo<Asset | null>(() => {
    return assets.find(a => a.symbol === assetSymbol) ?? null;
  }, [assets, assetSymbol]);

  const selectedNetwork = useMemo(() => {
    if (!selectedAsset) return null;
    return selectedAsset.networks.find(n => n.key === networkKey) ?? null;
  }, [selectedAsset, networkKey]);

  useEffect(() => {
    if (!selectedAsset) return;
    if (!selectedNetwork) {
      setNetworkKey(selectedAsset.networks[0].key);
    }
  }, [selectedAsset, selectedNetwork]);

  const createMutation = useMutation({
    mutationFn: createDeposit,
    onSuccess: (deposit) => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      setSelectedDepositId(deposit._id);
      setTab("deposit");
      setAmount("");
      setPage(1);
    },
  });

  const errorMessage = depositErrors || depositError || createMutation.error;

  if (isPending && page === 1) {
    return (
      <div className="min-h-screen w-full bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Spinner className="size-4" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen w-full bg-background p-4 md:p-8">
        <div className="mx-auto max-w-5xl space-y-4">
          {errorMessage && (
            <div className="rounded-2xl border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {String(errorMessage.message)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Wallet</h1>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="rounded-2xl">
            <TabsTrigger value="wallet" className="rounded-2xl">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="deposit" className="rounded-2xl">
              Deposit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-4">
          <WalletOverview
              deposits={deposits}
              assets={assets}
              onOpenDeposit={(id) => {
                setSelectedDepositId(id);
                setTab("deposit");
              }}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onNext={() => setPage(p => p + 1)}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              isLoading={isPending}
              currentPage={page}
            />
          </TabsContent>

          <TabsContent value="deposit" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {selectedAsset && selectedNetwork && (
                <CreateDepositCard
                  assets={assets}
                  assetSymbol={assetSymbol}
                  setAssetSymbol={setAssetSymbol}
                  networkKey={networkKey}
                  setNetworkKey={setNetworkKey}
                  amount={amount}
                  setAmount={setAmount}
                  isCreating={createMutation.isPending}
                  onCreate={() =>
                    createMutation.mutate({
                      asset: assetSymbol,
                      network: networkKey,
                      amount: amount || undefined,
                    })
                  }
                />
              )}

              <DepositDetailsCard deposit={selectedDeposit ?? null} />
            </div>

            <DepositHistory
              deposits={deposits}
              selectedId={selectedDepositId}
              onSelect={setSelectedDepositId}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onNext={() => setPage(p => p + 1)}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              isLoading={isPending}
              currentPage={page}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}