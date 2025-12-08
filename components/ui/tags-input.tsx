'use client'

import { useState } from 'react'

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
}

export default function TagsInput({ 
  value, 
  onChange, 
  placeholder = "Add tags...",
  maxTags = 10,
  disabled = false 
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = inputValue.trim()
      if (tag && value.length < maxTags && !value.includes(tag)) {
        onChange([...value, tag])
        setInputValue('')
      }
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[42px] p-2 bg-input border border-border rounded-lg">
        {value.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-primary hover:text-primary/70"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {!disabled && value.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-foreground placeholder-muted-foreground"
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add tags. {maxTags - value.length} remaining.
      </p>
    </div>
  )
}