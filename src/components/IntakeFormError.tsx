import { AlertCircle } from 'lucide-react'

interface IntakeFormErrorProps {
  message: string
}

export const IntakeFormError = ({ message }: IntakeFormErrorProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ direction: 'rtl' }}>
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="size-16 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">{message}</h1>
      </div>
    </div>
  )
}