import { useState } from 'react';
import {
  useUser,
  useEntityGetAll,
  useExecuteAction,
} from '@blocksdiy/blocks-client-sdk/reactSdk';
import {
  ClientsEntity,
  SendClientIntakeFormAction,
} from '@/product-types';
import { Send, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { ClientSelectorCombobox } from '@/components/ClientSelectorCombobox';
import { SentFormsHistory } from '@/components/SentFormsHistory';

export default function ClientFormSender() {
  const user = useUser();
  const { data: clients, isLoading: clientsLoading } = useEntityGetAll(ClientsEntity);
  const { executeFunction, isLoading: sending } = useExecuteAction(SendClientIntakeFormAction);

  const [tab, setTab] = useState('existing');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    formUrl?: string;
    message?: string;
  } | null>(null);

  const selectedClient = selectedClientId
    ? clients?.find((c) => c.id === selectedClientId)
    : null;

  const handleSelectClient = (id: string | null) => {
    setSelectedClientId(id);
    if (id) {
      const client = clients?.find((c) => c.id === id);
      if (client) {
        setRecipientName(client.fullName ?? `${client.first_name ?? ''} ${client.last_name ?? ''}`.trim());
        setPhone(client.phone_number ?? '');
        setEmail(client.email ?? '');
      }
    } else {
      setRecipientName('');
      setPhone('');
      setEmail('');
    }
    setSuccessResult(null);
  };

  const handleSend = async () => {
    if (!recipientName || !phone || !email) {
      toast.error('יש למלא את כל השדות');
      return;
    }

    try {
      const result = await executeFunction({
        clientId: tab === 'existing' ? (selectedClientId ?? undefined) : undefined,
        recipientPhone: phone,
        recipientEmail: email,
        recipientName,
        agentEmail: user.email,
      });

      if (result?.success) {
        setSuccessResult({ formUrl: result.formUrl, message: result.message });
        toast.success('הטופס נשלח בהצלחה');
      } else {
        toast.error(result?.message ?? 'שגיאה בשליחת הטופס');
      }
    } catch {
      toast.error('שגיאה בשליחת הטופס');
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    if (tab === 'new') {
      setRecipientName('');
      setPhone('');
      setEmail('');
    }
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formFields = (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="recipientName">שם הנמען</FieldLabel>
        <Input
          id="recipientName"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="שם מלא"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="phone">טלפון</FieldLabel>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+972501234567"
          dir="ltr"
          required
        />
        <p className="text-xs text-muted-foreground">פורמט E.164, לדוגמה: +972501234567</p>
      </Field>
      <Field>
        <FieldLabel htmlFor="email">אימייל</FieldLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          dir="ltr"
          required
        />
      </Field>
    </FieldGroup>
  );

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Send className="text-primary" />
            <CardTitle>שליחת טופס ללקוח</CardTitle>
          </div>
          <CardDescription>שלח טופס קליטת לקוח חדש באמצעות SMS ואימייל</CardDescription>
        </CardHeader>
        <CardContent>
          {successResult ? (
            <div className="flex flex-col gap-4">
              <Alert>
                <AlertDescription>
                  <p className="font-medium mb-2">הטופס נשלח בהצלחה!</p>
                  {successResult.formUrl && (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={successResult.formUrl}
                        readOnly
                        dir="ltr"
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(successResult.formUrl!)}
                      >
                        {copied ? (
                          <Check data-icon="inline-start" />
                        ) : (
                          <Copy data-icon="inline-start" />
                        )}
                        {copied ? 'הועתק' : 'העתק'}
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
              <Button variant="outline" onClick={handleReset}>
                שלח שוב
              </Button>
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => { setTab(v); setSuccessResult(null); setSelectedClientId(null); setRecipientName(''); setPhone(''); setEmail(''); }}>
              <TabsList className="w-full">
                <TabsTrigger value="existing" className="flex-1">לקוח קיים</TabsTrigger>
                <TabsTrigger value="new" className="flex-1">לקוח חדש</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="flex flex-col gap-4 mt-4">
                <ClientSelectorCombobox
                  clients={(clients ?? []).map((c) => ({ ...c, id: c.id }))}
                  isLoading={clientsLoading}
                  selectedClientId={selectedClientId ?? ''}
                  onSelectClient={handleSelectClient}
                />
                {selectedClientId && formFields}
                {selectedClientId && (
                  <Button
                    size="lg"
                    onClick={handleSend}
                    disabled={sending || !recipientName || !phone || !email}
                  >
                    {sending ? (
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                    ) : (
                      <Send data-icon="inline-start" />
                    )}
                    {sending ? 'שולח...' : 'שלח טופס'}
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="new" className="flex flex-col gap-4 mt-4">
                {formFields}
                <Button
                  size="lg"
                  onClick={handleSend}
                  disabled={sending || !recipientName || !phone || !email}
                >
                  {sending ? (
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : (
                    <Send data-icon="inline-start" />
                  )}
                  {sending ? 'שולח...' : 'שלח טופס'}
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <SentFormsHistory />
    </div>
  );
}