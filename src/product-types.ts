/**
 * Stores agency-level information such as agency name, used as a data source in field mapping for insurance form templates.
 */
export interface IAgencyEntity {
  /** The name of the insurance agency  */
  agencyName?: string;
}

export const AgencyEntity = {
  tableBlockId: "69e09b0d445c8ed93712b6aa",
  instanceType: {} as IAgencyEntity,
} as const;

/**
 * Stores insurance agent information including agent names and identification numbers for insurance form processing
 */
export interface IAgentsEntity {
  /** Computed full name of the agent combining first name and last name (שם מלא של הסוכן)  */
  fullName?: string;
  /** The national ID (תעודת זהות) of the insurance agent  */
  nationalId?: string;
  /** The agent's phone number for SMS notifications (E.164 format, e.g. +972501234567)  */
  phone?: string;
  /** The first name (שם פרטי) of the insurance agent  */
  firstName?: string;
  /** The agent's email address for communication and notifications  */
  email?: string;
  /** The last name (שם משפחה) of the insurance agent  */
  lastName?: string;
  /** The unique identification number assigned to the insurance agent  */
  agentNumber?: string;
}

export const AgentsEntity = {
  tableBlockId: "69db99a77d23f0bc9a294de6",
  instanceType: {} as IAgentsEntity,
} as const;

export type ClientsEntityClientStatusEnum = "פעיל" | "טרום יעוץ";

export type ClientsEntityEmploymentEnum =
  | "שכיר"
  | "עצמאי"
  | "סטודנט"
  | "חבר קיבוץ"
  | "אברך"
  | "חייל בשירות חובה"
  | "משרתת בשירות לאומי"
  | "לא עובד/מובטל"
  | "גמלאי"
  | "שכיר בעל שליטה";

export type ClientsEntityRelationshipEnum = "רווק" | "נשוי" | "גרוש" | "אלמן";

export type ClientsEntityGenderEnum = "זכר" | "נקבה";

/**
 * Stores client personal details including national identification number, contact information for insurance form processing
 */
export interface IClientsEntity {
  /** Client's date of birth. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  dateOfBirth?: string;
  /** Client's street address  */
  address?: string;
  /** Computed age of the client in years, calculated from the dateOfBirth field  */
  age?: number;
  /** First name of the second parent or guardian of the client  */
  parent2FirstName?: string;
  /** The issue date of the client's national ID card (תאריך הנפקה). ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  idIssueDate?: string;
  /** Client's current status in the system  */
  clientStatus?: ClientsEntityClientStatusEnum;
  /** Date of birth of the client's first parent, stored in YYYY-MM-DD format. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  parent1DateOfBirth?: string;
  /** Date of birth of the client's second parent, stored in YYYY-MM-DD format. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  parent2DateOfBirth?: string;
  /** Client's country in English (מדינה אנגלית)  */
  englishCountry?: string;
  /** Client's phone number for contact  */
  phone_number?: string;
  /** Client's home/building number (מספר בית) - the number of the building or house at the client's address  */
  homeNumber?: string;
  /** Client's city of residence in English (עיר אנגלית)  */
  englishCity?: string;
  /** Client's apartment number (מספר דירה) within their building  */
  apartmentNumber?: string;
  /** Client's national identification number, 9 characters  */
  national_id?: string;
  /** Client's last name in English (שם משפחה אנגלית)  */
  englishLastName?: string;
  /** National ID number of the second parent or guardian of the client  */
  parent2Id?: string;
  /** Client's occupation or job title  */
  occupation?: string;
  /** City where the client resides  */
  cityOfResidence?: string;
  /** Last name of the first parent or guardian of the client  */
  parent1LastName?: string;
  /** Whether the client is a smoker (מעשן). Used for insurance risk assessment purposes.  */
  smoker?: boolean;
  /** Client's employment type - whether they are self-employed or an employee  */
  employment?: ClientsEntityEmploymentEnum;
  /** שם רחוב בלבד - Computed street name extracted from the address field, removing any numeric characters and trimming whitespace  */
  streetName?: string;
  /** URL link to a file containing pictures of the client's ID documentation. Accepts any file type (jpg, pdf, doc, etc.). Uploaded by the agent when editing the client's profile.  */
  idDocumentationUrl?: string;
  /** Client's email address for communication  */
  email?: string;
  /** Client's marital/relationship status  */
  relationship?: ClientsEntityRelationshipEnum;
  /** Client's street address in English (רחוב באנגלית)  */
  englishStreet?: string;
  /** Full name of the second parent or guardian of the client  */
  parent2Name?: string;
  /** מספר בית בלבד - Computed street number extracted from the address field, keeping only numeric characters  */
  streetNumber?: string;
  /** Client's US Tax Identification Number (מספר TIN) - required for American tax residents  */
  tinNumber?: string;
  /** Client's first name  */
  first_name?: string;
  /** Client's gender  */
  gender?: ClientsEntityGenderEnum;
  /** Last name of the second parent or guardian of the client  */
  parent2LastName?: string;
  /** Client's country of birth (ארץ לידה)  */
  birthCountry?: string;
  /** Computed full address combining city of residence, street address, and apartment number  */
  fullAddress?: string;
  /** Client's first name in English (שם פרטי אנגלית)  */
  englishFirstName?: string;
  /** General notes about the client  */
  notes?: string;
  /** Client's last name  */
  last_name?: string;
  /** Client's postal/zip code  */
  zipCode?: string;
  /** List of email addresses of office users assigned to this client. Each entry is an email string referencing a user with the 'office' role.  */
  assignedOfficeEmails?: string[];
  /** Client's city of birth (עיר לידה)  */
  birthCity?: string;
  /** Whether the client is a US resident for tax purposes (תושב ארצות הברית לצורכי מס)  */
  americanForTax?: boolean;
  /** National ID number of the first parent or guardian of the client  */
  parent1Id?: string;
  /** Whether the client was born in the USA (יליד ארה״ב)  */
  bornInUSA?: boolean;
  /** Whether the client is an American citizen or holds US citizenship/residency status  */
  american?: boolean;
  /** First name of the first parent or guardian of the client  */
  parent1FirstName?: string;
  /** Client's employer name  */
  employer?: string;
  /** Full name of the first parent or guardian of the client  */
  parent1Name?: string;
  /** Client's employer company registration ID number  */
  companyId?: string;
  /** Computed full name combining the client's first name and last name  */
  fullName?: string;
}

export const ClientsEntity = {
  tableBlockId: "69db99a77d23f0bc9a294dce",
  instanceType: {} as IClientsEntity,
} as const;

export type FormsEntityFormStatusEnum =
  | "לפני מיפוי"
  | "חסרות אפשרויות מיפוי"
  | "לפני בדיקה"
  | "צריך לערוך קופסאות"
  | "מוכן (ללא מקרי קצה)"
  | "טיוטא ישנה"
  | "מוכן (100%)";

/**
 * JSON object with key-value pairs where key is the document field name and value is the mapping rule
 */
export interface IFormsEntityFieldMappingObject {}

/**
 * undefined
 */
export interface IFormsEntityFormsEntityFieldsItemObject {
  /** Unique field identifier  */
  id: string;
  /** Field type: signature, date, text, checkbox, initials  */
  type: string;
  /** Signer role: Agent or Client  */
  role: string;
  /** X coordinate as ratio (0-1) of page width  */
  x: number;
  /** Y coordinate as ratio (0-1) of page height  */
  y: number;
  /** Width as ratio (0-1) of page width  */
  w: number;
  /** Height as ratio (0-1) of page height  */
  h: number;
  /** Page number (1-indexed, compatible with DocuSeal API)  */
  page: number;
}

/**
 * Array of signature field definitions placed on the PDF via drag & drop. Each field has: type (signature|date|text|checkbox|initials), x (pixels from left), y (pixels from top), page (1-indexed), width, height. Saved once per form template and reused for every signature request.
 */
export interface IFormsEntitySignatureFieldsObject {
  /** List of signature fields placed on the PDF with DocuSeal-compatible ratio-based coordinates  */
  fields: IFormsEntityFormsEntityFieldsItemObject[];
}

/**
 * Stores the uploaded file information including file name, size, type, and URL for the insurance form PDF
 */
export interface IFormsEntityFileDataObject {
  /** The original file name  */
  name: string;
  /** File size in bytes  */
  size?: number;
  /** MIME type of the file  */
  type?: string;
  /** The URL where the file is stored  */
  url: string;
}

/**
 * Stores insurance form templates including PDF files with dynamic fields, field mappings, associated providers and request types for automated form processing
 */
export interface IFormsEntity {
  /** Current status of the form template indicating its readiness or lifecycle stage  */
  formStatus?: FormsEntityFormStatusEnum;
  /** List of Provider IDs from the Providers table  */
  providers?: string[];
  /** JSON object with key-value pairs where key is the document field name and value is the mapping rule  */
  fieldMapping?: IFormsEntityFieldMappingObject;
  /** Form title in English  */
  formTitle?: string;
  /** URL of an image attached to the form template, used for visual reference or supplementary documentation alongside the PDF  */
  imageAttachment?: string;
  /** Number of pages in the form  */
  pages?: number;
  /** Unique form identifier number  */
  formNumber?: string;
  /** Free-text notes or comments about the form template, for internal use by agents and admins  */
  notes?: string;
  /** Optional purpose description for the form, can be null  */
  purpose?: string;
  /** Array of signature field definitions placed on the PDF via drag & drop. Each field has: type (signature|date|text|checkbox|initials), x (pixels from left), y (pixels from top), page (1-indexed), width, height. Saved once per form template and reused for every signature request.  */
  signatureFields?: IFormsEntitySignatureFieldsObject;
  /** List of request type IDs from the RequestSchemes table  */
  requests?: string[];
  /** Stores the uploaded file information including file name, size, type, and URL for the insurance form PDF  */
  fileData?: IFormsEntityFileDataObject;
  /** Form title in Hebrew  */
  formTitleHebrew?: string;
}

export const FormsEntity = {
  tableBlockId: "69db99a87d23f0bc9a294e5f",
  instanceType: {} as IFormsEntity,
} as const;

export type FundsEntityStatusEnum = "פעיל" | "לא פעיל";

export type FundsEntityPlanStatusEnum = "שכיר" | "עצמאי" | "פרט";

/**
 * Stores comprehensive insurance fund information including policy details, financial balances, contribution tracking, and agent/provider relationships for insurance portfolio management
 */
export interface IFundsEntity {
  /** Total contributions made by the employee  */
  employeeContributions?: number;
  /** The amount of the most recent deposit  */
  lastDepositAmount?: number;
  /** The date when the policy was initiated. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  joinDate?: string;
  /** Current status of the fund policy  */
  status?: FundsEntityStatusEnum;
  /** Severance pay amount allocated in the fund  */
  severance?: number;
  /** Name of the employer associated with this fund  */
  employer?: string;
  /** Reference to the client who owns this fund from the Clients table  */
  clientId?: string;
  /** The total accumulated balance in the fund  */
  totalBalance?: number;
  /** Agent number (מספר סוכן) as imported from Excel - stored as string to support formats like '2-5000'  */
  agentNumber?: string;
  /** The unique policy identification number  */
  policyNumber?: string;
  /** The type of insurance product (e.g., pension, life insurance, provident fund)  */
  productType?: string;
  /** Management fee percentage charged on deposits  */
  managementFeeDeposits?: number;
  /** Management fee percentage charged on accumulated balance  */
  managementFeeAccumulation?: number;
  /** The name of the insurance plan or fund  */
  planName?: string;
  /** The salary amount reported for contribution calculations  */
  reportedSalary?: number;
  /** Employment status related to the plan  */
  planStatus?: FundsEntityPlanStatusEnum;
  /** The date until which the fund data is considered valid and current. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  dataValidityDate?: string;
  /** Total contributions made by the employer  */
  employerContributions?: number;
  /** Name of the insurance provider/manufacturer (שם יצרן) as imported from Excel  */
  providerName?: string;
  /** The date of the most recent deposit to the fund. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  lastDepositDate?: string;
}

export const FundsEntity = {
  tableBlockId: "69db99a77d23f0bc9a294dec",
  instanceType: {} as IFundsEntity,
} as const;

/**
 * Stores investment track records that can be associated with insurance funds, including track name, type, risk level, and other relevant investment track details.
 */
export interface IInvestmentTracksEntity {
  /** שם יצרן - The name of the insurance provider/manufacturer (e.g., הראל, מיטב, כלל)  */
  providerName?: string;
  /** תשואה ממוצעת 3 שנים - Average annual return over the last 3 years  */
  return3Years?: number;
  /** סוג מוצר - The type of insurance product (e.g., חיים משולב חסכון, קרן פנסיה, קרן השתלמות)  */
  productType?: string;
  /** תשואה תחילת שנה - Year-to-date return rate since the beginning of the year  */
  ytdReturn?: number;
  /** מספר פוליסה - The policy number associated with this investment track  */
  policyNumber?: string;
  /** מספר מ.ה - The internal track ID number used by the provider  */
  trackIdNumber?: string;
  /** סכום צבירה במסלול - The accumulation amount specifically within this investment track  */
  trackAccumulationAmount?: number;
  /** סך צבירה בפוליסה - Total accumulation amount across the entire policy  */
  totalPolicyAccumulation?: number;
  /** תשואה מצטברת 12 חודשים - Cumulative return over the last 12 months  */
  return12Months?: number;
  /** The name of the investment track  */
  trackName?: string;
  /** תשואה חודשית - Monthly return rate of the investment track (as a decimal, e.g., 0.0138 = 1.38%)  */
  monthlyReturn?: number;
  /** חשיפה לחו״ל - The percentage exposure to foreign markets (as a decimal)  */
  foreignExposure?: number;
  /** תאריך נכונות - The date until which the data in this record is valid. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  dataValidityDate?: string;
  /** חשיפה למניות - The percentage exposure to equities/stocks (as a decimal, e.g., 0.528 = 52.8%)  */
  equityExposure?: number;
  /** תשואה ממוצעת 5 שנים - Average annual return over the last 5 years  */
  return5Years?: number;
  /** שם מעסיק משלם - The name of the employer making contributions to this track  */
  payingEmployerName?: string;
  /** חשיפה למט״ח - The percentage exposure to foreign currency (as a decimal)  */
  foreignCurrencyExposure?: number;
}

export const InvestmentTracksEntity = {
  tableBlockId: "69db99ab7d23f0bc9a295052",
  instanceType: {} as IInvestmentTracksEntity,
} as const;

export type MeetingsEntityStatusEnum =
  | "מעבד"
  | "מוכן לשליחה ללקוח"
  | "נשלח ללקוח"
  | "מוכן לשליחה לסוכן"
  | "נשלח לסוכן"
  | "מוכן לשליחה ליצרן"
  | "נשלח ליצרן"
  | "הושלם"
  | "נדחה";

/**
 * Stores meeting records including agent, client, date, associated requests, and status for coordinating insurance consultations and request reviews
 */
export interface IMeetingsEntity {
  /** Array of request IDs associated with this meeting  */
  requests?: string[];
  /** The client attending the meeting  */
  clientId?: string;
  /** Optional notes or comments about the meeting, such as discussion points, outcomes, or follow-up items  */
  notes?: string;
  /** The insurance agent conducting the meeting  */
  agentId?: string;
  /** Current status of the meeting  */
  status?: MeetingsEntityStatusEnum;
  /** The scheduled date and time of the meeting. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  date?: string;
}

export const MeetingsEntity = {
  tableBlockId: "69db99a97d23f0bc9a294f70",
  instanceType: {} as IMeetingsEntity,
} as const;

/**
 * Lookup table that stores the email address to use when sending documents to a provider for a specific request type. Each row represents a unique combination of provider and request type with the corresponding recipient email.
 */
export interface IProviderEmailsEntity {
  /** Optional notes or description about this email mapping (e.g. department name, contact person)  */
  notes?: string;
  /** Reference to the request type (RequestSchemes table ID) this email mapping applies to  */
  requestTypeId?: string;
  /** The recipient email address to use when sending documents to the provider for this specific request type  */
  email?: string;
  /** Reference to the provider (Providers table ID) this email mapping applies to  */
  providerId?: string;
}

export const ProviderEmailsEntity = {
  tableBlockId: "69db99b27d23f0bc9a2954b7",
  instanceType: {} as IProviderEmailsEntity,
} as const;

/**
 * Stores healthcare provider information including provider names for insurance form processing
 */
export interface IProvidersEntity {
  /** The name of the healthcare provider or medical facility  */
  provider_name?: string;
  /** Computed column combining the institutional name and provider ID code, displayed as 'שם מוסדי וח.פ' in Hebrew. Used for display in forms and selectors.  */
  institutionalNameAndCode?: string;
  /** The official provider identification code or ID number used to identify the provider in external systems and insurance forms  */
  providerIdCode?: string;
  /** The institutional/official name of the provider, used for formal documents and insurance form processing  */
  institutionalName?: string;
}

export const ProvidersEntity = {
  tableBlockId: "69db99a77d23f0bc9a294de0",
  instanceType: {} as IProvidersEntity,
} as const;

export type RequestsEntityKerenNameEnum = "" | "כללי" | "אומגה";

export type RequestsEntityStatusEnum =
  | "מעבד"
  | "מוכן לשליחה ללקוח"
  | "נשלח ללקוח"
  | "מוכן לשליחה לסוכן"
  | "נשלח לסוכן"
  | "מוכן לשליחה ליצרן"
  | "נשלח ליצרן"
  | "הושלם"
  | "נדחה";

/**
 * undefined
 */
export interface IRequestsEntityRequestsEntityFormsItemObject {
  /** Reference to the form template used  */
  formId?: string;
  /** URL link to the processed/filled form PDF  */
  url: string;
  /** ISO timestamp when the form was processed  */
  processedAt?: string;
}

export type RequestsEntityTransferTypeEnum =
  | ""
  | "צבירה והפקדות"
  | "צבירה בלבד"
  | "הפקדות בלבד";

/**
 * Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request
 */
export interface IRequestsEntityTracksObject {}

export type RequestsEntityChoiceDurationEnum = "" | "6" | "12" | "24";

/**
 * Stores insurance request records including request type, associated agent, client, provider, processing status, scheme changes, and links to processed forms for tracking request lifecycle
 */
export interface IRequestsEntity {
  /** Indicates whether the transfer amount is the full/total amount. True means transfer all funds, false or null means partial or unspecified transfer amount.  */
  isTotalTransfer?: boolean;
  /** The name of the keren (fund) associated with this request. Optional enum field with values: כללי (Klali) or אומגה (Omega). Empty string means no keren selected.  */
  kerenName?: RequestsEntityKerenNameEnum;
  /** Current processing status of the request  */
  status?: RequestsEntityStatusEnum;
  /** The transfer amount (יתרת העברה) for the insurance request, stored as a string to support formatted values  */
  transferAmount?: string;
  /** Array of processed form documents with their URL links  */
  forms?: IRequestsEntityRequestsEntityFormsItemObject[];
  /** Reference to the client submitting this request from Clients table  */
  clientId?: string;
  /** Reference to the healthcare provider associated with this request from Providers table  */
  providerId?: string;
  /** סוג העברה - the type of transfer for this insurance request: accumulation and deposits, accumulation only, or deposits only  */
  transferType?: RequestsEntityTransferTypeEnum;
  /** Reference to the insurance agent handling this request from Agents table  */
  agentId?: string;
  /** True when the request was created directly from the client profile page (standalone request), false or null when created as part of a meeting wizard flow.  */
  isStandalone?: boolean;
  /** Reference to the request scheme type from RequestSchemes table  */
  requestTypeId?: string;
  /** Management fee (דמי ניהול) associated with this insurance request, representing the fee percentage or amount charged for managing the fund  */
  managementFee?: number;
  /** Reference to a specific insurance fund from the Funds table associated with this request  */
  fundId?: string;
  /** Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request  */
  tracks?: IRequestsEntityTracksObject;
  /** תקופת בחירה בחודשים - the duration of the choice period in months for this insurance request  */
  choiceDuration?: RequestsEntityChoiceDurationEnum;
}

export const RequestsEntity = {
  tableBlockId: "69db99a87d23f0bc9a294e7b",
  instanceType: {} as IRequestsEntity,
} as const;

/**
 * Flexible JSON structure to store various types of tracks (מסלולים) for the request scheme
 */
export interface IRequestSchemesEntityTracksObject {}

/**
 * Stores different types of insurance request schemes and their associated changes in JSON format for tracking scheme modifications
 */
export interface IRequestSchemesEntity {
  /** Flexible JSON structure to store various types of tracks (מסלולים) for the request scheme  */
  tracks?: IRequestSchemesEntityTracksObject;
  /** The name of the request scheme type  */
  requestTypeName?: string;
}

export const RequestSchemesEntity = {
  tableBlockId: "69db99a87d23f0bc9a294e59",
  instanceType: {} as IRequestSchemesEntity,
} as const;

export type SignatureRequestsEntityStatusEnum =
  | "pending"
  | "client_signed"
  | "agent_signed"
  | "completed"
  | "declined"
  | "expired";

/**
 * undefined
 */
export interface ISignatureRequestsEntitySignatureRequestsEntityItemsItemObject {
  /** The form template ID from the Forms table  */
  formId: string;
  /** The request ID from the Requests table this form belongs to  */
  requestId: string;
  /** 0-based index of this form in the merged DocuSeal submission documents array  */
  formIndex: number;
}

/**
 * Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.
 */
export interface ISignatureRequestsEntityFormMappingObject {
  /** Array of form mapping entries  */
  items?: ISignatureRequestsEntitySignatureRequestsEntityItemsItemObject[];
}

/**
 * Tracks each signature request sent to a client for a specific form within a request. Stores the Dropbox Sign signature_request_id, current status, the signed PDF URL once completed, and references to the originating request and form. Also stores the signature field position (x, y, page, width, height) used when sending.
 */
export interface ISignatureRequestsEntity {
  /** The URL of the filled PDF that was sent for signature  */
  formPdfUrl?: string;
  /** The Docuseal submitter ID for the agent signer (integer).  */
  agentSubmitterId?: number;
  /** The embed source URL for the agent to sign the document via Docuseal.  */
  agentEmbedSrc?: string;
  /** The Docuseal merged template ID used for this signature request (integer).  */
  docusealMergedTemplateId?: number;
  /** Timestamp when the signature request was sent to the client. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  sentAt?: string;
  /** Title of the form that was sent for signature, stored for display purposes  */
  formTitle?: string;
  /** Timestamp when the client signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  clientSignedAt?: string;
  /** Current status of the signature request: pending (awaiting signature), signed (completed), declined (signer declined), cancelled  */
  status?: SignatureRequestsEntityStatusEnum;
  /** Timestamp when the signature request was fully completed (all parties signed). Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  completedAt?: string;
  /** The embed source URL for the client to sign the document via Docuseal.  */
  clientEmbedSrc?: string;
  /** Timestamp when the agent signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  agentSignedAt?: string;
  /** Reference to the Clients table record — the signer  */
  clientId?: string;
  /** Reference to the Requests table record this signature request belongs to  */
  requestId?: string;
  /** Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.  */
  formMapping?: ISignatureRequestsEntityFormMappingObject;
  /** The Docuseal submission ID for this signature request (integer).  */
  docusealSubmissionId?: number;
  /** Reference to the Meetings table record this signature request is associated with. Nullable.  */
  meetingId?: string;
  /** The Docuseal submitter ID for the client signer (integer).  */
  clientSubmitterId?: number;
  /** Reference to the Forms table record (form template) that was sent for signature  */
  formId?: string;
}

export const SignatureRequestsEntity = {
  tableBlockId: "69db99ad7d23f0bc9a295146",
  instanceType: {} as ISignatureRequestsEntity,
} as const;

/**
 * Stores completed signed document records, linking each signed document to its originating signature request, insurance request, meeting, and client. Tracks the document name, URL, DocuSeal submission ID, and timestamps for when the document was signed and created.
 */
export interface ISignedDocumentsEntity {
  /** The timestamp when the document was fully signed by all required parties. Nullable — null if not yet signed.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  signedAt?: string;
  /** Foreign key reference to the Meetings table — the meeting during which this document was signed, if applicable  */
  meetingId?: string;
  /** Foreign key reference to the Forms table — the specific form template that was signed in this document. Used to link each signed document back to its original form template.  */
  formId?: string;
  /** Foreign key reference to the Clients table — the client who signed this document  */
  clientId?: string;
  /** The URL where the signed document PDF can be accessed or downloaded  */
  documentUrl?: string;
  /** The name or title of the signed document  */
  documentName?: string;
  /** Foreign key reference to the Requests table — the insurance request associated with this signed document  */
  requestId?: string;
  /** Foreign key reference to the Signature Requests table — the signature request that produced this signed document  */
  signatureRequestId?: string;
  /** The DocuSeal submission ID associated with this signed document, used to reference the submission in DocuSeal's system  */
  docusealSubmissionId?: number;
}

export const SignedDocumentsEntity = {
  tableBlockId: "69db99af7d23f0bc9a29526c",
  instanceType: {} as ISignedDocumentsEntity,
} as const;

/**
 * undefined
 */
export interface IUsersEntity {
  /** User name  */
  name?: string;
  /** First name  */
  firstName?: string;
  /** Last name  */
  lastName?: string;
  /** Email address  */
  email?: string;
  /** Profile image URL  */
  profileImageUrl?: string;
}

export const UsersEntity = {
  tableBlockId: "68760b42d4ce152c91ce0e1c",
  instanceType: {} as IUsersEntity,
} as const;

export const AgentDashboard2Page = {
  pageBlockId: "69db99b27d23f0bc9a295478",
  pageName: "AgentDashboard2",
} as const;

export const AgentProfilePage = {
  pageBlockId: "69db99b37d23f0bc9a295509",
  pageName: "AgentProfile",
} as const;

export const AgentsManagerPage = {
  pageBlockId: "69db99a87d23f0bc9a294eb1",
  pageName: "AgentsManager",
} as const;

export const ClientProfilePage = {
  pageBlockId: "69db99a87d23f0bc9a294e9f",
  pageName: "ClientProfile",
} as const;

export const ClientsManagerPage = {
  pageBlockId: "69db99a87d23f0bc9a294e9c",
  pageName: "ClientsManager",
} as const;

export const FormDetailsPage = {
  pageBlockId: "69db99aa7d23f0bc9a294f85",
  pageName: "FormDetails",
} as const;

export const FormPreviewPage = {
  pageBlockId: "69db99aa7d23f0bc9a294f94",
  pageName: "FormPreview",
} as const;

export const FormsManagerPage = {
  pageBlockId: "69db99a87d23f0bc9a294ed2",
  pageName: "FormsManager",
} as const;

export const LoginPage = {
  pageBlockId: "69db99aa7d23f0bc9a294fb0",
  pageName: "Login",
} as const;

export const MeetingDetailsPage = {
  pageBlockId: "69db99b07d23f0bc9a29532d",
  pageName: "MeetingDetails",
} as const;

export const NewMeetingWizardPage = {
  pageBlockId: "69db99ac7d23f0bc9a2950a3",
  pageName: "NewMeetingWizard",
} as const;

export const NewRequestWizardPage = {
  pageBlockId: "69db99ab7d23f0bc9a295022",
  pageName: "NewRequestWizard",
} as const;

export const OfficeManagerPage = {
  pageBlockId: "69db99b37d23f0bc9a295564",
  pageName: "OfficeManager",
} as const;

export const ProviderEmailsManagerPage = {
  pageBlockId: "69db99b27d23f0bc9a2954c6",
  pageName: "ProviderEmailsManager",
} as const;

export const ProvidersManagerPage = {
  pageBlockId: "69db99a87d23f0bc9a294eae",
  pageName: "ProvidersManager",
} as const;

export const RequestsManagerPage = {
  pageBlockId: "69db99aa7d23f0bc9a294f91",
  pageName: "RequestsManager",
} as const;

export const RequestTypesManagerPage = {
  pageBlockId: "69db99a87d23f0bc9a294eb4",
  pageName: "RequestTypesManager",
} as const;

/**
 * AnalyzePdfFormFields input payload
 */
export interface IAnalyzePdfFormFieldsActionInput {
  /** The URL of the uploaded PDF form file  */
  pdfUrl: string;
}

export type AnalyzePdfFormFieldsActionOutputTypeEnum =
  | "text"
  | "checkbox"
  | "dropdown"
  | "optionList"
  | "radio"
  | "signature"
  | "date"
  | "unknown";

/**
 * undefined
 */
export interface IAnalyzePdfFormFieldsActionOutputAnalyzePdfFormFieldsActionOutputFieldsItemObject {
  /** The name/identifier of the form field  */
  name?: string;
  /** The type of the form field (text, checkbox, dropdown, optionList, radio, signature, date)  */
  type?: AnalyzePdfFormFieldsActionOutputTypeEnum;
  /** Whether the field is required  */
  required?: boolean;
  /** Current value of the field (if any)  */
  currentValue?: any;
  /** Available options for dropdown or radio fields  */
  options?: string[];
  /** Maximum length for text fields  */
  maxLength?: number;
  /** Whether the field is read-only  */
  readOnly?: boolean;
  /** Page index (0-based) where the field appears  */
  page?: number;
  /** X coordinate of the field on the page  */
  x?: number;
  /** Y coordinate of the field on the page  */
  y?: number;
  /** Width of the field  */
  width?: number;
  /** Height of the field  */
  height?: number;
}

/**
 * AnalyzePdfFormFields output payload
 */
export interface IAnalyzePdfFormFieldsActionOutput {
  /** List of form fields found in the PDF  */
  fields?: IAnalyzePdfFormFieldsActionOutputAnalyzePdfFormFieldsActionOutputFieldsItemObject[];
  /** Total number of form fields found  */
  totalFields?: number;
  /** Number of pages in the PDF  */
  pageCount?: number;
}

/**
 * AnalyzePdfFormFieldsAction
 * Analyzes an uploaded PDF form and extracts all fillable field names. Returns the field names so they can be displayed on screen for review before saving to the Forms table.
 */
export const AnalyzePdfFormFieldsAction = {
  actionBlockId: "69db99a87d23f0bc9a294ede",

  inputInstanceType: {} as IAnalyzePdfFormFieldsActionInput,
  outputInstanceType: {} as IAnalyzePdfFormFieldsActionOutput,
} as const;

/**
 * AutoProcessNewRequest input payload
 */
export interface IAutoProcessNewRequestActionInput {
  /** The ID of the newly created request to process  */
  requestId: string;
}

export type AutoProcessNewRequestActionOutputKerenNameEnum =
  | ""
  | "כללי"
  | "אומגה";

export type AutoProcessNewRequestActionOutputStatusEnum =
  | "מעבד"
  | "מוכן לשליחה ללקוח"
  | "נשלח ללקוח"
  | "מוכן לשליחה לסוכן"
  | "נשלח לסוכן"
  | "מוכן לשליחה ליצרן"
  | "נשלח ליצרן"
  | "הושלם"
  | "נדחה";

/**
 * undefined
 */
export interface IAutoProcessNewRequestActionOutputAutoProcessNewRequestActionOutputFormsItemObject {
  /** Reference to the form template used  */
  formId?: string;
  /** URL link to the processed/filled form PDF  */
  url: string;
  /** ISO timestamp when the form was processed  */
  processedAt?: string;
}

export type AutoProcessNewRequestActionOutputTransferTypeEnum =
  | ""
  | "צבירה והפקדות"
  | "צבירה בלבד"
  | "הפקדות בלבד";

/**
 * Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request
 */
export interface IAutoProcessNewRequestActionOutputTracksObject {}

export type AutoProcessNewRequestActionOutputChoiceDurationEnum =
  | ""
  | "6"
  | "12"
  | "24";

/**
 * The item updated in the table, keys are the column names, values are the column values
 */
export interface IAutoProcessNewRequestActionOutputAutoProcessNewRequestActionOutputItemsItemObject {
  /** The id of the item to update. Must be an existing id in the table.  */
  id?: string;
  /** Item created at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  createdAt?: string;
  /** Item updated at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  updatedAt?: string;
  /** Item created by user id  */
  createdBy?: string;
  /** Item updated by user id  */
  updatedBy?: string;
  /** Item updated by agent id  */
  updatedByAgentId?: string;
  /** Item tenant id  */
  tenantId?: string;
  /** Indicates whether the transfer amount is the full/total amount. True means transfer all funds, false or null means partial or unspecified transfer amount.  */
  isTotalTransfer?: boolean;
  /** The name of the keren (fund) associated with this request. Optional enum field with values: כללי (Klali) or אומגה (Omega). Empty string means no keren selected.  */
  kerenName?: AutoProcessNewRequestActionOutputKerenNameEnum;
  /** Current processing status of the request  */
  status?: AutoProcessNewRequestActionOutputStatusEnum;
  /** The transfer amount (יתרת העברה) for the insurance request, stored as a string to support formatted values  */
  transferAmount?: string;
  /** Array of processed form documents with their URL links  */
  forms?: IAutoProcessNewRequestActionOutputAutoProcessNewRequestActionOutputFormsItemObject[];
  /** Reference to the client submitting this request from Clients table  */
  clientId?: string;
  /** Reference to the healthcare provider associated with this request from Providers table  */
  providerId?: string;
  /** סוג העברה - the type of transfer for this insurance request: accumulation and deposits, accumulation only, or deposits only  */
  transferType?: AutoProcessNewRequestActionOutputTransferTypeEnum;
  /** Reference to the insurance agent handling this request from Agents table  */
  agentId?: string;
  /** True when the request was created directly from the client profile page (standalone request), false or null when created as part of a meeting wizard flow.  */
  isStandalone?: boolean;
  /** Reference to the request scheme type from RequestSchemes table  */
  requestTypeId?: string;
  /** Management fee (דמי ניהול) associated with this insurance request, representing the fee percentage or amount charged for managing the fund  */
  managementFee?: number;
  /** Reference to a specific insurance fund from the Funds table associated with this request  */
  fundId?: string;
  /** Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request  */
  tracks?: IAutoProcessNewRequestActionOutputTracksObject;
  /** תקופת בחירה בחודשים - the duration of the choice period in months for this insurance request  */
  choiceDuration?: AutoProcessNewRequestActionOutputChoiceDurationEnum;
}

/**
 * AutoProcessNewRequest output payload
 */
export interface IAutoProcessNewRequestActionOutput {
  /** The items updated in the table  */
  items: IAutoProcessNewRequestActionOutputAutoProcessNewRequestActionOutputItemsItemObject[];
}

/**
 * AutoProcessNewRequestAction
 * Automatically processes a new insurance request end-to-end. Triggered when a new request is created. Fetches the request, then in parallel builds the clientContext (via createClientContext) and finds all matching forms (by providerId and requestTypeId). Then loops through each matching form calling FillSingleFormWithMapping with the clientContext. Finally stores all filled PDF results in the request's forms column.
 */
export const AutoProcessNewRequestAction = {
  actionBlockId: "69db99aa7d23f0bc9a294f9a",

  inputInstanceType: {} as IAutoProcessNewRequestActionInput,
  outputInstanceType: {} as IAutoProcessNewRequestActionOutput,
} as const;

/**
 * The specific client data
 */
export interface IFillSingleFormWithMappingActionInputClientsObject {}

/**
 * The specific agent data
 */
export interface IFillSingleFormWithMappingActionInputAgentsObject {}

/**
 * The specific provider data
 */
export interface IFillSingleFormWithMappingActionInputProviderObject {}

/**
 * The specific fund data (single object, not array)
 */
export interface IFillSingleFormWithMappingActionInputFundsObject {}

/**
 * undefined
 */
export interface IFillSingleFormWithMappingActionInputTracksObject {}

/**
 * Request data containing managementFee and tracks
 */
export interface IFillSingleFormWithMappingActionInputRequestsObject {
  managementFee?: number;
  tracks?: IFillSingleFormWithMappingActionInputTracksObject;
}

/**
 * All data needed to fill the form. Structure: { clients: {client data}, agents: {agent data}, provider: {provider data}, funds: {single fund object}, requests: { managementFee: number, tracks: {track field values} } }
 */
export interface IFillSingleFormWithMappingActionInputClientContextObject {
  /** The specific client data  */
  clients?: IFillSingleFormWithMappingActionInputClientsObject;
  /** The specific agent data  */
  agents?: IFillSingleFormWithMappingActionInputAgentsObject;
  /** The specific provider data  */
  provider?: IFillSingleFormWithMappingActionInputProviderObject;
  /** The specific fund data (single object, not array)  */
  funds?: IFillSingleFormWithMappingActionInputFundsObject;
  /** Request data containing managementFee and tracks  */
  requests?: IFillSingleFormWithMappingActionInputRequestsObject;
}

/**
 * FillSingleFormWithMapping input payload
 */
export interface IFillSingleFormWithMappingActionInput {
  /** The ID of the form template to fill from the Forms table  */
  formId: string;
  /** All data needed to fill the form. Structure: { clients: {client data}, agents: {agent data}, provider: {provider data}, funds: {single fund object}, requests: { managementFee: number, tracks: {track field values} } }  */
  clientContext: IFillSingleFormWithMappingActionInputClientContextObject;
}

/**
 * FillSingleFormWithMapping output payload
 */
export interface IFillSingleFormWithMappingActionOutput {
  /** The protected internal URL of the filled PDF (ending with /redirect)  */
  protectedUrl?: string;
  /** The file name of the filled PDF  */
  fileName?: string;
  /** The size of the filled PDF in bytes  */
  fileSize?: number;
  /** Number of fields that were successfully filled  */
  fieldsFilled?: number;
  /** List of field names that were successfully filled  */
  filledFieldNames?: string[];
  /** List of field names that were not found in the PDF  */
  notFoundFields?: string[];
}

/**
 * FillSingleFormWithMappingAction
 * Fills a single PDF form using a formId and a clientContext object. Fetches the form's fieldMapping from the Forms table, uses VariablesPopulate to map clientContext data to the fieldMapping keys producing a fieldValues object, then calls FillPdfForm to produce the filled PDF. Returns the filled PDF URL and metadata. clientContext structure: { clients, agents, provider, funds (single object), requests: { managementFee, tracks } }
 */
export const FillSingleFormWithMappingAction = {
  actionBlockId: "69db99a97d23f0bc9a294f4e",

  inputInstanceType: {} as IFillSingleFormWithMappingActionInput,
  outputInstanceType: {} as IFillSingleFormWithMappingActionOutput,
} as const;

/**
 * ImportAllClientsFundsFromExcel input payload
 */
export interface IImportAllClientsFundsFromExcelActionInput {
  /** URL of the uploaded Excel file (.xlsx or .xls)  */
  fileUrl: string;
}

/**
 * ImportAllClientsFundsFromExcel output payload
 */
export interface IImportAllClientsFundsFromExcelActionOutput {
  /** List of error/warning messages for skipped rows  */
  errors?: string[];
  /** success or error  */
  status?: string;
  /** Summary message  */
  message?: string;
  /** Number of rows skipped (no matching client or missing data)  */
  skippedCount?: number;
  /** Number of fund records successfully imported  */
  importedCount?: number;
  /** Total number of rows read from the Excel file  */
  totalRowsProcessed?: number;
}

/**
 * ImportAllClientsFundsFromExcelAction
 * Execute code action
 */
export const ImportAllClientsFundsFromExcelAction = {
  actionBlockId: "69db99b37d23f0bc9a295573",

  inputInstanceType: {} as IImportAllClientsFundsFromExcelActionInput,
  outputInstanceType: {} as IImportAllClientsFundsFromExcelActionOutput,
} as const;

export type ImportClientsFromExcelActionInputClientStatusEnum =
  | "פעיל"
  | "טרום יעוץ";

/**
 * ImportClientsFromExcel input payload
 */
export interface IImportClientsFromExcelActionInput {
  /** URL of the uploaded Excel file (.xlsx or .xls)  */
  fileUrl: string;
  /** The client status to assign to all imported clients  */
  clientStatus: ImportClientsFromExcelActionInputClientStatusEnum;
}

/**
 * ImportClientsFromExcel output payload
 */
export interface IImportClientsFromExcelActionOutput {
  /** List of error messages for skipped rows  */
  errors?: string[];
  /** Number of rows skipped due to errors  */
  skippedCount?: number;
  /** Number of clients successfully imported  */
  importedCount?: number;
}

/**
 * ImportClientsFromExcelAction
 * Execute code action
 */
export const ImportClientsFromExcelAction = {
  actionBlockId: "69db99aa7d23f0bc9a294fee",

  inputInstanceType: {} as IImportClientsFromExcelActionInput,
  outputInstanceType: {} as IImportClientsFromExcelActionOutput,
} as const;

/**
 * ImportFundsFromExcel input payload
 */
export interface IImportFundsFromExcelActionInput {
  /** URL of the uploaded Excel file (.xlsx or .xls)  */
  fileUrl: string;
  /** The ID of the client to associate all imported funds with  */
  clientId: string;
}

/**
 * ImportFundsFromExcel output payload
 */
export interface IImportFundsFromExcelActionOutput {
  /** List of error messages for skipped rows  */
  errors?: string[];
  /** Number of rows skipped due to errors or missing data  */
  skippedCount?: number;
  /** Number of fund records successfully imported  */
  importedCount?: number;
}

/**
 * ImportFundsFromExcelAction
 * Execute code action
 */
export const ImportFundsFromExcelAction = {
  actionBlockId: "69db99ab7d23f0bc9a295043",

  inputInstanceType: {} as IImportFundsFromExcelActionInput,
  outputInstanceType: {} as IImportFundsFromExcelActionOutput,
} as const;

/**
 * ImportInvestmentTracksFromExcel input payload
 */
export interface IImportInvestmentTracksFromExcelActionInput {
  /** URL of the uploaded Excel file (.xlsx or .xls)  */
  fileUrl: string;
  /** The ID of the client whose funds will be used for policy number matching  */
  clientId: string;
}

/**
 * ImportInvestmentTracksFromExcel output payload
 */
export interface IImportInvestmentTracksFromExcelActionOutput {
  /** List of error messages for skipped rows  */
  errors?: string[];
  /** Number of rows skipped due to errors or missing data  */
  skippedCount?: number;
  /** Number of investment track records successfully imported  */
  importedCount?: number;
}

/**
 * ImportInvestmentTracksFromExcelAction
 * Execute code action
 */
export const ImportInvestmentTracksFromExcelAction = {
  actionBlockId: "69db99ab7d23f0bc9a295088",

  inputInstanceType: {} as IImportInvestmentTracksFromExcelActionInput,
  outputInstanceType: {} as IImportInvestmentTracksFromExcelActionOutput,
} as const;

/**
 * ParseMeetingSummaryAndCreate input payload
 */
export interface IParseMeetingSummaryAndCreateActionInput {
  /** The Hebrew meeting summary text to parse  */
  summary: string;
  /** The ID of the client for whom the meeting is being created  */
  clientId: string;
  /** The email of the logged-in agent user, used to find the matching agent record  */
  agentEmail: string;
}

export type ParseMeetingSummaryAndCreateActionOutputStatusEnum =
  | "מעבד"
  | "מוכן לשליחה ללקוח"
  | "נשלח ללקוח"
  | "מוכן לשליחה לסוכן"
  | "נשלח לסוכן"
  | "מוכן לשליחה ליצרן"
  | "נשלח ליצרן"
  | "הושלם"
  | "נדחה";

/**
 * The item updated in the table, keys are the column names, values are the column values
 */
export interface IParseMeetingSummaryAndCreateActionOutputParseMeetingSummaryAndCreateActionOutputItemsItemObject {
  /** The id of the item to update. Must be an existing id in the table.  */
  id?: string;
  /** Item created at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  createdAt?: string;
  /** Item updated at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  updatedAt?: string;
  /** Item created by user id  */
  createdBy?: string;
  /** Item updated by user id  */
  updatedBy?: string;
  /** Item updated by agent id  */
  updatedByAgentId?: string;
  /** Item tenant id  */
  tenantId?: string;
  /** Array of request IDs associated with this meeting  */
  requests?: string[];
  /** The client attending the meeting  */
  clientId?: string;
  /** Optional notes or comments about the meeting, such as discussion points, outcomes, or follow-up items  */
  notes?: string;
  /** The insurance agent conducting the meeting  */
  agentId?: string;
  /** Current status of the meeting  */
  status?: ParseMeetingSummaryAndCreateActionOutputStatusEnum;
  /** The scheduled date and time of the meeting. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  date?: string;
}

/**
 * ParseMeetingSummaryAndCreate output payload
 */
export interface IParseMeetingSummaryAndCreateActionOutput {
  /** The items updated in the table  */
  items: IParseMeetingSummaryAndCreateActionOutputParseMeetingSummaryAndCreateActionOutputItemsItemObject[];
}

/**
 * ParseMeetingSummaryAndCreateAction
 * Receives a Hebrew meeting summary text, an agentEmail (logged-in user's email), and a clientId. Uses AI to parse the summary into structured requests (each with provider name, request type name, and changes key-value pairs). Then fetches all providers, request schemes, and agents to resolve IDs. Creates all requests in the Requests table, creates a meeting dated today, and links the requests to the meeting.
 */
export const ParseMeetingSummaryAndCreateAction = {
  actionBlockId: "69db99aa7d23f0bc9a294ff7",

  inputInstanceType: {} as IParseMeetingSummaryAndCreateActionInput,
  outputInstanceType: {} as IParseMeetingSummaryAndCreateActionOutput,
} as const;

/**
 * ProcessRequestForms input payload
 */
export interface IProcessRequestFormsActionInput {
  /** The ID of the request to process forms for  */
  requestId: string;
}

export type ProcessRequestFormsActionOutputKerenNameEnum =
  | ""
  | "כללי"
  | "אומגה";

export type ProcessRequestFormsActionOutputStatusEnum =
  | "מעבד"
  | "מוכן לשליחה ללקוח"
  | "נשלח ללקוח"
  | "מוכן לשליחה לסוכן"
  | "נשלח לסוכן"
  | "מוכן לשליחה ליצרן"
  | "נשלח ליצרן"
  | "הושלם"
  | "נדחה";

/**
 * undefined
 */
export interface IProcessRequestFormsActionOutputProcessRequestFormsActionOutputFormsItemObject {
  /** Reference to the form template used  */
  formId?: string;
  /** URL link to the processed/filled form PDF  */
  url: string;
  /** ISO timestamp when the form was processed  */
  processedAt?: string;
}

export type ProcessRequestFormsActionOutputTransferTypeEnum =
  | ""
  | "צבירה והפקדות"
  | "צבירה בלבד"
  | "הפקדות בלבד";

/**
 * Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request
 */
export interface IProcessRequestFormsActionOutputTracksObject {}

export type ProcessRequestFormsActionOutputChoiceDurationEnum =
  | ""
  | "6"
  | "12"
  | "24";

/**
 * The item updated in the table, keys are the column names, values are the column values
 */
export interface IProcessRequestFormsActionOutputProcessRequestFormsActionOutputItemsItemObject {
  /** The id of the item to update. Must be an existing id in the table.  */
  id?: string;
  /** Item created at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  createdAt?: string;
  /** Item updated at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  updatedAt?: string;
  /** Item created by user id  */
  createdBy?: string;
  /** Item updated by user id  */
  updatedBy?: string;
  /** Item updated by agent id  */
  updatedByAgentId?: string;
  /** Item tenant id  */
  tenantId?: string;
  /** Indicates whether the transfer amount is the full/total amount. True means transfer all funds, false or null means partial or unspecified transfer amount.  */
  isTotalTransfer?: boolean;
  /** The name of the keren (fund) associated with this request. Optional enum field with values: כללי (Klali) or אומגה (Omega). Empty string means no keren selected.  */
  kerenName?: ProcessRequestFormsActionOutputKerenNameEnum;
  /** Current processing status of the request  */
  status?: ProcessRequestFormsActionOutputStatusEnum;
  /** The transfer amount (יתרת העברה) for the insurance request, stored as a string to support formatted values  */
  transferAmount?: string;
  /** Array of processed form documents with their URL links  */
  forms?: IProcessRequestFormsActionOutputProcessRequestFormsActionOutputFormsItemObject[];
  /** Reference to the client submitting this request from Clients table  */
  clientId?: string;
  /** Reference to the healthcare provider associated with this request from Providers table  */
  providerId?: string;
  /** סוג העברה - the type of transfer for this insurance request: accumulation and deposits, accumulation only, or deposits only  */
  transferType?: ProcessRequestFormsActionOutputTransferTypeEnum;
  /** Reference to the insurance agent handling this request from Agents table  */
  agentId?: string;
  /** True when the request was created directly from the client profile page (standalone request), false or null when created as part of a meeting wizard flow.  */
  isStandalone?: boolean;
  /** Reference to the request scheme type from RequestSchemes table  */
  requestTypeId?: string;
  /** Management fee (דמי ניהול) associated with this insurance request, representing the fee percentage or amount charged for managing the fund  */
  managementFee?: number;
  /** Reference to a specific insurance fund from the Funds table associated with this request  */
  fundId?: string;
  /** Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request  */
  tracks?: IProcessRequestFormsActionOutputTracksObject;
  /** תקופת בחירה בחודשים - the duration of the choice period in months for this insurance request  */
  choiceDuration?: ProcessRequestFormsActionOutputChoiceDurationEnum;
}

/**
 * ProcessRequestForms output payload
 */
export interface IProcessRequestFormsActionOutput {
  /** The items updated in the table  */
  items: IProcessRequestFormsActionOutputProcessRequestFormsActionOutputItemsItemObject[];
}

/**
 * ProcessRequestFormsAction
 * Processes and fills all PDF forms associated with a request. Fetches the request details, retrieves related data (client, agent, provider, specific fund by fundId), then iterates through each form in the request, fills it using the FillSingleFormWithMapping action with the new clientContext structure (clients, agents, provider, funds as single object, requests with managementFee and tracks), and updates the request with all filled PDF URLs and processing timestamps.
 */
export const ProcessRequestFormsAction = {
  actionBlockId: "69db99a97d23f0bc9a294f5b",

  inputInstanceType: {} as IProcessRequestFormsActionInput,
  outputInstanceType: {} as IProcessRequestFormsActionOutput,
} as const;

/**
 * SendAllFormsForSignatureDocuSeal input payload
 */
export interface ISendAllFormsForSignatureDocuSealActionInput {
  /** The ID of the insurance request to send for signature  */
  requestId: string;
}

export type SendAllFormsForSignatureDocuSealActionOutputStatusEnum =
  | "pending"
  | "client_signed"
  | "agent_signed"
  | "completed"
  | "declined"
  | "expired";

/**
 * The item inserted into the table, keys are the column names, values are the column values
 */
export interface ISendAllFormsForSignatureDocuSealActionOutputSendAllFormsForSignatureDocuSealActionOutputItemsItemObject {
  /** Item id  */
  id?: string;
  /** Item created at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  createdAt?: string;
  /** Item updated at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  updatedAt?: string;
  /** Item created by user id  */
  createdBy?: string;
  /** Item updated by user id  */
  updatedBy?: string;
  /** Item updated by agent id  */
  updatedByAgentId?: string;
  /** Item tenant id  */
  tenantId?: string;
  /** The URL of the filled PDF that was sent for signature  */
  formPdfUrl?: string;
  /** The Docuseal submitter ID for the agent signer (integer).  */
  agentSubmitterId?: number;
  /** The embed source URL for the agent to sign the document via Docuseal.  */
  agentEmbedSrc?: string;
  /** The Docuseal merged template ID used for this signature request (integer).  */
  docusealMergedTemplateId?: number;
  /** Timestamp when the signature request was sent to the client. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  sentAt?: string;
  /** Title of the form that was sent for signature, stored for display purposes  */
  formTitle?: string;
  /** Timestamp when the client signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  clientSignedAt?: string;
  /** Current status of the signature request: pending (awaiting signature), signed (completed), declined (signer declined), cancelled  */
  status?: SendAllFormsForSignatureDocuSealActionOutputStatusEnum;
  /** Timestamp when the signature request was fully completed (all parties signed). Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  completedAt?: string;
  /** The embed source URL for the client to sign the document via Docuseal.  */
  clientEmbedSrc?: string;
  /** Timestamp when the agent signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  agentSignedAt?: string;
  /** Reference to the Clients table record — the signer  */
  clientId?: string;
  /** Reference to the Requests table record this signature request belongs to  */
  requestId?: string;
  /** Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.  */
  formMapping?: ISendAllFormsForSignatureDocuSealActionOutputFormMappingObject;
  /** The Docuseal submission ID for this signature request (integer).  */
  docusealSubmissionId?: number;
  /** Reference to the Meetings table record this signature request is associated with. Nullable.  */
  meetingId?: string;
  /** The Docuseal submitter ID for the client signer (integer).  */
  clientSubmitterId?: number;
  /** Reference to the Forms table record (form template) that was sent for signature  */
  formId?: string;
}

/**
 * Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.
 */
export interface ISendAllFormsForSignatureDocuSealActionOutputFormMappingObject {
  /** Array of form mapping entries  */
  items?: ISendAllFormsForSignatureDocuSealActionOutputSendAllFormsForSignatureDocuSealActionOutputItemsItemObject[];
}

/**
 * SendAllFormsForSignatureDocuSeal output payload
 */
export interface ISendAllFormsForSignatureDocuSealActionOutput {
  /** The items inserted into the table  */
  items: ISendAllFormsForSignatureDocuSealActionOutputSendAllFormsForSignatureDocuSealActionOutputItemsItemObject[];
}

/**
 * SendAllFormsForSignatureDocuSealAction
 * Sends all filled forms in a request for digital signature via DocuSeal with strict signing order. Client receives signing link via email+SMS. Agent receives a notification (email+SMS) saying they will get their link after the client signs. The agent's actual signing link is sent later via webhook when the client completes signing.
 */
export const SendAllFormsForSignatureDocuSealAction = {
  actionBlockId: "69db99af7d23f0bc9a29529d",

  inputInstanceType: {} as ISendAllFormsForSignatureDocuSealActionInput,
  outputInstanceType: {} as ISendAllFormsForSignatureDocuSealActionOutput,
} as const;

/**
 * undefined
 */
export interface ISendCustomProviderEmailActionInputSendCustomProviderEmailActionInputAttachmentUrlsItemObject {
  /** URL of the signed document  */
  url?: string;
  /** Display name of the document  */
  name?: string;
}

/**
 * SendCustomProviderEmail input payload
 */
export interface ISendCustomProviderEmailActionInput {
  /** The email address of the provider/יצרן to send the documents to  */
  recipientEmail: string;
  /** The email subject line  */
  subject: string;
  /** The email body text (plain text, will be wrapped in HTML)  */
  body: string;
  /** Array of signed document URLs to attach to the email as real file attachments  */
  attachmentUrls?: ISendCustomProviderEmailActionInputSendCustomProviderEmailActionInputAttachmentUrlsItemObject[];
  /** Optional client ID (kept for backward compatibility, no longer used for CC)  */
  clientId?: string;
}

/**
 * SendCustomProviderEmail output payload
 */
export interface ISendCustomProviderEmailActionOutput {
  /** Message  */
  message?: string;
}

/**
 * SendCustomProviderEmailAction
 * Sends a fully customizable email to a provider/יצרן with custom subject, body, and signed document attachments as real file attachments. Used when the agent wants to send signed documents to a provider with a custom message.
 */
export const SendCustomProviderEmailAction = {
  actionBlockId: "69db99b27d23f0bc9a2954ab",

  inputInstanceType: {} as ISendCustomProviderEmailActionInput,
  outputInstanceType: {} as ISendCustomProviderEmailActionOutput,
} as const;

/**
 * SendMeetingFormsForSignature input payload
 */
export interface ISendMeetingFormsForSignatureActionInput {
  /** The ID of the meeting whose forms should be sent for signature  */
  meetingId: string;
}

export type SendMeetingFormsForSignatureActionOutputStatusEnum =
  | "pending"
  | "client_signed"
  | "agent_signed"
  | "completed"
  | "declined"
  | "expired";

/**
 * The item inserted into the table, keys are the column names, values are the column values
 */
export interface ISendMeetingFormsForSignatureActionOutputSendMeetingFormsForSignatureActionOutputItemsItemObject {
  /** Item id  */
  id?: string;
  /** Item created at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  createdAt?: string;
  /** Item updated at. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  updatedAt?: string;
  /** Item created by user id  */
  createdBy?: string;
  /** Item updated by user id  */
  updatedBy?: string;
  /** Item updated by agent id  */
  updatedByAgentId?: string;
  /** Item tenant id  */
  tenantId?: string;
  /** The URL of the filled PDF that was sent for signature  */
  formPdfUrl?: string;
  /** The Docuseal submitter ID for the agent signer (integer).  */
  agentSubmitterId?: number;
  /** The embed source URL for the agent to sign the document via Docuseal.  */
  agentEmbedSrc?: string;
  /** The Docuseal merged template ID used for this signature request (integer).  */
  docusealMergedTemplateId?: number;
  /** Timestamp when the signature request was sent to the client. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  sentAt?: string;
  /** Title of the form that was sent for signature, stored for display purposes  */
  formTitle?: string;
  /** Timestamp when the client signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  clientSignedAt?: string;
  /** Current status of the signature request: pending (awaiting signature), signed (completed), declined (signer declined), cancelled  */
  status?: SendMeetingFormsForSignatureActionOutputStatusEnum;
  /** Timestamp when the signature request was fully completed (all parties signed). Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  completedAt?: string;
  /** The embed source URL for the client to sign the document via Docuseal.  */
  clientEmbedSrc?: string;
  /** Timestamp when the agent signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  agentSignedAt?: string;
  /** Reference to the Clients table record — the signer  */
  clientId?: string;
  /** Reference to the Requests table record this signature request belongs to  */
  requestId?: string;
  /** Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.  */
  formMapping?: ISendMeetingFormsForSignatureActionOutputFormMappingObject;
  /** The Docuseal submission ID for this signature request (integer).  */
  docusealSubmissionId?: number;
  /** Reference to the Meetings table record this signature request is associated with. Nullable.  */
  meetingId?: string;
  /** The Docuseal submitter ID for the client signer (integer).  */
  clientSubmitterId?: number;
  /** Reference to the Forms table record (form template) that was sent for signature  */
  formId?: string;
}

/**
 * Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.
 */
export interface ISendMeetingFormsForSignatureActionOutputFormMappingObject {
  /** Array of form mapping entries  */
  items?: ISendMeetingFormsForSignatureActionOutputSendMeetingFormsForSignatureActionOutputItemsItemObject[];
}

/**
 * undefined
 */
export interface ISendMeetingFormsForSignatureActionOutputSendMeetingFormsForSignatureActionOutputItemObject {
  /** The items inserted into the table  */
  items: ISendMeetingFormsForSignatureActionOutputSendMeetingFormsForSignatureActionOutputItemsItemObject[];
}

export type SendMeetingFormsForSignatureActionOutput =
  ISendMeetingFormsForSignatureActionOutputSendMeetingFormsForSignatureActionOutputItemObject[];

/**
 * SendMeetingFormsForSignatureAction
 * Sends ALL filled forms from ALL requests in a meeting as ONE single DocuSeal envelope. Fetches the meeting, then for each request fetches its forms. Fetches form details to get real form titles. Creates one DocuSeal template per form (via CreateDocuSealTemplateForForm), merges ALL templates into one combined template, creates ONE submission with client+agent signers, then saves ONE SignatureRequest row PER REQUEST using forEach (each with its own requestId), all sharing the same DocuSeal submission and formMapping.
 */
export const SendMeetingFormsForSignatureAction = {
  actionBlockId: "69db99b07d23f0bc9a295327",

  inputInstanceType: {} as ISendMeetingFormsForSignatureActionInput,
  outputInstanceType: {} as ISendMeetingFormsForSignatureActionOutput,
} as const;

/**
 * undefined
 */
export interface ISendSignedDocsToProviderEmailActionInputSendSignedDocsToProviderEmailActionInputSignedDocumentsItemObject {
  /** Display name of the document  */
  documentName?: string;
  /** URL to download the signed document  */
  documentUrl?: string;
}

/**
 * SendSignedDocsToProviderEmail input payload
 */
export interface ISendSignedDocsToProviderEmailActionInput {
  /** The email address of the provider/יצרן to send the documents to  */
  recipientEmail: string;
  /** The name of the request type, used in the email subject and body  */
  requestTypeName: string;
  /** Array of signed documents to include as links in the email  */
  signedDocuments: ISendSignedDocsToProviderEmailActionInputSendSignedDocsToProviderEmailActionInputSignedDocumentsItemObject[];
}

/**
 * SendSignedDocsToProviderEmail output payload
 */
export interface ISendSignedDocsToProviderEmailActionOutput {
  /** Message  */
  message?: string;
}

/**
 * SendSignedDocsToProviderEmailAction
 * Sends an email to a provider/יצרן with all signed document links for a specific insurance request. Takes a recipient email, request type name, and an array of signed document URLs, then sends a formatted HTML email with clickable links to each document.
 */
export const SendSignedDocsToProviderEmailAction = {
  actionBlockId: "69db99b07d23f0bc9a29538c",

  inputInstanceType: {} as ISendSignedDocsToProviderEmailActionInput,
  outputInstanceType: {} as ISendSignedDocsToProviderEmailActionOutput,
} as const;
