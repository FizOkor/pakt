'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

interface WalletConnectProps {
  onConnected?: () => void
  isButton?: boolean
}

export default function WalletConnect({ onConnected, isButton }: WalletConnectProps) {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isConnected && mounted) {
      onConnected?.()
    }
  }, [isConnected, mounted, onConnected])

  if (!mounted) return null

  const handleConnect = () => {
    connect({ connector: injected() })
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address && !isButton) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
        <div className="w-2 h-2 bg-primary rounded-full" />
        <span className="text-sm font-medium text-foreground">{address.slice(0, 6)}...{address.slice(-4)}</span>
        <button
          onClick={handleDisconnect}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnected}
      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
    </button>
  )
}
