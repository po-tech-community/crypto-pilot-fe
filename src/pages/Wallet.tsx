import { useEffect, useMemo, useState } from "react";

import { createDeposit, getDeposit, getDepositById } from "@/api/wallet/walletAPI";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepositHistory } from "@/components/wallet/walletHistory";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { CreateDepositCard } from "@/components/wallet/walletCreate";
import { DepositDetailsCard } from "@/components/wallet/walletDetail";
import { ASSETS } from "@/api/wallet/constant";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

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
  const [asset, setAsset] = useState("BTC");
  const [network, setNetwork] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  
  const { isPending, isError, data, error: depositError } = useQuery({
    queryKey: ['deposit'],
    queryFn: getDeposit,
    refetchInterval: 3000,
  })

  const deposits = data?.data ?? [];

  const { data: selectedDeposit, error: depositErrors } = useQuery({
    queryKey: ["deposit", selectedDepositId],
    queryFn: () => getDepositById(selectedDepositId!),
    enabled: !!selectedDepositId,
    refetchInterval: 2000,
  });


  const createAssetMeta = useMemo(() => { return ASSETS.find(a => a.symbol === asset)!; }, [asset]);

  const detailAssetMeta = useMemo(() => { if (!selectedDeposit) return null; return ASSETS.find(a => a.symbol === selectedDeposit.asset) ?? null; }, [selectedDeposit]);

  const createNetworkMeta = useMemo(() => {
    return (
      createAssetMeta.networks.find(n => n.key === network) ??
      createAssetMeta.networks[0]
    );
  }, [createAssetMeta, network]);

  const detailNetworkMeta = useMemo(() => {
    if (!detailAssetMeta || !selectedDeposit) return null;
    return (
      detailAssetMeta.networks.find(
        n => n.key === selectedDeposit.network
      ) ?? null
    );
  }, [detailAssetMeta, selectedDeposit]);
  
  
  useEffect(() => {
    const validNetwork = createAssetMeta.networks.find(n => n.key === network);
    if (!validNetwork) {
      setNetwork(createAssetMeta.networks[0].key);
    }
  }, [asset, network, createAssetMeta]);
  
  const createMutation = useMutation({
    mutationFn: createDeposit,
    onSuccess: (deposit) => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      setSelectedDepositId(deposit._id);
      setTab("deposit");
      setAmount("");
    },
  });


  const handleCreateDeposit = () => {
    createMutation.mutate({
      asset,
      network,
      amount: amount.trim() || undefined,
    });
  };
  const handleOpenDeposit = (id: string) => {
    setSelectedDepositId(id);
    setTab("deposit");
  };

  const errorMessage = depositErrors || depositError || createMutation.error;

  if (isPending) {
    return (

      <div className="min-h-screen w-full bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Spinner className="size-4" />
          <span>Loading...</span>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">wallet</h1>
            <p className="text-sm text-muted-foreground">
              demo app with backend generated addresses
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="rounded-2xl">
            <TabsTrigger value="wallet" className="rounded-2xl">
              wallet
            </TabsTrigger>
            <TabsTrigger value="deposit" className="rounded-2xl">
              deposit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-4">
          <WalletOverview
            deposits={deposits}
            onOpenDeposit={handleOpenDeposit}
          />
          </TabsContent>

          <TabsContent value="deposit" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
            <CreateDepositCard
              asset={asset}
              setAsset={setAsset}
              network={network}
              setNetwork={setNetwork}
              amount={amount}
              setAmount={setAmount}
              assetMeta={createAssetMeta}
              networkMeta={createNetworkMeta}
              isCreating={createMutation.isPending}
              onCreate={handleCreateDeposit}
            />
              <DepositDetailsCard
              deposit={selectedDeposit ?? null}
              requiredConfirmations={detailNetworkMeta?.requiredConfirmations ?? 1}
              estimatedBlockTimeSec={detailAssetMeta?.estimatedBlockTimeSec ?? 60}
            />
            </div>

            <DepositHistory
              deposits={deposits}
              selectedId={selectedDepositId}
              onSelect={setSelectedDepositId}
            />
          </TabsContent>
        </Tabs>
          
      </div>
    </div>
  )
}







