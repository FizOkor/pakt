'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { createConfig, http } from 'wagmi'
import { storyTestnet } from 'viem/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Story Protocol testnet configuration
const storyChain = {
  id: 1516,
  name: 'Story Testnet',
  nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.storyrpc.io'] },
  },
  blockExplorers: {
    default: { name: 'StoryScan', url: 'https://www.storyscan.io' },
  },
  testnet: true,
}

const config = createConfig({
  chains: [storyChain as any],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'default-project-id',
    }),
  ],
  transports: {
    [storyChain.id]: http('https://testnet.storyrpc.io'),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
