import React from "react";
import { useState, useEffect } from 'react'
import { useEntityGetAll } from '@blocksdiy/blocks-client-sdk/reactSdk'
import { ClientsEntity, ClientIntakeFormPage } from '@/product-types'
import { getPageUrl } from '@/lib/utils'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Building2, CreditCard, Loader2 } from 'lucide-react'

export default function ClientVerification() {
  const navigate = useNavigate()
  const [nationalId, setNationalId] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const { data: clients, isLoading } = useEntityGetAll(
    ClientsEntity,
    { national_id: searchValue },
    { enabled: !!searchValue },
  )

  useEffect(() => {
    if (!searchValue || isLoading) return
    if (clients && clients.length > 0) {
      navigate(getPageUrl(ClientIntakeFormPage) + `?clientId=${clients[0].id}&clientRole=true`)
    } else if (hasSearched) {
      setError('תעודת הזהות לא נמצאה במערכת. אנא פנה לסוכן שלך.')
      setSearchValue('')
      setHasSearched(false)
    }
  }, [clients, isLoading, searchValue, hasSearched, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = nationalId.trim()
    if (!trimmed) return
    setError('')
    setSearchValue(trimmed)
    setHasSearched(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4" style={{ direction: 'rtl' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Building2 className="size-12 text-primary" />
          <h1 className="text-2xl font-bold">ברוכים הבאים</h1>
          <p className="text-muted-foreground">מערכת ניהול ביטוח</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="national_id">תעודת זהות</Label>
              <div className="relative">
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="national_id"
                  value={nationalId}
                  onChange={(e) => { setNationalId(e.target.value); setError('') }}
                  placeholder="הכנס מספר תעודת זהות"
                  className="pr-10"
                  dir="rtl"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !nationalId.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  בודק...
                </>
              ) : (
                'המשך'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}