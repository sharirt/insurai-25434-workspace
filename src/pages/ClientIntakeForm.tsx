import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import {
  useEntityGetAll,
  useEntityGetOne,
  useExecuteAction,
} from '@blocksdiy/blocks-client-sdk/reactSdk'
import {
  ClientFormTokensEntity,
  ClientsEntity,
  SubmitClientIntakeFormAction,
  type ClientsEntityGenderEnum,
  type ClientsEntityRelationshipEnum,
  type ClientsEntityEmploymentEnum,
} from '@/product-types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Loader2, User, Briefcase, CreditCard, FileCheck } from 'lucide-react'
import { toast } from 'sonner'
import { IntakeFormSection } from '@/components/IntakeFormSection'
import { IntakeFormUpload } from '@/components/IntakeFormUpload'
import { IntakeFormSuccess } from '@/components/IntakeFormSuccess'
import { IntakeFormError } from '@/components/IntakeFormError'
import { Skeleton } from '@/components/ui/skeleton'

interface FormData {
  gender: ClientsEntityGenderEnum | ''
  first_name: string
  last_name: string
  dateOfBirth: string
  national_id: string
  idIssueDate: string
  relationship: ClientsEntityRelationshipEnum | ''
  phone_number: string
  email: string
  cityOfResidence: string
  address: string
  apartmentNumber: string
  zipCode: string
  employment: ClientsEntityEmploymentEnum | ''
  employer: string
  companyId: string
  occupation: string
  american: boolean
  smoker: boolean
}

const INITIAL_FORM: FormData = {
  gender: '',
  first_name: '',
  last_name: '',
  dateOfBirth: '',
  national_id: '',
  idIssueDate: '',
  relationship: '',
  phone_number: '',
  email: '',
  cityOfResidence: '',
  address: '',
  apartmentNumber: '',
  zipCode: '',
  employment: '',
  employer: '',
  companyId: '',
  occupation: '',
  american: false,
  smoker: false,
}

const RELATIONSHIP_OPTIONS: ClientsEntityRelationshipEnum[] = [
  'רווק',
  'נשוי',
  'גרוש',
  'אלמן',
  'ידוע בציבור',
]

const EMPLOYMENT_OPTIONS: ClientsEntityEmploymentEnum[] = [
  'שכיר',
  'עצמאי',
  'סטודנט',
  'חבר קיבוץ',
  'אברך',
  'חייל בשירות חובה',
  'משרתת בשירות לאומי',
  'לא עובד/מובטל',
  'גמלאי',
  'שכיר בעל שליטה',
]

export default function ClientIntakeForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const { data: tokens, isLoading: tokensLoading } = useEntityGetAll(
    ClientFormTokensEntity,
    { token },
  )
  const tokenRecord = tokens?.[0]

  const { data: existingClient } = useEntityGetOne(
    ClientsEntity,
    { id: tokenRecord?.clientId || '' },
    { enabled: !!tokenRecord?.clientId },
  )

  const { executeFunction, isLoading: submitting } = useExecuteAction(SubmitClientIntakeFormAction)

  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [idFrontUrl, setIdFrontUrl] = useState('')
  const [idBackUrl, setIdBackUrl] = useState('')
  const [idAppendixUrl, setIdAppendixUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [prefilled, setPrefilled] = useState(false)

  useEffect(() => {
    if (existingClient && !prefilled) {
      setForm({
        gender: existingClient.gender || '',
        first_name: existingClient.first_name || '',
        last_name: existingClient.last_name || '',
        dateOfBirth: existingClient.dateOfBirth || '',
        national_id: existingClient.national_id || '',
        idIssueDate: existingClient.idIssueDate || '',
        relationship: existingClient.relationship || '',
        phone_number: existingClient.phone_number || '',
        email: existingClient.email || '',
        cityOfResidence: existingClient.cityOfResidence || '',
        address: existingClient.address || '',
        apartmentNumber: existingClient.apartmentNumber || '',
        zipCode: existingClient.zipCode || '',
        employment: existingClient.employment || '',
        employer: existingClient.employer || '',
        companyId: existingClient.companyId || '',
        occupation: existingClient.occupation || '',
        american: existingClient.american || false,
        smoker: existingClient.smoker || false,
      })
      setPrefilled(true)
    }
  }, [existingClient, prefilled])

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const allFields = [
    'gender', 'first_name', 'last_name', 'dateOfBirth', 'national_id',
    'idIssueDate', 'relationship', 'phone_number', 'email', 'cityOfResidence',
    'address', 'apartmentNumber', 'zipCode', 'employment', 'employer',
    'companyId', 'occupation',
  ] as const
  const filledCount = allFields.filter((k) => form[k] !== '').length
  const uploadCount = [idFrontUrl, idBackUrl, idAppendixUrl].filter(Boolean).length
  const progress = Math.round(((filledCount + uploadCount) / (allFields.length + 3)) * 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name) {
      toast.error('יש למלא שם פרטי ושם משפחה')
      return
    }
    try {
      const result = await executeFunction({
        token,
        formData: form as any,
        idFrontUrl: idFrontUrl || undefined,
        idBackUrl: idBackUrl || undefined,
        idAppendixUrl: idAppendixUrl || undefined,
      })
      if (result?.success) {
        setSubmitted(true)
      } else {
        toast.error(result?.error || 'שגיאה בשליחת הטופס')
      }
    } catch {
      toast.error('שגיאה בשליחת הטופס')
    }
  }

  if (tokensLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    )
  }

  if (!token || !tokenRecord) {
    return <IntakeFormError message="הקישור אינו תקין" />
  }

  if (tokenRecord.status === 'expired' || (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) < new Date())) {
    return <IntakeFormError message="הקישור פג תוקף. אנא פנה לסוכן שלך" />
  }

  if (tokenRecord.status === 'submitted') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" style={{ direction: 'rtl' }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <FileCheck className="size-16 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">הטופס כבר הוגש בהצלחה. תודה!</h1>
        </div>
      </div>
    )
  }

  if (submitted) {
    return <IntakeFormSuccess name={form.first_name} />
  }

  return (
    <div className="min-h-screen bg-muted pb-24" style={{ direction: 'rtl' }}>
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-lg font-bold text-foreground mb-2">טופס קליטת לקוח</h1>
          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{progress}%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl flex flex-col gap-6 p-4 pt-6">
        {/* Section 1 - Personal Details */}
        <IntakeFormSection title="פרטים אישיים" icon={User}>
          <FieldGroup>
            <Field>
              <FieldLabel>מין</FieldLabel>
              <RadioGroup
                value={form.gender}
                onValueChange={(v) => updateField('gender', v as ClientsEntityGenderEnum)}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="זכר" id="male" />
                  <Label htmlFor="male">זכר</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="נקבה" id="female" />
                  <Label htmlFor="female">נקבה</Label>
                </div>
              </RadioGroup>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="first_name">שם פרטי *</FieldLabel>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="last_name">שם משפחה *</FieldLabel>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="dateOfBirth">תאריך לידה</FieldLabel>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="national_id">מספר ת.ז</FieldLabel>
                <Input
                  id="national_id"
                  value={form.national_id}
                  onChange={(e) => updateField('national_id', e.target.value)}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="idIssueDate">תאריך הנפקת ת.ז</FieldLabel>
              <Input
                id="idIssueDate"
                type="date"
                value={form.idIssueDate}
                onChange={(e) => updateField('idIssueDate', e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="relationship">מצב משפחתי</FieldLabel>
              <Select
                value={form.relationship}
                onValueChange={(v) => updateField('relationship', v as ClientsEntityRelationshipEnum)}
              >
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="בחר" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="phone_number">טלפון נייד</FieldLabel>
                <Input
                  id="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => updateField('phone_number', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">דוא"ל</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="cityOfResidence">עיר מגורים</FieldLabel>
                <Input
                  id="cityOfResidence"
                  value={form.cityOfResidence}
                  onChange={(e) => updateField('cityOfResidence', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="address">כתובת</FieldLabel>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="apartmentNumber">מספר דירה</FieldLabel>
                <Input
                  id="apartmentNumber"
                  value={form.apartmentNumber}
                  onChange={(e) => updateField('apartmentNumber', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="zipCode">מיקוד</FieldLabel>
                <Input
                  id="zipCode"
                  value={form.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
        </IntakeFormSection>

        {/* Section 2 - Employment */}
        <IntakeFormSection title="מקום עבודה" icon={Briefcase}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="employment">מעמד</FieldLabel>
              <Select
                value={form.employment}
                onValueChange={(v) => updateField('employment', v as ClientsEntityEmploymentEnum)}
              >
                <SelectTrigger id="employment">
                  <SelectValue placeholder="בחר" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="employer">שם מעסיק</FieldLabel>
                <Input
                  id="employer"
                  value={form.employer}
                  onChange={(e) => updateField('employer', e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="companyId">ח.פ מעסיק</FieldLabel>
                <Input
                  id="companyId"
                  value={form.companyId}
                  onChange={(e) => updateField('companyId', e.target.value)}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="occupation">תפקיד</FieldLabel>
              <Input
                id="occupation"
                value={form.occupation}
                onChange={(e) => updateField('occupation', e.target.value)}
              />
            </Field>
          </FieldGroup>
        </IntakeFormSection>

        {/* Section 3 - ID Upload */}
        <IntakeFormSection title="צילום תעודת זהות" icon={CreditCard}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <IntakeFormUpload label="ת.ז קדמי" value={idFrontUrl} onChange={setIdFrontUrl} />
            <IntakeFormUpload label="ת.ז אחורי" value={idBackUrl} onChange={setIdBackUrl} />
            <IntakeFormUpload label="ספח" value={idAppendixUrl} onChange={setIdAppendixUrl} />
          </div>
        </IntakeFormSection>

        {/* Section 4 - Declarations */}
        <IntakeFormSection title="הצהרות" icon={FileCheck}>
          <FieldGroup>
            <div className="flex items-center gap-3">
              <Checkbox
                id="american"
                checked={form.american}
                onCheckedChange={(v) => updateField('american', v === true)}
              />
              <Label htmlFor="american">אזרח אמריקאי</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="smoker"
                checked={form.smoker}
                onCheckedChange={(v) => updateField('smoker', v === true)}
              />
              <Label htmlFor="smoker">מעשן</Label>
            </div>
          </FieldGroup>
        </IntakeFormSection>

        {/* Submit - sticky on mobile */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 sm:static sm:border-0 sm:bg-transparent sm:p-0">
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                שולח...
              </>
            ) : (
              'שלח טופס'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}