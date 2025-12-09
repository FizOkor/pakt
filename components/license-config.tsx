'use client'

import { useState } from 'react'

interface LicenseConfigProps {
  IPData: any
  onNext: () => void
  onUpdate: (updates: any) => void
}

interface LicenseConfig {
  licensingEnabled: boolean
  licenseType: 'commercialRemix' | 'commercialUse' | 'nonCommercialSocialRemixing' | 'creativeCommonsAttribution'
  royaltyPercentage: number
  mintingFee: number
  commercialUse: boolean
  derivatives: boolean
  attributionRequired: boolean
}

export default function LicenseConfig({ IPData, onNext, onUpdate }: LicenseConfigProps) {
  const [config, setConfig] = useState<LicenseConfig>({
    licensingEnabled: true,
    licenseType: 'commercialRemix',
    royaltyPercentage: 10,
    mintingFee: 1.0,
    commercialUse: true,
    derivatives: true,
    attributionRequired: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      licensingEnabled: config.licensingEnabled,
      licenseType: config.licenseType,
      royaltyPercentage: config.royaltyPercentage,
      mintingFee: config.mintingFee,
      commercialUse: config.commercialUse,
      derivatives: config.derivatives,
      attributionRequired: config.attributionRequired,
    })
    onNext()
  }

const licenseTypes = [
  { 
    id: 'commercialRemix' as const, 
    label: 'Commercial Remix', 
    desc: 'Allows commercial use & derivatives with royalties',
    commercial: true,
    derivatives: true
  },
  { 
    id: 'commercialUse' as const, 
    label: 'Commercial Use', 
    desc: 'Commercial use only',
    commercial: true,
    derivatives: false
  },
  { 
    id: 'nonCommercialSocialRemixing' as const, // Updated to match SDK
    label: 'Non-Commercial Remix', 
    desc: 'Free for non-commercial remixes',
    commercial: false,
    derivatives: true
  },
  { 
    id: 'creativeCommonsAttribution' as const, // Updated to match SDK
    label: 'CC Attribution', 
    desc: 'Creative Commons with attribution',
    commercial: false,
    derivatives: false
  },
]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-8">Configure License Terms</h2>

      {/* Content Preview */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-foreground">{IPData?.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{IPData?.description}</p>
        <div className="text-xs text-muted-foreground">Category: {IPData?.category}</div>
      </div>

      {/* License Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">License Type</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {licenseTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                config.licenseType === type.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setConfig({ 
                  ...config, 
                  licenseType: type.id,
                  commercialUse: type.commercial,
                  derivatives: type.derivatives
                })
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                  config.licenseType === type.id
                    ? 'border-primary bg-primary'
                    : 'border-border'
                }`}>
                  {config.licenseType === type.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{type.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* licensing Toggle */}
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

      {/* Royalty Percentage & minting Fee - only show if commercial */}
      {config.commercialUse && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Royalty & Fees</label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-primary">{config.royaltyPercentage}%</span>
              <div className="text-sm text-muted-foreground">{config.mintingFee} $IP</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Royalty Percentage</span>
                <span>0-50%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={config.royaltyPercentage}
                onChange={(e) => setConfig({ ...config, royaltyPercentage: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Minting Fee ($IP)</span>
                <span>0-100 $IP</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={config.mintingFee}
                onChange={(e) => setConfig({ ...config, mintingFee: parseFloat(e.target.value) })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Earn {config.royaltyPercentage}% royalties when others license your work
            {config.mintingFee > 0 && ` • Licensees pay ${config.mintingFee} $IP to mint`}
          </p>
        </div>
      )}

      {/* Commercial Use & Derivatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Commercial Use</label>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              config.commercialUse 
                ? 'bg-green-500/20 text-green-600' 
                : 'bg-orange-500/20 text-orange-600'
            }`}>
              {config.commercialUse ? 'Allowed' : 'Not Allowed'}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Licensees can use for commercial purposes</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Derivatives</label>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              config.derivatives 
                ? 'bg-green-500/20 text-green-600' 
                : 'bg-orange-500/20 text-orange-600'
            }`}>
              {config.derivatives ? 'Allowed' : 'Not Allowed'}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Licensees can create derivative works</p>
        </div>
      </div>

      {/* Attribution Requirement */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Require Attribution</label>
          <input
            type="checkbox"
            checked={config.attributionRequired}
            onChange={(e) => setConfig({ ...config, attributionRequired: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Licensees must credit you as the original creator
        </p>
      </div>

      {/* License Summary */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-foreground">License Summary</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-muted-foreground">License Type:</div>
          <div className="font-medium text-foreground">
            {licenseTypes.find(t => t.id === config.licenseType)?.label}
          </div>
          
          <div className="text-muted-foreground">Commercial Use:</div>
          <div className="font-medium">
            {config.commercialUse ? (
              <span className="text-green-600">Allowed</span>
            ) : (
              <span className="text-orange-600">Not Allowed</span>
            )}
          </div>
          
          <div className="text-muted-foreground">Derivatives:</div>
          <div className="font-medium">
            {config.derivatives ? (
              <span className="text-green-600">Allowed</span>
            ) : (
              <span className="text-orange-600">Not Allowed</span>
            )}
          </div>
          
          <div className="text-muted-foreground">Attribution:</div>
          <div className="font-medium">
            {config.attributionRequired ? (
              <span className="text-green-600">Required</span>
            ) : (
              <span className="text-orange-600">Not Required</span>
            )}
          </div>
          
          {config.commercialUse && (
            <>
              <div className="text-muted-foreground">Royalty:</div>
              <div className="font-medium text-primary">{config.royaltyPercentage}%</div>
              
              <div className="text-muted-foreground">Minting Fee:</div>
              <div className="font-medium">{config.mintingFee} $IP</div>
            </>
          )}
        </div>
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