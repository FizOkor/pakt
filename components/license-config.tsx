'use client'

import { useState } from 'react'

interface LicenseConfigProps {
  licenseData: any
  onNext: () => void
  onUpdate: (updates: any) => void
}

export default function LicenseConfig({ licenseData, onNext, onUpdate }: LicenseConfigProps) {
  const [config, setConfig] = useState({
    licensingEnabled: true,
    royaltyPercentage: 10,
    commercialUse: true,
    derivatives: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      licensingEnabled: config.licensingEnabled,
      royaltyPercentage: config.royaltyPercentage,
      commercialUse: config.commercialUse,
      derivatives: config.derivatives,
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-8">Configure License Terms</h2>

      {/* Content Preview */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-foreground">{licenseData?.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{licenseData?.description}</p>
        <div className="text-xs text-muted-foreground">Category: {licenseData?.category}</div>
      </div>

      {/* Licensing Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Enable Licensing</label>
          <input
            type="checkbox"
            checked={config.licensingEnabled}
            onChange={(e) => setConfig({ ...config, licensingEnabled: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
        <p className="text-xs text-muted-foreground">Allow others to mint licenses for your IP</p>
      </div>

      {/* Royalty Percentage */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Royalty Percentage</label>
          <span className="text-lg font-semibold text-primary">{config.royaltyPercentage}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          value={config.royaltyPercentage}
          onChange={(e) => setConfig({ ...config, royaltyPercentage: parseInt(e.target.value) })}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">Earn royalties when others license your work</p>
      </div>

      {/* Commercial Use */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Commercial Use Allowed</label>
          <input
            type="checkbox"
            checked={config.commercialUse}
            onChange={(e) => setConfig({ ...config, commercialUse: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
        <p className="text-xs text-muted-foreground">Licensees can use for commercial purposes</p>
      </div>

      {/* Derivatives */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Derivatives Allowed</label>
          <input
            type="checkbox"
            checked={config.derivatives}
            onChange={(e) => setConfig({ ...config, derivatives: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
        <p className="text-xs text-muted-foreground">Licensees can create derivative works</p>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Review and Sign
      </button>
    </form>
  )
}
