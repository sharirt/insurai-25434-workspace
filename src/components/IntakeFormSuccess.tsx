import { CheckCircle } from 'lucide-react'

interface IntakeFormSuccessProps {
  name?: string
}

export const IntakeFormSuccess = ({ name }: IntakeFormSuccessProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ direction: 'rtl' }}>
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle className="size-16 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          {name ? `הטופס נשלח בהצלחה! תודה ${name}` : 'הטופס נשלח בהצלחה!'}
        </h1>
        <p className="text-muted-foreground">ניתן לסגור דף זה</p>
      </div>
    </div>
  )
}