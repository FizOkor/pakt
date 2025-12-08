'use client'

import { useState } from 'react'

interface SocialMedia {
  platform: string
  url: string
}

interface Creator {
  name: string
  address: string
  description: string
  contributionPercent: number
  socialMedia: SocialMedia[]
}

interface CreatorsInputProps {
  value: Creator[]
  onChange: (creators: Creator[]) => void
  disabled?: boolean
}

export default function CreatorsInput({ 
  value, 
  onChange, 
  disabled = false 
}: CreatorsInputProps) {
  const [expandedCreator, setExpandedCreator] = useState<number | null>(null)

  const addCreator = () => {
    onChange([
      ...value,
      {
        name: '',
        address: '',
        description: '',
        contributionPercent: 100,
        socialMedia: []
      }
    ])
  }

  const updateCreator = (index: number, updates: Partial<Creator>) => {
    const updated = [...value]
    updated[index] = { ...updated[index], ...updates }
    onChange(updated)
  }

  const removeCreator = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const addSocialMedia = (creatorIndex: number) => {
    const creator = value[creatorIndex]
    updateCreator(creatorIndex, {
      socialMedia: [...creator.socialMedia, { platform: '', url: '' }]
    })
  }

  const updateSocialMedia = (
    creatorIndex: number, 
    mediaIndex: number, 
    updates: Partial<SocialMedia>
  ) => {
    const creator = value[creatorIndex]
    const updatedMedia = [...creator.socialMedia]
    updatedMedia[mediaIndex] = { ...updatedMedia[mediaIndex], ...updates }
    updateCreator(creatorIndex, { socialMedia: updatedMedia })
  }

  const removeSocialMedia = (creatorIndex: number, mediaIndex: number) => {
    const creator = value[creatorIndex]
    updateCreator(creatorIndex, {
      socialMedia: creator.socialMedia.filter((_, i) => i !== mediaIndex)
    })
  }

  return (
    <div className="space-y-4">
      {value.map((creator, index) => (
        <div key={index} className="border border-border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-foreground">
              Creator {index + 1} {creator.name && `- ${creator.name}`}
            </h4>
            {!disabled && value.length > 1 && (
              <button
                type="button"
                onClick={() => removeCreator(index)}
                className="text-destructive hover:text-destructive/70 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name *</label>
              <input
                type="text"
                value={creator.name}
                onChange={(e) => updateCreator(index, { name: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                placeholder="Organization or individual name"
                disabled={disabled}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address *</label>
              <input
                type="text"
                value={creator.address}
                onChange={(e) => updateCreator(index, { address: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground font-mono text-sm"
                placeholder="0x..."
                disabled={disabled}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                value={creator.description}
                onChange={(e) => updateCreator(index, { description: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                placeholder="Brief description of creator..."
                rows={2}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Contribution Percentage *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={creator.contributionPercent}
                  onChange={(e) => updateCreator(index, { 
                    contributionPercent: parseInt(e.target.value) 
                  })}
                  className="flex-1"
                  disabled={disabled}
                />
                <span className="w-16 text-center font-medium">
                  {creator.contributionPercent}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Total: {value.reduce((sum, c) => sum + c.contributionPercent, 0)}%
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-foreground">Social Media</label>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => addSocialMedia(index)}
                  className="text-sm text-primary hover:text-primary/70"
                >
                  + Add Social
                </button>
              )}
            </div>
            
            {creator.socialMedia.map((media, mediaIndex) => (
              <div key={mediaIndex} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={media.platform}
                  onChange={(e) => updateSocialMedia(index, mediaIndex, { 
                    platform: e.target.value 
                  })}
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                  placeholder="Platform (Twitter, Telegram...)"
                  disabled={disabled}
                />
                <input
                  type="text"
                  value={media.url}
                  onChange={(e) => updateSocialMedia(index, mediaIndex, { 
                    url: e.target.value 
                  })}
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                  placeholder="https://..."
                  disabled={disabled}
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeSocialMedia(index, mediaIndex)}
                    className="px-3 text-destructive hover:text-destructive/70"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {!disabled && (
        <button
          type="button"
          onClick={addCreator}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          + Add Creator
        </button>
      )}
    </div>
  )
}