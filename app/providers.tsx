'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { createConfig, http } from 'wagmi'
import { storyTestnet } from 'viem/chains'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'

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

// Create base config without WalletConnect (SSR safe)
const baseConfig = createConfig({
  chains: [storyChain as any],
  connectors: [
    injected(), // This one is safe for SSR
  ],
  transports: {
    [storyChain.id]: http('https://testnet.storyrpc.io'),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState(baseConfig)

  useEffect(() => {
    // Dynamically import WalletConnect only on client side
    const initializeWalletConnect = async () => {
      try {
        const { walletConnect } = await import('wagmi/connectors')
        
        const updatedConfig = createConfig({
          chains: [storyChain as any],
          connectors: [
            injected(),
            walletConnect({
              projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'default-project-id',
              showQrModal: true, // Optional: show QR modal
            }),
          ],
          transports: {
            [storyChain.id]: http('https://testnet.storyrpc.io'),
          },
        })
        
        setConfig(updatedConfig)
      } catch (error) {
        console.warn('WalletConnect failed to load:', error)
        // Keep using the base config without WalletConnect
      }
    }

    initializeWalletConnect()
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}