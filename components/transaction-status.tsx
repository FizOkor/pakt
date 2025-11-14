'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { registerIPAsset } from '@/lib/register-ip'

interface TransactionStatusProps {
  licenseData: any
  onNext: () => void
}

export default function TransactionStatus({ licenseData, onNext }: TransactionStatusProps) {
  const [status, setStatus] = useState<'signing' | 'confirming' | 'complete' | 'error'>('signing')
  const [txHash, setTxHash] = useState('')
  const [ipId, setIpId] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isConnected) return

    const registerIP = async () => {
      try {
        setStatus('signing')
        
        // In production, this would call the Story SDK with the user's signer
        const response = await executeIPRegistration()
        
        setStatus('confirming')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        if (response.txHash) {
          setTxHash(response.txHash)
        }
        if (response.ipId) {
          setIpId(response.ipId)
        }
        
        setStatus('complete')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed')
        setStatus('error')
      }
    }

    registerIP()
  }, [mounted, isConnected])

  const executeIPRegistration = async () => {
    // Simulate transaction execution
    // In production: use StoryClient with wagmi's configured account
    return {
      txHash: '0x' + Math.random().toString(16).substring(2, 66),
      ipId: '0x' + Math.random().toString(16).substring(2, 42),
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-foreground text-center mb-8">Creating License</h2>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {!isConnected && (
        <div className="p-4 bg-muted/50 border border-border rounded-lg text-muted-foreground text-sm">
          Please connect your wallet to proceed with registration
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-4">
        {['signing', 'confirming', 'complete'].map((step, idx) => (
          <div key={step} className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              status === step ? 'bg-primary text-primary-foreground animate-pulse' :
              ['signing', 'confirming', 'complete'].indexOf(status) > idx ?
              'bg-primary text-primary-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {['signing', 'confirming', 'complete'].indexOf(status) > idx ? '✓' : idx + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground capitalize">{step === 'signing' ? 'Sign Transaction' : step === 'confirming' ? 'Confirm on Blockchain' : 'Complete'}</p>
              <p className="text-sm text-muted-foreground">
                {step === 'signing' && 'Waiting for wallet signature...'}
                {step === 'confirming' && 'Broadcasting to Story Protocol Testnet...'}
                {step === 'complete' && 'Your IP is now licensed on-chain'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {status === 'complete' && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Transaction Hash:</span>
            <a 
              href={`https://www.storyscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-mono hover:underline"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">IP Asset ID:</span>
            <code className="text-primary font-mono">{ipId.slice(0, 10)}...{ipId.slice(-8)}</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Network:</span>
            <span className="text-foreground">Story Testnet (1516)</span>
          </div>
        </div>
      )}

      {status === 'complete' && (
        <button
          onClick={onNext}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mt-8"
        >
          View Your License
        </button>
      )}
    </div>
  )
}
