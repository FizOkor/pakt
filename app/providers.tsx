"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { createConnector } from "wagmi";
import { walletConnect } from "@wagmi/connectors";
import { defineChain } from "viem";

// Story Protocol testnet
const storyChain = defineChain({
  id: 1516,
  name: "aeneid",
  nativeCurrency: { name: "IP", symbol: "IP", decimals: 18 },
  rpcUrls: { default: { http: ["https://aeneid.storyrpc.io"] } },
  blockExplorers: {
    default: { name: "StoryScan", url: "https://aeneid.explorer.story.foundation" },
  },
  testnet: true,
});

const config = createConfig({
  chains: [storyChain],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [storyChain.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
