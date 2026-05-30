import React from "react";
import { useFileUpload } from '@blocksdiy/blocks-client-sdk/reactSdk'
import { Upload, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface IntakeFormUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
}

export const IntakeFormUpload = ({ label, value, onChange }: IntakeFormUploadProps) => {
  const { uploadFunction, isLoading } = useFileUpload()
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('יש להעלות קובץ תמונה בלבד')
      return
    }
    try {
      const url = await uploadFunction(file)
      onChange(url)
      toast.success('הקובץ הועלה בהצלחה')
    } catch {
      toast.error('שגיאה בהעלאת הקובץ')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      {value ? (
        <div className="relative rounded-lg border overflow-hidden">
          <img src={value} alt={label} className="w-full h-40 object-contain bg-muted" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 left-2 rounded-full bg-background/80 px-2 py-1 text-xs text-destructive"
          >
            הסר
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">לחץ או גרור לכאן</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={isLoading} />
        </label>
      )}
    </div>
  )
}