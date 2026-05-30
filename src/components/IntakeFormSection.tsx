import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

interface IntakeFormSectionProps {
  title: string
  icon: LucideIcon
  children: ReactNode
}

export const IntakeFormSection = ({ title, icon: Icon, children }: IntakeFormSectionProps) => {
  return (
    <Card className="border-r-4 border-r-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon data-icon="inline-start" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}