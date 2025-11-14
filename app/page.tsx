'use client'

import { useEffect, useState } from 'react'
import WalletConnect from '@/components/wallet-connect'
import LicenseGenerator from '@/components/license-generator'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background text-foreground">
      {!isConnected ? (
        <LandingPage />
      ) : (
        <LicenseGenerator />
      )}
    </main>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold text-accent">Pakt</h1>
          </div>
          <WalletConnect isButton={true} />
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-3xl text-center space-y-6">
          {/* Gradient accent line */}
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
          
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
            License Your IP
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              On-Chain
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create programmable IP licenses for your digital content in under 30 seconds. 
            Powered by Story Protocol and deployed on-chain for permanent, transparent ownership.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <WalletConnect isButton={true} />
            <button className="px-8 py-3 rounded-lg border border-border text-foreground hover:bg-card transition-colors font-medium">
              Learn More
            </button>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-3 gap-4 pt-16">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">30s</div>
              <p className="text-sm text-muted-foreground">One-click licensing</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-accent">100%</div>
              <p className="text-sm text-muted-foreground">On-chain permanent</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">∞</div>
              <p className="text-sm text-muted-foreground">Web3 native</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>Powered by Story Protocol</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Docs</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
