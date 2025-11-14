'use client'

import { useState } from 'react'
import { uploadToIPFS } from '@/lib/web3-storage'

interface UploadFormProps {
  onNext: (data: any) => void
}

export default function UploadForm({ onNext }: UploadFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'artwork',
    file: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError('')

    try {
      if (!formData.file) throw new Error('No file selected')

      const ipfsHash = await uploadToIPFS(formData.file, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
      })

      onNext({
        ...formData,
        ipfsHash,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-8">Register Your IP</h2>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Upload File</label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
            id="file-input"
            disabled={isUploading}
          />
          <label htmlFor="file-input" className="cursor-pointer block">
            <svg className="w-12 h-12 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-4m0-4v4m0-4H8m4 0h4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-muted-foreground">
              {formData.file ? formData.file.name : 'Click or drag to upload'}
            </p>
          </label>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title</label>
        <input
          type="text"
          placeholder="My Creative Work"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={isUploading}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          placeholder="Describe your IP..."
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          disabled={isUploading}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Category</label>
        <select
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          disabled={isUploading}
        >
          <option value="artwork">Artwork</option>
          <option value="music">Music</option>
          <option value="video">Video</option>
          <option value="writing">Writing</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={!formData.title || !formData.description || !formData.file || isUploading}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading to IPFS...' : 'Continue to License Configuration'}
      </button>
    </form>
  )
}
