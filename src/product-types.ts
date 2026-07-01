/**
 * Stores agency-level information such as agency name, used as a data source in field mapping for insurance form templates.
 */
export interface IAgencyEntity {
  /** The name of the insurance agency  */
  agencyName?: string;
  /** The agency's company registration number (ח.פ סוכנות) - free text field for the agency's official business ID  */
  agencyCode?: string;
}

export const AgencyEntity = {
  tableBlockId: "69e09b0d445c8ed93712b6aa",
  instanceType: {} as IAgencyEntity,
} as const;

/**
 * Lookup table for agency codes, mapping each code to a provider and optional description. Used to associate insurance agencies with their codes per provider for form processing and reporting.
 */
export interface IAgencyCodesEntity {
  /** The agent code identifier for this agency code record.  */
  agentCode?: string;
  /** Array of provider IDs this agency code applies to. Supports multiple providers per code.  */
  providerIds?: string[];
  /** Array of request type IDs this agency code applies to. Supports multiple request types per code.  */
  requestTypeIds?: string[];
}

export const AgencyCodesEntity = {
  tableBlockId: "69fca2cd49207e2070d7fb2e",
  instanceType: {} as IAgencyCodesEntity,
} as const;

/**
 * Stores insurance agent information including agent names and identification numbers for insurance form processing
 */
export interface IAgentsEntity {
  /** The unique identification number assigned to the insurance agent  */
  agentNumber?: string;
  /** The agent's email address for communication and notifications  */
  email?: string;
  /** The national ID (תעודת זהות) of the insurance agent  */
  nationalId?: string;
  /** The first name (שם פרטי) of the insurance agent  */
  firstName?: string;
  /** The last name (שם משפחה) of the insurance agent  */
  lastName?: string;
  /** The agent's phone number for SMS notifications (E.164 format, e.g. +972501234567)  */
  phone?: string;
  /** Computed full name of the agent combining first name and last name (שם מלא של הסוכן)  */
  fullName?: string;
}

export const AgentsEntity = {
  tableBlockId: "69db99a77d23f0bc9a294de6",
  instanceType: {} as IAgentsEntity,
} as const;

/**
 * Stores beneficiary records linked to a specific client. Each beneficiary has personal details including name, national ID, relationship to the client, and their allocation percentage of the insurance/fund benefits.
 */
export interface IBeneficiariesEntity {
  /** תאריך לידה - The beneficiary's date of birth.. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  birthDate?: string;
  /** תעודת זהות - The beneficiary's national identification number.  */
  nationalId?: string;
  /** קרבה - The relationship of the beneficiary to the client (e.g., spouse, child, parent).  */
  relationship?: string;
  /** Reference to the client this beneficiary belongs to. Links to the Clients table by client ID.  */
  clientId?: string;
  /** שם פרטי - The beneficiary's first name.  */
  firstName?: string;
  /** שם משפחה - The beneficiary's last name.  */
  lastName?: string;
  /** שם מלא - Calculated full name combining first name and last name.  */
  fullName?: string;
  /** הקצאה באחוזים - The percentage of benefits allocated to this beneficiary. Should be a floating point number between 0 and 100.  */
  allocationPercentage?: number;
}

export const BeneficiariesEntity = {
  tableBlockId: "69fb290d4da763cfff33727c",
  instanceType: {} as IBeneficiariesEntity,
} as const;

/**
 * The full form data submitted by the client, stored as a JSON object matching the Clients table fields
 */
export interface IClientFormTokensEntityFormDataObject {}

export type ClientFormTokensEntityStatusEnum =
  | "pending"
  | "submitted"
  | "expired";

/**
 * Stores unique tokens for client intake forms. Each token links to an optional existing client (for pre-filling) or is for a new client. Tracks the recipient phone/email, submission status, expiry, and the submitted form data including ID document URLs.
 */
export interface IClientFormTokensEntity {
  /** Email address of the recipient to whom the form link was sent via email  */
  recipientEmail?: string;
  /** Email of the agent/user who sent this form token  */
  sentByAgentEmail?: string;
  /** The full form data submitted by the client, stored as a JSON object matching the Clients table fields  */
  formData?: IClientFormTokensEntityFormDataObject;
  /** URL of the uploaded front side of the client's ID card image  */
  idFrontUrl?: string;
  /** Display name of the recipient (for personalization in SMS/email messages)  */
  recipientName?: string;
  /** Current status of the form token: pending (sent, not yet filled), submitted (client completed the form), expired (token no longer valid)  */
  status?: ClientFormTokensEntityStatusEnum;
  /** Expiration datetime of the token. After this time the form link is no longer valid.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  expiresAt?: string;
  /** Datetime when the client submitted the form. Null until submitted.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  submittedAt?: string;
  /** URL of the uploaded back side of the client's ID card image  */
  idBackUrl?: string;
  /** URL of the uploaded ID card appendix (ספח) image  */
  idAppendixUrl?: string;
  /** The ID of the newly created client record after form submission (for new clients only)  */
  createdClientId?: string;
  /** Unique UUID token used in the form URL to identify this form session  */
  token?: string;
  /** Optional reference to an existing client ID in the Clients table. Null if this is for a new client.  */
  clientId?: string;
  /** Phone number of the recipient to whom the form link was sent via SMS  */
  recipientPhone?: string;
}

export const ClientFormTokensEntity = {
  tableBlockId: "6a1abcf03702184f08211d89",
  instanceType: {} as IClientFormTokensEntity,
} as const;

export type ClientsEntityGenderEnum = "זכר" | "נקבה";

export type ClientsEntityClientStatusEnum = "פעיל" | "טרום יעוץ";

export type ClientsEntityRelationshipEnum =
  | "רווק"
  | "נשוי"
  | "גרוש"
  | "אלמן"
  | "ידוע בציבור";

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

export type ClientsEntityBankNameEnum =
  | "בנק הפועלים"
  | "בנק לאומי"
  | "בנק מזרחי טפחות"
  | "בנק דיסקונט"
  | "הבנק הבינלאומי"
  | "וואן זירו הבנק הדיגיטלי"
  | "בנק יהב לעובדי המדינה"
  | "בנק ירושלים"
  | "בנק מרכנתיל דיסקונט"
  | "בנק מסד"
  | "בנק פועלי אגודת ישראל (פאג״י)"
  | "Citibank"
  | "HSBC"
  | "BNP Paribas"
  | "אוצר החייל"
  | "One Zero"
  | "בנק הדואר"
  | "Pepper";

export type ClientsEntityBankCodeEnum =
  | "12"
  | "10"
  | "20"
  | "11"
  | "31"
  | "18"
  | "4"
  | "54"
  | "17"
  | "46"
  | "52"
  | "22"
  | "23"
  | "25"
  | "14"
  | "9";

export type ClientsEntityBeneficiariesDivideEnum =
  | "חלקים שווים"
  | "יחסי לחלקם"
  | "יורשים חוקיים"
  | "אחר";

/**
 * undefined
 */
export interface IClientsEntityBreakdownObject {
  equityExposure?: string;
  foreignExposure?: string;
  diversification?: string;
  returns?: string;
}

/**
 * Stores the last saved portfolio risk analysis result for this client, including riskScore, riskLabel, summary, strengths, improvements, and breakdown. Saved when the agent clicks 'שמור ניתוח' on the PortfolioRiskAnalysis page.
 */
export interface IClientsEntityRiskAnalysisObject {
  /** Risk score from 1 to 10  */
  riskScore?: number;
  /** Hebrew label for the risk level  */
  riskLabel?: string;
  /** Hebrew summary of the risk analysis  */
  summary?: string;
  /** List of portfolio strengths  */
  strengths?: string[];
  /** List of improvement suggestions  */
  improvements?: string[];
  breakdown?: IClientsEntityBreakdownObject;
  /** ISO timestamp of when the analysis was performed  */
  analyzedAt?: string;
}

/**
 * Stores client personal details including national identification number, contact information for insurance form processing
 */
export interface IClientsEntity {
  /** Client's first name  */
  first_name?: string;
  /** Client's last name  */
  last_name?: string;
  /** Client's national identification number, 9 characters  */
  national_id?: string;
  /** Client's email address for communication  */
  email?: string;
  /** Client's phone number for contact  */
  phone_number?: string;
  /** Client's gender  */
  gender?: ClientsEntityGenderEnum;
  /** Client's street address  */
  address?: string;
  /** Client's date of birth. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  dateOfBirth?: string;
  /** City where the client resides  */
  cityOfResidence?: string;
  /** Client's postal/zip code  */
  zipCode?: string;
  /** General notes about the client  */
  notes?: string;
  /** Client's current status in the system  */
  clientStatus?: ClientsEntityClientStatusEnum;
  /** Whether the client is an American citizen or holds US citizenship/residency status  */
  american?: boolean;
  /** Client's marital/relationship status  */
  relationship?: ClientsEntityRelationshipEnum;
  /** Client's occupation or job title  */
  occupation?: string;
  /** Client's employer name  */
  employer?: string;
  /** Client's employer company registration ID number  */
  companyId?: string;
  /** The issue date of the client's national ID card (תאריך הנפקה). ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  idIssueDate?: string;
  /** Client's apartment number (מספר דירה) within their building  */
  apartmentNumber?: string;
  /** Computed full address combining city of residence, street address, and apartment number  */
  fullAddress?: string;
  /** Computed full name combining the client's first name and last name  */
  fullName?: string;
  /** Full name of the first parent or guardian of the client  */
  parent1Name?: string;
  /** National ID number of the first parent or guardian of the client  */
  parent1Id?: string;
  /** Full name of the second parent or guardian of the client  */
  parent2Name?: string;
  /** National ID number of the second parent or guardian of the client  */
  parent2Id?: string;
  /** Computed age of the client in years, calculated from the dateOfBirth field  */
  age?: number;
  /** שם רחוב בלבד - Computed street name extracted from the address field, removing any numeric characters and trimming whitespace  */
  streetName?: string;
  /** מספר בית בלבד - Computed street number extracted from the address field, keeping only numeric characters  */
  streetNumber?: string;
  /** Client's home/building number (מספר בית) - the number of the building or house at the client's address  */
  homeNumber?: string;
  /** First name of the first parent or guardian of the client  */
  parent1FirstName?: string;
  /** Last name of the first parent or guardian of the client  */
  parent1LastName?: string;
  /** First name of the second parent or guardian of the client  */
  parent2FirstName?: string;
  /** Last name of the second parent or guardian of the client  */
  parent2LastName?: string;
  /** Date of birth of the client's first parent, stored in YYYY-MM-DD format. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  parent1DateOfBirth?: string;
  /** Date of birth of the client's second parent, stored in YYYY-MM-DD format. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  parent2DateOfBirth?: string;
  /** List of email addresses of office users assigned to this client. Each entry is an email string referencing a user with the 'office' role.  */
  assignedOfficeEmails?: string[];
  /** Client's city of residence in English (עיר אנגלית)  */
  englishCity?: string;
  /** Whether the client is a US resident for tax purposes (תושב ארצות הברית לצורכי מס)  */
  americanForTax?: boolean;
  /** Client's country in English (מדינה אנגלית)  */
  englishCountry?: string;
  /** Client's last name in English (שם משפחה אנגלית)  */
  englishLastName?: string;
  /** Client's first name in English (שם פרטי אנגלית)  */
  englishFirstName?: string;
  /** Client's US Tax Identification Number (מספר TIN) - required for American tax residents  */
  tinNumber?: string;
  /** Client's country of birth (ארץ לידה)  */
  birthCountry?: string;
  /** Client's city of birth (עיר לידה)  */
  birthCity?: string;
  /** Client's street address in English (רחוב באנגלית)  */
  englishStreet?: string;
  /** Whether the client was born in the USA (יליד ארה״ב)  */
  bornInUSA?: boolean;
  /** Client's employment type - whether they are self-employed or an employee  */
  employment?: ClientsEntityEmploymentEnum;
  /** URL link to a file containing pictures of the client's ID documentation. Accepts any file type (jpg, pdf, doc, etc.). Uploaded by the agent when editing the client's profile.  */
  idDocumentationUrl?: string;
  /** Whether the client is a smoker (מעשן). Used for insurance risk assessment purposes.  */
  smoker?: boolean;
  /** The client's country of birth in English (free text). Used for forms and documents that require English-language birth country information.  */
  birthCountryEnglish?: string;
  /** The client's city of birth in English (free text). Used for forms and documents that require English-language birth city information.  */
  birthCityEnglish?: string;
  /** The client's country of tax residency (מדינת מס). Free text field used to indicate if the client is a tax resident of a foreign country.  */
  taxCountry?: string;
  /** The name of the client's bank (שם בנק). Selected from a predefined list of Israeli and international banks.  */
  bankName?: ClientsEntityBankNameEnum;
  /** The bank branch number where the client's account is located (מספר סניף). Stored as string to preserve leading zeros.  */
  branchNumber?: string;
  /** The client's bank account number (מספר חשבון). Stored as string to preserve leading zeros and special formats.  */
  accountNumber?: string;
  /** Computed English street address with number — combines englishStreet and streetNumber fields (רחוב באנגלית עם מספר)  */
  englishStreetWithNumber?: string;
  /** The bank code (קוד בנק) corresponding to the client's bank. Each code maps to a specific Israeli or international bank.  */
  bankCode?: ClientsEntityBankCodeEnum;
  /** Computed full address in English — combines englishCity, englishStreet, streetNumber, and zipCode (כתובת מלאה באנגלית)  */
  englishFullAddress?: string;
  /** How the insurance benefits are divided among beneficiaries (חלוקה בין מוטבים). Enum values: חלקים שווים, יחסי לחלקם, יורשים חוקיים, אחר  */
  beneficiariesDivide?: ClientsEntityBeneficiariesDivideEnum;
  /** Free text field for describing the beneficiary division when 'אחר' is selected in beneficiariesDivide (חלוקה בין מוטבים - אחר)  */
  beneficiariesDivideFree?: string;
  /** Stores the last saved portfolio risk analysis result for this client, including riskScore, riskLabel, summary, strengths, improvements, and breakdown. Saved when the agent clicks 'שמור ניתוח' on the PortfolioRiskAnalysis page.  */
  riskAnalysis?: IClientsEntityRiskAnalysisObject;
}

export const ClientsEntity = {
  tableBlockId: "69db99a77d23f0bc9a294dce",
  instanceType: {} as IClientsEntity,
} as const;

/**
 * JSON object with key-value pairs where key is the document field name and value is the mapping rule
 */
export interface IFormsEntityFieldMappingObject {}

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

export type FormsEntityFormStatusEnum =
  | "לפני מיפוי"
  | "חסרות אפשרויות מיפוי"
  | "לפני בדיקה"
  | "צריך לערוך קופסאות"
  | "מוכן (ללא מקרי קצה)"
  | "טיוטא ישנה"
  | "מוכן (100%)";

/**
 * Stores insurance form templates including PDF files with dynamic fields, field mappings, associated providers and request types for automated form processing
 */
export interface IFormsEntity {
  /** Form title in English  */
  formTitle?: string;
  /** Form title in Hebrew  */
  formTitleHebrew?: string;
  /** Unique form identifier number  */
  formNumber?: string;
  /** List of Provider IDs from the Providers table  */
  providers?: string[];
  /** List of request type IDs from the RequestSchemes table  */
  requests?: string[];
  /** Optional purpose description for the form, can be null  */
  purpose?: string;
  /** Number of pages in the form  */
  pages?: number;
  /** JSON object with key-value pairs where key is the document field name and value is the mapping rule  */
  fieldMapping?: IFormsEntityFieldMappingObject;
  /** Stores the uploaded file information including file name, size, type, and URL for the insurance form PDF  */
  fileData?: IFormsEntityFileDataObject;
  /** Array of signature field definitions placed on the PDF via drag & drop. Each field has: type (signature|date|text|checkbox|initials), x (pixels from left), y (pixels from top), page (1-indexed), width, height. Saved once per form template and reused for every signature request.  */
  signatureFields?: IFormsEntitySignatureFieldsObject;
  /** Free-text notes or comments about the form template, for internal use by agents and admins  */
  notes?: string;
  /** Current status of the form template indicating its readiness or lifecycle stage  */
  formStatus?: FormsEntityFormStatusEnum;
  /** URL of an image attached to the form template, used for visual reference or supplementary documentation alongside the PDF  */
  imageAttachment?: string;
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
  /** The type of insurance product (e.g., pension, life insurance, provident fund)  */
  productType?: string;
  /** The name of the insurance plan or fund  */
  planName?: string;
  /** The unique policy identification number  */
  policyNumber?: string;
  /** The date when the policy was initiated. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  joinDate?: string;
  /** Current status of the fund policy  */
  status?: FundsEntityStatusEnum;
  /** The total accumulated balance in the fund  */
  totalBalance?: number;
  /** Management fee percentage charged on deposits  */
  managementFeeDeposits?: number;
  /** Management fee percentage charged on accumulated balance  */
  managementFeeAccumulation?: number;
  /** Employment status related to the plan  */
  planStatus?: FundsEntityPlanStatusEnum;
  /** Name of the employer associated with this fund  */
  employer?: string;
  /** The salary amount reported for contribution calculations  */
  reportedSalary?: number;
  /** Total contributions made by the employee  */
  employeeContributions?: number;
  /** Total contributions made by the employer  */
  employerContributions?: number;
  /** Severance pay amount allocated in the fund  */
  severance?: number;
  /** The date of the most recent deposit to the fund. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  lastDepositDate?: string;
  /** The amount of the most recent deposit  */
  lastDepositAmount?: number;
  /** The date until which the fund data is considered valid and current. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  dataValidityDate?: string;
  /** Reference to the client who owns this fund from the Clients table  */
  clientId?: string;
  /** Name of the insurance provider/manufacturer (שם יצרן) as imported from Excel  */
  providerName?: string;
  /** Agent number (מספר סוכן) as imported from Excel - stored as string to support formats like '2-5000'  */
  agentNumber?: string;
}

export const FundsEntity = {
  tableBlockId: "69db99a77d23f0bc9a294dec",
  instanceType: {} as IFundsEntity,
} as const;

/**
 * Stores parsed fund data fetched from igemel-net.co.il. Each row represents one fund/track combination with performance metrics, management fees, AUM, and metadata. Data is refreshed on demand or via scheduled trigger.
 */
export interface IIGemelFundsEntity {
  /** Fund name in Hebrew  */
  name?: string;
  /** Total cumulative return percentage  */
  retTotal?: number;
  /** Management fee percentage  */
  mgmtFee?: number;
  /** Managing company name in Hebrew  */
  company?: string;
  /** Assets under management in millions of ILS  */
  aumMn?: number;
  /** Sharpe ratio  */
  sharpe?: number;
  /** Percentage of tradable assets  */
  tradablePct?: number;
  /** Investment track type in Hebrew (e.g. כללי, מניות)  */
  track?: string;
  /** Target audience in Hebrew  */
  audience?: string;
  /** URL to the fund detail page on igemel-net  */
  fundUrl?: string;
  /** Category of fund: קרנות השתלמות, קופות גמל, פנסיה, etc.  */
  sourceCategory?: string;
  /** Timestamp when this record was last fetched/updated. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  fetchedAt?: string;
  /** 1-year return percentage  */
  ret1y?: number;
  /** 3-year return percentage  */
  ret3y?: number;
  /** 5-year return percentage  */
  ret5y?: number;
  /** Unique fund identifier from igemel-net  */
  fundId?: string;
}

export const IGemelFundsEntity = {
  tableBlockId: "6a1c8fd5141a627844eaa151",
  instanceType: {} as IIGemelFundsEntity,
} as const;

/**
 * Stores investment track records that can be associated with insurance funds, including track name, type, risk level, and other relevant investment track details.
 */
export interface IInvestmentTracksEntity {
  /** מספר מ.ה - The internal track ID number used by the provider  */
  trackIdNumber?: string;
  /** תשואה חודשית - Monthly return rate of the investment track (as a decimal, e.g., 0.0138 = 1.38%)  */
  monthlyReturn?: number;
  /** תשואה תחילת שנה - Year-to-date return rate since the beginning of the year  */
  ytdReturn?: number;
  /** תשואה מצטברת 12 חודשים - Cumulative return over the last 12 months  */
  return12Months?: number;
  /** תשואה ממוצעת 3 שנים - Average annual return over the last 3 years  */
  return3Years?: number;
  /** תשואה ממוצעת 5 שנים - Average annual return over the last 5 years  */
  return5Years?: number;
  /** תאריך נכונות - The date until which the data in this record is valid. ISO 8601 date string, format: YYYY-MM-DD, e.g. 2025-09-30  */
  dataValidityDate?: string;
  /** The name of the investment track  */
  trackName?: string;
  /** סוג מוצר - The type of insurance product (e.g., חיים משולב חסכון, קרן פנסיה, קרן השתלמות)  */
  productType?: string;
  /** שם יצרן - The name of the insurance provider/manufacturer (e.g., הראל, מיטב, כלל)  */
  providerName?: string;
  /** סך צבירה בפוליסה - Total accumulation amount across the entire policy  */
  totalPolicyAccumulation?: number;
  /** סכום צבירה במסלול - The accumulation amount specifically within this investment track  */
  trackAccumulationAmount?: number;
  /** שם מעסיק משלם - The name of the employer making contributions to this track  */
  payingEmployerName?: string;
  /** חשיפה למט״ח - The percentage exposure to foreign currency (as a decimal)  */
  foreignCurrencyExposure?: number;
  /** חשיפה למניות - The percentage exposure to equities/stocks (as a decimal, e.g., 0.528 = 52.8%)  */
  equityExposure?: number;
  /** חשיפה לחו״ל - The percentage exposure to foreign markets (as a decimal)  */
  foreignExposure?: number;
  /** מספר פוליסה - The policy number associated with this investment track  */
  policyNumber?: string;
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
  /** The scheduled date and time of the meeting. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  date?: string;
  /** Array of request IDs associated with this meeting  */
  requests?: string[];
  /** The insurance agent conducting the meeting  */
  agentId?: string;
  /** The client attending the meeting  */
  clientId?: string;
  /** Current status of the meeting  */
  status?: MeetingsEntityStatusEnum;
  /** Optional notes or comments about the meeting, such as discussion points, outcomes, or follow-up items  */
  notes?: string;
}

export const MeetingsEntity = {
  tableBlockId: "69db99a97d23f0bc9a294f70",
  instanceType: {} as IMeetingsEntity,
} as const;

/**
 * Lookup table that stores the email address to use when sending documents to a provider for a specific request type. Each row represents a unique combination of provider and request type with the corresponding recipient email.
 */
export interface IProviderEmailsEntity {
  /** The recipient email address to use when sending documents to the provider for this specific request type  */
  email?: string;
  /** Optional notes or description about this email mapping (e.g. department name, contact person)  */
  notes?: string;
  /** Reference to the provider (Providers table ID) this email mapping applies to  */
  providerId?: string;
  /** Reference to the request type (RequestSchemes table ID) this email mapping applies to  */
  requestTypeId?: string;
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
  /** The institutional/official name of the provider, used for formal documents and insurance form processing  */
  institutionalName?: string;
  /** The official provider identification code or ID number used to identify the provider in external systems and insurance forms  */
  providerIdCode?: string;
  /** Computed column combining the institutional name and provider ID code, displayed as 'שם מוסדי וח.פ' in Hebrew. Used for display in forms and selectors.  */
  institutionalNameAndCode?: string;
}

export const ProvidersEntity = {
  tableBlockId: "69db99a77d23f0bc9a294de0",
  instanceType: {} as IProvidersEntity,
} as const;

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

/**
 * Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request
 */
export interface IRequestsEntityTracksObject {}

export type RequestsEntityChoiceDurationEnum = "" | "6" | "12" | "24";

export type RequestsEntityTransferTypeEnum =
  | ""
  | "צבירה והפקדות"
  | "צבירה בלבד"
  | "הפקדות בלבד";

export type RequestsEntityKerenNameEnum = "" | "כללי" | "אומגה";

export type RequestsEntityStandingEnum =
  | "שכיר"
  | "עצמאי"
  | "שכיר בעל שליטה"
  | "עצמאי באמצעות מעסיק"
  | "חבר קיבוץ";

export type RequestsEntityAccountTypeEnum = "פרטי" | "עסקי";

export type RequestsEntityChargeDayEnum = "1" | "5" | "10" | "15" | "20" | "25";

export type RequestsEntityIndependentTransferTypeEnum =
  | "הוראת קבע"
  | "הפקדה חד פעמית";

/**
 * Stores insurance request records including request type, associated agent, client, provider, processing status, scheme changes, and links to processed forms for tracking request lifecycle
 */
export interface IRequestsEntity {
  /** Current processing status of the request  */
  status?: RequestsEntityStatusEnum;
  /** Reference to the request scheme type from RequestSchemes table  */
  requestTypeId?: string;
  /** Reference to the insurance agent handling this request from Agents table  */
  agentId?: string;
  /** Reference to the client submitting this request from Clients table  */
  clientId?: string;
  /** Array of processed form documents with their URL links  */
  forms?: IRequestsEntityRequestsEntityFormsItemObject[];
  /** Reference to the healthcare provider associated with this request from Providers table  */
  providerId?: string;
  /** Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request  */
  tracks?: IRequestsEntityTracksObject;
  /** Reference to a specific insurance fund from the Funds table associated with this request  */
  fundId?: string;
  /** Management fee deposit (דמי ניהול מהפקדה) associated with this insurance request, representing the fee percentage charged on deposits for managing the fund  */
  managementFee?: number;
  /** תקופת בחירה בחודשים - the duration of the choice period in months for this insurance request  */
  choiceDuration?: RequestsEntityChoiceDurationEnum;
  /** סוג העברה - the type of transfer for this insurance request: accumulation and deposits, accumulation only, or deposits only  */
  transferType?: RequestsEntityTransferTypeEnum;
  /** The name of the keren (fund) associated with this request. Optional enum field with values: כללי (Klali) or אומגה (Omega). Empty string means no keren selected.  */
  kerenName?: RequestsEntityKerenNameEnum;
  /** The transfer amount (יתרת העברה) for the insurance request, stored as a string to support formatted values  */
  transferAmount?: string;
  /** Indicates whether the transfer amount is the full/total amount. True means transfer all funds, false or null means partial or unspecified transfer amount.  */
  isTotalTransfer?: boolean;
  /** True when the request was created directly from the client profile page (standalone request), false or null when created as part of a meeting wizard flow.  */
  isStandalone?: boolean;
  /** מעמד - the standing/status classification of the request, e.g. שכיר, עצמאי, or other relevant standing values  */
  standing?: RequestsEntityStandingEnum;
  /** Management fee accumulation (דמי ניהול מצבירה) associated with this insurance request, representing the fee percentage charged on accumulated funds  */
  managementFeeAccumulation?: number;
  /** סוג חשבון - the account type for this insurance request. פרטי means personal account, עסקי means business account.  */
  accountType?: RequestsEntityAccountTypeEnum;
  /** מועד חיוב - the charge day of the month for this insurance request. Enum values represent the day of the month on which the charge is made.  */
  chargeDay?: RequestsEntityChargeDayEnum;
  /** Type of independent transfer for the insurance request. Either 'הוראת קבע' (standing order) or 'הפקדה חד פעמית' (one-time deposit).  */
  independentTransferType?: RequestsEntityIndependentTransferTypeEnum;
  /** The amount for the independent transfer in the insurance request. Stored as a string to support various formats.  */
  independentTransferAmount?: string;
  /** ניוד חלקי - indicates whether this request involves a partial transfer of funds  */
  isPartialTransfer?: boolean;
  /** סכום ניוד חלקי - the amount for a partial transfer in the insurance request  */
  partialTransferAmount?: number;
  /** סכום הפקדה חד פעמית - the amount for a one-time deposit transfer in the insurance request  */
  oneTimeTransferAmount?: number;
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
  /** The name of the request scheme type  */
  requestTypeName?: string;
  /** Flexible JSON structure to store various types of tracks (מסלולים) for the request scheme  */
  tracks?: IRequestSchemesEntityTracksObject;
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
  /** Reference to the Requests table record this signature request belongs to  */
  requestId?: string;
  /** Reference to the Clients table record — the signer  */
  clientId?: string;
  /** Reference to the Forms table record (form template) that was sent for signature  */
  formId?: string;
  /** Current status of the signature request: pending (awaiting signature), signed (completed), declined (signer declined), cancelled  */
  status?: SignatureRequestsEntityStatusEnum;
  /** The URL of the filled PDF that was sent for signature  */
  formPdfUrl?: string;
  /** Timestamp when the signature request was sent to the client. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  sentAt?: string;
  /** Title of the form that was sent for signature, stored for display purposes  */
  formTitle?: string;
  /** Reference to the Meetings table record this signature request is associated with. Nullable.  */
  meetingId?: string;
  /** The Docuseal submission ID for this signature request (integer).  */
  docusealSubmissionId?: number;
  /** The Docuseal merged template ID used for this signature request (integer).  */
  docusealMergedTemplateId?: number;
  /** The Docuseal submitter ID for the agent signer (integer).  */
  agentSubmitterId?: number;
  /** The Docuseal submitter ID for the client signer (integer).  */
  clientSubmitterId?: number;
  /** The embed source URL for the agent to sign the document via Docuseal.  */
  agentEmbedSrc?: string;
  /** The embed source URL for the client to sign the document via Docuseal.  */
  clientEmbedSrc?: string;
  /** Timestamp when the agent signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  agentSignedAt?: string;
  /** Timestamp when the client signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  clientSignedAt?: string;
  /** Timestamp when the signature request was fully completed (all parties signed). Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  completedAt?: string;
  /** Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.  */
  formMapping?: ISignatureRequestsEntityFormMappingObject;
}

export const SignatureRequestsEntity = {
  tableBlockId: "69db99ad7d23f0bc9a295146",
  instanceType: {} as ISignatureRequestsEntity,
} as const;

/**
 * Stores completed signed document records, linking each signed document to its originating signature request, insurance request, meeting, and client. Tracks the document name, URL, DocuSeal submission ID, and timestamps for when the document was signed and created.
 */
export interface ISignedDocumentsEntity {
  /** Foreign key reference to the Signature Requests table — the signature request that produced this signed document  */
  signatureRequestId?: string;
  /** The name or title of the signed document  */
  documentName?: string;
  /** Foreign key reference to the Meetings table — the meeting during which this document was signed, if applicable  */
  meetingId?: string;
  /** Foreign key reference to the Clients table — the client who signed this document  */
  clientId?: string;
  /** The URL where the signed document PDF can be accessed or downloaded  */
  documentUrl?: string;
  /** The DocuSeal submission ID associated with this signed document, used to reference the submission in DocuSeal's system  */
  docusealSubmissionId?: number;
  /** The timestamp when the document was fully signed by all required parties. Nullable — null if not yet signed.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  signedAt?: string;
  /** Foreign key reference to the Forms table — the specific form template that was signed in this document. Used to link each signed document back to its original form template.  */
  formId?: string;
  /** Foreign key reference to the Requests table — the insurance request associated with this signed document  */
  requestId?: string;
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

export const AgencyManagerPage = {
  pageBlockId: "69fca46678c982d3b358127c",
  pageName: "AgencyManager",
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

export const ClientFormSenderPage = {
  pageBlockId: "6a1abd73539c423fc0d9bc4b",
  pageName: "ClientFormSender",
} as const;

export const ClientIntakeFormPage = {
  pageBlockId: "6a1abd74539c423fc0d9bc59",
  pageName: "ClientIntakeForm",
} as const;

export const ClientProfilePage = {
  pageBlockId: "69db99a87d23f0bc9a294e9f",
  pageName: "ClientProfile",
} as const;

export const ClientsManagerPage = {
  pageBlockId: "69db99a87d23f0bc9a294e9c",
  pageName: "ClientsManager",
} as const;

export const ClientVerificationPage = {
  pageBlockId: "6a2597bc17cb7ee55d3ca903",
  pageName: "ClientVerification",
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

export const IGemelComparisonPage = {
  pageBlockId: "6a1c9030eb13087ab37351bb",
  pageName: "IGemelComparison",
} as const;

export const InvestmentComparisonPage = {
  pageBlockId: "6a1b1390c13552552b4038ec",
  pageName: "InvestmentComparison",
} as const;

export const LoginPage = {
  pageBlockId: "69db99aa7d23f0bc9a294fb0",
  pageName: "Login",
} as const;

export const MeetingDetailsPage = {
  pageBlockId: "69db99b07d23f0bc9a29532d",
  pageName: "MeetingDetails",
} as const;

export const MeetingSummaryPage = {
  pageBlockId: "69fda9c37a041228c67f1a1e",
  pageName: "MeetingSummary",
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

export const PdfFieldEditorPage = {
  pageBlockId: "69f643d9c27354e1adf4efaf",
  pageName: "PdfFieldEditor",
} as const;

export const PortfolioRiskAnalysisPage = {
  pageBlockId: "6a2070947c1b4a9b7afd2d79",
  pageName: "PortfolioRiskAnalysis",
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
 * AnalyzePortfolioRisk input payload
 */
export interface IAnalyzePortfolioRiskActionInput {
  /** The ID of the client whose portfolio will be analyzed  */
  clientId: string;
  /** The analysis prompt to send to the AI model  */
  prompt: string;
}

export type AnalyzePortfolioRiskActionOutputRiskLevelEnum =
  | "סיכון גבוה"
  | "סיכון ממוצע"
  | "סיכון נמוך";

/**
 * undefined
 */
export interface IAnalyzePortfolioRiskActionOutputBreakdownObject {
  /** ממוצע חשיפה למניות  */
  equityExposure?: string;
  /** ממוצע חשיפה לחו"ל  */
  foreignExposure?: string;
  /** ניתוח פיזור  */
  diversification?: string;
  /** ניתוח תשואות  */
  returns?: string;
}

/**
 * undefined
 */
export interface IAnalyzePortfolioRiskActionOutputAnalyzePortfolioRiskActionOutputProductAnalysisItemObject {
  /** שם המוצר/קופה  */
  productName: string;
  /** שם היצרן/חברה המנהלת  */
  providerName?: string;
  /** שם המסלול הראשי (או 'מסלולים מרובים' אם יש כמה)  */
  trackName?: string;
  /** סכום הכסף המושקע במוצר זה (בשקלים)  */
  amount?: number;
  /** אחוז מכלל התיק (0-100)  */
  portfolioPercentage?: number;
  /** רמת סיכון של המוצר הספציפי  */
  riskLevel: AnalyzePortfolioRiskActionOutputRiskLevelEnum;
  /** ניתוח קצר של המוצר  */
  analysis: string;
  /** נקודות חוזק של המוצר  */
  strengths?: string[];
  /** בעיות או נקודות לשיפור במוצר  */
  issues?: string[];
}

/**
 * AnalyzePortfolioRisk output payload
 */
export interface IAnalyzePortfolioRiskActionOutput {
  /** רמת הסיכון של התיק — אחת מ-3 אפשרויות בלבד  */
  riskLevel: AnalyzePortfolioRiskActionOutputRiskLevelEnum;
  /** סיכום קצר של ניתוח הסיכון — מה מוביל לסיווג זה  */
  summary: string;
  /** נקודות חוזק של התיק  */
  strengths: string[];
  /** נקודות לשיפור בתיק  */
  improvements: string[];
  breakdown: IAnalyzePortfolioRiskActionOutputBreakdownObject;
  /** ניתוח פרטני לכל מוצר/קופה בנפרד  */
  productAnalysis: IAnalyzePortfolioRiskActionOutputAnalyzePortfolioRiskActionOutputProductAnalysisItemObject[];
}

/**
 * AnalyzePortfolioRiskAction
 * Analyzes the risk level of a client's investment portfolio. Fetches all Funds for the given clientId, then fetches InvestmentTracks per fund by policyNumber using forEach, strips all personal identifiers, and sends the anonymized portfolio data along with a user-provided prompt to AI for risk scoring on a 1-10 scale.
 */
export const AnalyzePortfolioRiskAction = {
  actionBlockId: "6a207061bb9f277e7c9a2047",

  inputInstanceType: {} as IAnalyzePortfolioRiskActionInput,
  outputInstanceType: {} as IAnalyzePortfolioRiskActionOutput,
} as const;

export type AnnotateFormPdfFieldsActionInputTypeEnum =
  | "text"
  | "checkbox"
  | "dropdown"
  | "radio"
  | "optionList"
  | "signature"
  | "date";

export type AnnotateFormPdfFieldsActionInputFontFamilyEnum =
  | "helvetica"
  | "rubik";

export type AnnotateFormPdfFieldsActionInputTextDirectionEnum = "ltr" | "rtl";

/**
 * undefined
 */
export interface IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputFieldsItemObject {
  name: string;
  type: AnnotateFormPdfFieldsActionInputTypeEnum;
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: AnnotateFormPdfFieldsActionInputFontFamilyEnum;
  textDirection?: AnnotateFormPdfFieldsActionInputTextDirectionEnum;
  multiline?: boolean;
  required?: boolean;
  readOnly?: boolean;
  options?: string[];
  defaultValue?: string;
}

/**
 * undefined
 */
export interface IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputRemoveFieldNamesItemObject {
  /** Field name to remove  */
  name: string;
  /** 0-based index to disambiguate duplicate field names; omit to target the first match  */
  occurrence?: number;
}

/**
 * undefined
 */
export interface IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputFieldGeometryUpdatesItemObject {
  name: string;
  /** 0-based index to disambiguate duplicate field names; omit to target the first match  */
  occurrence?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * undefined
 */
export interface IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputRenamedFieldsItemObject {
  originalName: string;
  newName: string;
  /** 0-based index to disambiguate duplicate field names; omit to target the first match  */
  occurrence?: number;
}

/**
 * AnnotateFormPdfFields input payload
 */
export interface IAnnotateFormPdfFieldsActionInput {
  /** The ID of the form record in the Forms table  */
  formId: string;
  /** The current internal /redirect URL of the PDF  */
  pdfUrl: string;
  /** The original file name to preserve in fileData  */
  formFileName?: string;
  /** New fields to add to the PDF  */
  fields: IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputFieldsItemObject[];
  /** Existing fields to remove from the PDF. Each entry has a name and optional occurrence (0-based) to disambiguate duplicates.  */
  removeFieldNames?: IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputRemoveFieldNamesItemObject[];
  /** Geometry updates for existing fields (move/resize without removing). Supports occurrence to disambiguate duplicate field names.  */
  fieldGeometryUpdates?: IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputFieldGeometryUpdatesItemObject[];
  /** Fields to rename. Supports occurrence to disambiguate duplicate field names.  */
  renamedFields?: IAnnotateFormPdfFieldsActionInputAnnotateFormPdfFieldsActionInputRenamedFieldsItemObject[];
}

/**
 * JSON object with key-value pairs where key is the document field name and value is the mapping rule
 */
export interface IAnnotateFormPdfFieldsActionOutputFieldMappingObject {}

/**
 * Stores the uploaded file information including file name, size, type, and URL for the insurance form PDF
 */
export interface IAnnotateFormPdfFieldsActionOutputFileDataObject {
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
 * undefined
 */
export interface IAnnotateFormPdfFieldsActionOutputAnnotateFormPdfFieldsActionOutputFieldsItemObject {
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
export interface IAnnotateFormPdfFieldsActionOutputSignatureFieldsObject {
  /** List of signature fields placed on the PDF with DocuSeal-compatible ratio-based coordinates  */
  fields: IAnnotateFormPdfFieldsActionOutputAnnotateFormPdfFieldsActionOutputFieldsItemObject[];
}

export type AnnotateFormPdfFieldsActionOutputFormStatusEnum =
  | "לפני מיפוי"
  | "חסרות אפשרויות מיפוי"
  | "לפני בדיקה"
  | "צריך לערוך קופסאות"
  | "מוכן (ללא מקרי קצה)"
  | "טיוטא ישנה"
  | "מוכן (100%)";

/**
 * The item updated in the table, keys are the column names, values are the column values
 */
export interface IAnnotateFormPdfFieldsActionOutputAnnotateFormPdfFieldsActionOutputItemsItemObject {
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
  /** Form title in English  */
  formTitle?: string;
  /** Form title in Hebrew  */
  formTitleHebrew?: string;
  /** Unique form identifier number  */
  formNumber?: string;
  /** List of Provider IDs from the Providers table  */
  providers?: string[];
  /** List of request type IDs from the RequestSchemes table  */
  requests?: string[];
  /** Optional purpose description for the form, can be null  */
  purpose?: string;
  /** Number of pages in the form  */
  pages?: number;
  /** JSON object with key-value pairs where key is the document field name and value is the mapping rule  */
  fieldMapping?: IAnnotateFormPdfFieldsActionOutputFieldMappingObject;
  /** Stores the uploaded file information including file name, size, type, and URL for the insurance form PDF  */
  fileData?: IAnnotateFormPdfFieldsActionOutputFileDataObject;
  /** Array of signature field definitions placed on the PDF via drag & drop. Each field has: type (signature|date|text|checkbox|initials), x (pixels from left), y (pixels from top), page (1-indexed), width, height. Saved once per form template and reused for every signature request.  */
  signatureFields?: IAnnotateFormPdfFieldsActionOutputSignatureFieldsObject;
  /** Free-text notes or comments about the form template, for internal use by agents and admins  */
  notes?: string;
  /** Current status of the form template indicating its readiness or lifecycle stage  */
  formStatus?: AnnotateFormPdfFieldsActionOutputFormStatusEnum;
  /** URL of an image attached to the form template, used for visual reference or supplementary documentation alongside the PDF  */
  imageAttachment?: string;
}

/**
 * AnnotateFormPdfFields output payload
 */
export interface IAnnotateFormPdfFieldsActionOutput {
  /** The items updated in the table  */
  items: IAnnotateFormPdfFieldsActionOutputAnnotateFormPdfFieldsActionOutputItemsItemObject[];
}

/**
 * AnnotateFormPdfFieldsAction
 * Annotates the PDF form fields for a given form. Uses EditPdfFormFields to handle deletions, renames, and geometry updates on existing fields (with occurrence support for duplicate field names), then uses AnnotatePdfFormFields to add new fields. Finally updates the form record's fileData URL in the Forms table with the newly annotated PDF.
 */
export const AnnotateFormPdfFieldsAction = {
  actionBlockId: "69f6438f5200c9748117efab",

  inputInstanceType: {} as IAnnotateFormPdfFieldsActionInput,
  outputInstanceType: {} as IAnnotateFormPdfFieldsActionOutput,
} as const;

/**
 * AutoProcessNewRequest input payload
 */
export interface IAutoProcessNewRequestActionInput {
  /** The ID of the newly created request to process  */
  requestId: string;
}

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

/**
 * Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request
 */
export interface IAutoProcessNewRequestActionOutputTracksObject {}

export type AutoProcessNewRequestActionOutputChoiceDurationEnum =
  | ""
  | "6"
  | "12"
  | "24";

export type AutoProcessNewRequestActionOutputTransferTypeEnum =
  | ""
  | "צבירה והפקדות"
  | "צבירה בלבד"
  | "הפקדות בלבד";

export type AutoProcessNewRequestActionOutputKerenNameEnum =
  | ""
  | "כללי"
  | "אומגה";

export type AutoProcessNewRequestActionOutputStandingEnum =
  | "שכיר"
  | "עצמאי"
  | "שכיר בעל שליטה"
  | "עצמאי באמצעות מעסיק"
  | "חבר קיבוץ";

export type AutoProcessNewRequestActionOutputAccountTypeEnum = "פרטי" | "עסקי";

export type AutoProcessNewRequestActionOutputChargeDayEnum =
  | "1"
  | "5"
  | "10"
  | "15"
  | "20"
  | "25";

export type AutoProcessNewRequestActionOutputIndependentTransferTypeEnum =
  | "הוראת קבע"
  | "הפקדה חד פעמית";

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
  /** Current processing status of the request  */
  status?: AutoProcessNewRequestActionOutputStatusEnum;
  /** Reference to the request scheme type from RequestSchemes table  */
  requestTypeId?: string;
  /** Reference to the insurance agent handling this request from Agents table  */
  agentId?: string;
  /** Reference to the client submitting this request from Clients table  */
  clientId?: string;
  /** Array of processed form documents with their URL links  */
  forms?: IAutoProcessNewRequestActionOutputAutoProcessNewRequestActionOutputFormsItemObject[];
  /** Reference to the healthcare provider associated with this request from Providers table  */
  providerId?: string;
  /** Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request  */
  tracks?: IAutoProcessNewRequestActionOutputTracksObject;
  /** Reference to a specific insurance fund from the Funds table associated with this request  */
  fundId?: string;
  /** Management fee deposit (דמי ניהול מהפקדה) associated with this insurance request, representing the fee percentage charged on deposits for managing the fund  */
  managementFee?: number;
  /** תקופת בחירה בחודשים - the duration of the choice period in months for this insurance request  */
  choiceDuration?: AutoProcessNewRequestActionOutputChoiceDurationEnum;
  /** סוג העברה - the type of transfer for this insurance request: accumulation and deposits, accumulation only, or deposits only  */
  transferType?: AutoProcessNewRequestActionOutputTransferTypeEnum;
  /** The name of the keren (fund) associated with this request. Optional enum field with values: כללי (Klali) or אומגה (Omega). Empty string means no keren selected.  */
  kerenName?: AutoProcessNewRequestActionOutputKerenNameEnum;
  /** The transfer amount (יתרת העברה) for the insurance request, stored as a string to support formatted values  */
  transferAmount?: string;
  /** Indicates whether the transfer amount is the full/total amount. True means transfer all funds, false or null means partial or unspecified transfer amount.  */
  isTotalTransfer?: boolean;
  /** True when the request was created directly from the client profile page (standalone request), false or null when created as part of a meeting wizard flow.  */
  isStandalone?: boolean;
  /** מעמד - the standing/status classification of the request, e.g. שכיר, עצמאי, or other relevant standing values  */
  standing?: AutoProcessNewRequestActionOutputStandingEnum;
  /** Management fee accumulation (דמי ניהול מצבירה) associated with this insurance request, representing the fee percentage charged on accumulated funds  */
  managementFeeAccumulation?: number;
  /** סוג חשבון - the account type for this insurance request. פרטי means personal account, עסקי means business account.  */
  accountType?: AutoProcessNewRequestActionOutputAccountTypeEnum;
  /** מועד חיוב - the charge day of the month for this insurance request. Enum values represent the day of the month on which the charge is made.  */
  chargeDay?: AutoProcessNewRequestActionOutputChargeDayEnum;
  /** Type of independent transfer for the insurance request. Either 'הוראת קבע' (standing order) or 'הפקדה חד פעמית' (one-time deposit).  */
  independentTransferType?: AutoProcessNewRequestActionOutputIndependentTransferTypeEnum;
  /** The amount for the independent transfer in the insurance request. Stored as a string to support various formats.  */
  independentTransferAmount?: string;
  /** ניוד חלקי - indicates whether this request involves a partial transfer of funds  */
  isPartialTransfer?: boolean;
  /** סכום ניוד חלקי - the amount for a partial transfer in the insurance request  */
  partialTransferAmount?: number;
  /** סכום הפקדה חד פעמית - the amount for a one-time deposit transfer in the insurance request  */
  oneTimeTransferAmount?: number;
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
 * CleanClientPhoneNumbers input payload
 */
export interface ICleanClientPhoneNumbersActionInput {}

/**
 * CleanClientPhoneNumbers output payload
 */
export interface ICleanClientPhoneNumbersActionOutput {
  /** List of error messages  */
  errors?: string[];
  /** success or error  */
  status?: string;
  /** Number of records skipped (no change needed)  */
  skippedCount?: number;
  /** Number of records updated  */
  updatedCount?: number;
}

/**
 * CleanClientPhoneNumbersAction
 * Execute code action
 */
export const CleanClientPhoneNumbersAction = {
  actionBlockId: "69ef26bd4988dbf55f506c65",

  inputInstanceType: {} as ICleanClientPhoneNumbersActionInput,
  outputInstanceType: {} as ICleanClientPhoneNumbersActionOutput,
} as const;

/**
 * createClientContext input payload
 */
export interface ICreateClientContextActionInput {
  /** The ID of the request from the Requests table to build context for  */
  requestId: string;
}

export type CreateClientContextActionOutput = any;

/**
 * createClientContextAction
 * Builds a complete clientContext object for a given requestId. Fetches the request, then in parallel fetches the specific client, agent, provider, the specific fund linked to the request, the agency, all agency codes, and all beneficiaries for the client. Finds the matching agency code entry where requestTypeIds includes the request's requestTypeId AND providerIds includes the request's providerId, and extracts the agentCode. Outputs the full clientContext object: clients, agents, providers, funds, requests, agency, agencyCodes (with agentCode), and beneficiaries (array).
 */
export const CreateClientContextAction = {
  actionBlockId: "69db99ac7d23f0bc9a2950e5",

  inputInstanceType: {} as ICreateClientContextActionInput,
  outputInstanceType: {} as ICreateClientContextActionOutput,
} as const;

/**
 * DescribeFormPdfFields input payload
 */
export interface IDescribeFormPdfFieldsActionInput {
  /** The ID of the form record in the Forms table  */
  formId: string;
  /** The internal /redirect URL of the PDF file  */
  pdfUrl: string;
}

export type DescribeFormPdfFieldsActionOutputTypeEnum =
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
export interface IDescribeFormPdfFieldsActionOutputDescribeFormPdfFieldsActionOutputFieldsItemObject {
  /** The name/identifier of the form field  */
  name?: string;
  /** The type of the form field (text, checkbox, dropdown, optionList, radio, signature, date)  */
  type?: DescribeFormPdfFieldsActionOutputTypeEnum;
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
 * DescribeFormPdfFields output payload
 */
export interface IDescribeFormPdfFieldsActionOutput {
  /** List of form fields found in the PDF  */
  fields?: IDescribeFormPdfFieldsActionOutputDescribeFormPdfFieldsActionOutputFieldsItemObject[];
  /** Total number of form fields found  */
  totalFields?: number;
  /** Number of pages in the PDF  */
  pageCount?: number;
}

/**
 * DescribeFormPdfFieldsAction
 * Generates a signed URL for a form's PDF file, then calls DescribePdfFormFields to return all fillable fields with their positions, types, sizes, and page numbers. Used by the PdfFieldEditor page to load existing fields.
 */
export const DescribeFormPdfFieldsAction = {
  actionBlockId: "69f6438e5200c9748117ef53",

  inputInstanceType: {} as IDescribeFormPdfFieldsActionInput,
  outputInstanceType: {} as IDescribeFormPdfFieldsActionOutput,
} as const;

/**
 * FetchIGemelFunds input payload
 */
export interface IFetchIGemelFundsActionInput {
  /** Optional list of category slugs to fetch. If omitted, fetches all 6 categories. (default: ) */
  categories?: string[];
}

/**
 * undefined
 */
export interface IFetchIGemelFundsActionOutputFetchIGemelFundsActionOutputCategorySummaryItemObject {
  url?: string;
  error?: string;
  category?: string;
  inserted?: number;
}

/**
 * FetchIGemelFunds output payload
 */
export interface IFetchIGemelFundsActionOutput {
  errors?: string[];
  /** success or error  */
  status?: string;
  /** ISO timestamp of when data was fetched  */
  fetchedAt?: string;
  /** Total number of fund records inserted  */
  totalInserted?: number;
  categorySummary?: IFetchIGemelFundsActionOutputFetchIGemelFundsActionOutputCategorySummaryItemObject[];
}

/**
 * FetchIGemelFundsAction
 * Execute code action
 */
export const FetchIGemelFundsAction = {
  actionBlockId: "6a1c8ff2eb13087ab372a895",

  inputInstanceType: {} as IFetchIGemelFundsActionInput,
  outputInstanceType: {} as IFetchIGemelFundsActionOutput,
} as const;

/**
 * FetchMyGemelData input payload
 */
export interface IFetchMyGemelDataActionInput {
  /** List of mygemel.net page URLs to scrape. If omitted, defaults to all 6 standard category pages. (default: ) */
  urls?: string[];
}

/**
 * undefined
 */
export interface IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject {
  name?: string;
  april?: string;
  yield_1y?: string;
  yield_3y?: string;
  yield_5y?: string;
}

/**
 * undefined
 */
export interface IFetchMyGemelDataActionOutputAverageObject {
  april?: string;
  yield_1y?: string;
  yield_3y?: string;
  yield_5y?: string;
}

/**
 * undefined
 */
export interface IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputCategoriesItemObject {
  funds?: IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject[];
  average?: IFetchMyGemelDataActionOutputAverageObject;
  /** Category name from h2.title  */
  category?: string;
  /** The URL this category was fetched from  */
  sourceUrl?: string;
}

/**
 * FetchMyGemelData output payload
 */
export interface IFetchMyGemelDataActionOutput {
  errors?: string[];
  /** success or error  */
  status?: string;
  /** ISO timestamp of when data was fetched  */
  fetchedAt?: string;
  categories?: IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputCategoriesItemObject[];
  /** Total number of categories parsed across all pages  */
  totalCategories?: number;
}

/**
 * FetchMyGemelDataAction
 * Execute code action
 */
export const FetchMyGemelDataAction = {
  actionBlockId: "6a1b124b3702184f086526f5",

  inputInstanceType: {} as IFetchMyGemelDataActionInput,
  outputInstanceType: {} as IFetchMyGemelDataActionOutput,
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
 * undefined
 */
export interface IParseMeetingSummaryActionActionInputParseMeetingSummaryActionActionInputAvailableProvidersItemObject {
  id?: string;
  name?: string;
}

/**
 * undefined
 */
export interface IParseMeetingSummaryActionActionInputParseMeetingSummaryActionActionInputAvailableRequestTypesItemObject {
  id?: string;
  name?: string;
}

/**
 * undefined
 */
export interface IParseMeetingSummaryActionActionInputParseMeetingSummaryActionActionInputAllClientsItemObject {
  id?: string;
  first_name?: string;
  last_name?: string;
  national_id?: string;
}

/**
 * ParseMeetingSummaryAction input payload
 */
export interface IParseMeetingSummaryActionActionInput {
  /** Free-text Hebrew meeting summary written by the agent  */
  summary: string;
  /** List of all providers with their IDs and names  */
  availableProviders: IParseMeetingSummaryActionActionInputParseMeetingSummaryActionActionInputAvailableProvidersItemObject[];
  /** List of all request types with their IDs and names  */
  availableRequestTypes: IParseMeetingSummaryActionActionInputParseMeetingSummaryActionActionInputAvailableRequestTypesItemObject[];
  /** List of valid track keys (Hebrew strings) that can be used in the tracks object  */
  availableTrackKeys: string[];
  /** List of all clients for name/ID matching  */
  allClients: IParseMeetingSummaryActionActionInputParseMeetingSummaryActionActionInputAllClientsItemObject[];
}

/**
 * undefined
 */
export interface IParseMeetingSummaryActionActionOutputClientUpdatesObject {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  national_id?: string;
}

/**
 * undefined
 */
export interface IParseMeetingSummaryActionActionOutputTracksObject {}

/**
 * Map of field name to Hebrew explanation of why it is missing or unclear
 */
export interface IParseMeetingSummaryActionActionOutputMissingFieldsObject {}

/**
 * undefined
 */
export interface IParseMeetingSummaryActionActionOutputParseMeetingSummaryActionActionOutputRequestsItemObject {
  providerId?: any;
  providerName?: string;
  requestTypeId?: any;
  requestTypeName?: string;
  managementFee?: any;
  transferType?: string;
  choiceDuration?: string;
  kerenName?: string;
  transferAmount?: string;
  tracks?: IParseMeetingSummaryActionActionOutputTracksObject;
  /** Exact quote from the summary that triggered this request  */
  sourceQuote?: string;
  /** Map of field name to Hebrew explanation of why it is missing or unclear  */
  missingFields?: IParseMeetingSummaryActionActionOutputMissingFieldsObject;
}

/**
 * ParseMeetingSummaryAction output payload
 */
export interface IParseMeetingSummaryActionActionOutput {
  clientId?: any;
  meetingDate?: string;
  meetingNotes?: string;
  clientUpdates?: IParseMeetingSummaryActionActionOutputClientUpdatesObject;
  requests?: IParseMeetingSummaryActionActionOutputParseMeetingSummaryActionActionOutputRequestsItemObject[];
}

/**
 * ParseMeetingSummaryActionAction
 * Receives a Hebrew meeting summary text and uses AI to parse it into structured meeting data. Returns a JSON object with meetingDate, meetingNotes, clientUpdates (personal info fields), clientId (resolved from clients list if name/ID found), and requests array (each with resolved providerId, requestTypeId, managementFee, transferType, choiceDuration, kerenName, transferAmount, tracks, sourceQuote, and missingFields). Designed to pre-fill the NewMeetingWizard UI.
 */
export const ParseMeetingSummaryActionAction = {
  actionBlockId: "69fda98c5dcc712d87bb250a",

  inputInstanceType: {} as IParseMeetingSummaryActionActionInput,
  outputInstanceType: {} as IParseMeetingSummaryActionActionOutput,
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
  /** The scheduled date and time of the meeting. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  date?: string;
  /** Array of request IDs associated with this meeting  */
  requests?: string[];
  /** The insurance agent conducting the meeting  */
  agentId?: string;
  /** The client attending the meeting  */
  clientId?: string;
  /** Current status of the meeting  */
  status?: ParseMeetingSummaryAndCreateActionOutputStatusEnum;
  /** Optional notes or comments about the meeting, such as discussion points, outcomes, or follow-up items  */
  notes?: string;
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

/**
 * Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request
 */
export interface IProcessRequestFormsActionOutputTracksObject {}

export type ProcessRequestFormsActionOutputChoiceDurationEnum =
  | ""
  | "6"
  | "12"
  | "24";

export type ProcessRequestFormsActionOutputTransferTypeEnum =
  | ""
  | "צבירה והפקדות"
  | "צבירה בלבד"
  | "הפקדות בלבד";

export type ProcessRequestFormsActionOutputKerenNameEnum =
  | ""
  | "כללי"
  | "אומגה";

export type ProcessRequestFormsActionOutputStandingEnum =
  | "שכיר"
  | "עצמאי"
  | "שכיר בעל שליטה"
  | "עצמאי באמצעות מעסיק"
  | "חבר קיבוץ";

export type ProcessRequestFormsActionOutputAccountTypeEnum = "פרטי" | "עסקי";

export type ProcessRequestFormsActionOutputChargeDayEnum =
  | "1"
  | "5"
  | "10"
  | "15"
  | "20"
  | "25";

export type ProcessRequestFormsActionOutputIndependentTransferTypeEnum =
  | "הוראת קבע"
  | "הפקדה חד פעמית";

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
  /** Current processing status of the request  */
  status?: ProcessRequestFormsActionOutputStatusEnum;
  /** Reference to the request scheme type from RequestSchemes table  */
  requestTypeId?: string;
  /** Reference to the insurance agent handling this request from Agents table  */
  agentId?: string;
  /** Reference to the client submitting this request from Clients table  */
  clientId?: string;
  /** Array of processed form documents with their URL links  */
  forms?: IProcessRequestFormsActionOutputProcessRequestFormsActionOutputFormsItemObject[];
  /** Reference to the healthcare provider associated with this request from Providers table  */
  providerId?: string;
  /** Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request  */
  tracks?: IProcessRequestFormsActionOutputTracksObject;
  /** Reference to a specific insurance fund from the Funds table associated with this request  */
  fundId?: string;
  /** Management fee deposit (דמי ניהול מהפקדה) associated with this insurance request, representing the fee percentage charged on deposits for managing the fund  */
  managementFee?: number;
  /** תקופת בחירה בחודשים - the duration of the choice period in months for this insurance request  */
  choiceDuration?: ProcessRequestFormsActionOutputChoiceDurationEnum;
  /** סוג העברה - the type of transfer for this insurance request: accumulation and deposits, accumulation only, or deposits only  */
  transferType?: ProcessRequestFormsActionOutputTransferTypeEnum;
  /** The name of the keren (fund) associated with this request. Optional enum field with values: כללי (Klali) or אומגה (Omega). Empty string means no keren selected.  */
  kerenName?: ProcessRequestFormsActionOutputKerenNameEnum;
  /** The transfer amount (יתרת העברה) for the insurance request, stored as a string to support formatted values  */
  transferAmount?: string;
  /** Indicates whether the transfer amount is the full/total amount. True means transfer all funds, false or null means partial or unspecified transfer amount.  */
  isTotalTransfer?: boolean;
  /** True when the request was created directly from the client profile page (standalone request), false or null when created as part of a meeting wizard flow.  */
  isStandalone?: boolean;
  /** מעמד - the standing/status classification of the request, e.g. שכיר, עצמאי, or other relevant standing values  */
  standing?: ProcessRequestFormsActionOutputStandingEnum;
  /** Management fee accumulation (דמי ניהול מצבירה) associated with this insurance request, representing the fee percentage charged on accumulated funds  */
  managementFeeAccumulation?: number;
  /** סוג חשבון - the account type for this insurance request. פרטי means personal account, עסקי means business account.  */
  accountType?: ProcessRequestFormsActionOutputAccountTypeEnum;
  /** מועד חיוב - the charge day of the month for this insurance request. Enum values represent the day of the month on which the charge is made.  */
  chargeDay?: ProcessRequestFormsActionOutputChargeDayEnum;
  /** Type of independent transfer for the insurance request. Either 'הוראת קבע' (standing order) or 'הפקדה חד פעמית' (one-time deposit).  */
  independentTransferType?: ProcessRequestFormsActionOutputIndependentTransferTypeEnum;
  /** The amount for the independent transfer in the insurance request. Stored as a string to support various formats.  */
  independentTransferAmount?: string;
  /** ניוד חלקי - indicates whether this request involves a partial transfer of funds  */
  isPartialTransfer?: boolean;
  /** סכום ניוד חלקי - the amount for a partial transfer in the insurance request  */
  partialTransferAmount?: number;
  /** סכום הפקדה חד פעמית - the amount for a one-time deposit transfer in the insurance request  */
  oneTimeTransferAmount?: number;
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
  /** Reference to the Requests table record this signature request belongs to  */
  requestId?: string;
  /** Reference to the Clients table record — the signer  */
  clientId?: string;
  /** Reference to the Forms table record (form template) that was sent for signature  */
  formId?: string;
  /** Current status of the signature request: pending (awaiting signature), signed (completed), declined (signer declined), cancelled  */
  status?: SendAllFormsForSignatureDocuSealActionOutputStatusEnum;
  /** The URL of the filled PDF that was sent for signature  */
  formPdfUrl?: string;
  /** Timestamp when the signature request was sent to the client. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  sentAt?: string;
  /** Title of the form that was sent for signature, stored for display purposes  */
  formTitle?: string;
  /** Reference to the Meetings table record this signature request is associated with. Nullable.  */
  meetingId?: string;
  /** The Docuseal submission ID for this signature request (integer).  */
  docusealSubmissionId?: number;
  /** The Docuseal merged template ID used for this signature request (integer).  */
  docusealMergedTemplateId?: number;
  /** The Docuseal submitter ID for the agent signer (integer).  */
  agentSubmitterId?: number;
  /** The Docuseal submitter ID for the client signer (integer).  */
  clientSubmitterId?: number;
  /** The embed source URL for the agent to sign the document via Docuseal.  */
  agentEmbedSrc?: string;
  /** The embed source URL for the client to sign the document via Docuseal.  */
  clientEmbedSrc?: string;
  /** Timestamp when the agent signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  agentSignedAt?: string;
  /** Timestamp when the client signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  clientSignedAt?: string;
  /** Timestamp when the signature request was fully completed (all parties signed). Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  completedAt?: string;
  /** Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.  */
  formMapping?: ISendAllFormsForSignatureDocuSealActionOutputFormMappingObject;
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
 * SendClientIntakeForm input payload
 */
export interface ISendClientIntakeFormActionInput {
  /** Optional existing client ID. If provided, the form will be pre-filled with client data.  */
  clientId?: string;
  /** Email of the agent sending the form  */
  agentEmail: string;
  /** Display name of the recipient for personalization  */
  recipientName: string;
  /** Email address of the recipient  */
  recipientEmail: string;
  /** Phone number of the recipient in E.164 format (e.g. +972501234567)  */
  recipientPhone: string;
}

/**
 * SendClientIntakeForm output payload
 */
export interface ISendClientIntakeFormActionOutput {
  /** The unique token value  */
  token?: string;
  /** The full URL of the form sent to the client  */
  formUrl?: string;
  /** Status message  */
  message?: string;
  /** Whether the form was sent successfully  */
  success?: boolean;
  /** The ID of the created token record  */
  tokenId?: string;
}

/**
 * SendClientIntakeFormAction
 * Execute code action
 */
export const SendClientIntakeFormAction = {
  actionBlockId: "6a1abd0f3702184f08216aea",

  inputInstanceType: {} as ISendClientIntakeFormActionInput,
  outputInstanceType: {} as ISendClientIntakeFormActionOutput,
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
  /** The email body text (plain text, will be wrapped in HTML)  */
  body: string;
  /** The email subject line  */
  subject: string;
  /** Optional client ID (kept for backward compatibility, no longer used for CC)  */
  clientId?: string;
  /** The ID of the request to update status to 'נשלח ליצרן' after sending  */
  requestId?: string;
  /** Array of signed document URLs to attach to the email as real file attachments  */
  attachmentUrls?: ISendCustomProviderEmailActionInputSendCustomProviderEmailActionInputAttachmentUrlsItemObject[];
  /** The email address of the provider/יצרן to send the documents to  */
  recipientEmail: string;
}

export type SendCustomProviderEmailActionOutputStatusEnum =
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
export interface ISendCustomProviderEmailActionOutputSendCustomProviderEmailActionOutputFormsItemObject {
  /** Reference to the form template used  */
  formId?: string;
  /** URL link to the processed/filled form PDF  */
  url: string;
  /** ISO timestamp when the form was processed  */
  processedAt?: string;
}

/**
 * Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request
 */
export interface ISendCustomProviderEmailActionOutputTracksObject {}

export type SendCustomProviderEmailActionOutputChoiceDurationEnum =
  | ""
  | "6"
  | "12"
  | "24";

export type SendCustomProviderEmailActionOutputTransferTypeEnum =
  | ""
  | "צבירה והפקדות"
  | "צבירה בלבד"
  | "הפקדות בלבד";

export type SendCustomProviderEmailActionOutputKerenNameEnum =
  | ""
  | "כללי"
  | "אומגה";

export type SendCustomProviderEmailActionOutputStandingEnum =
  | "שכיר"
  | "עצמאי"
  | "שכיר בעל שליטה"
  | "עצמאי באמצעות מעסיק"
  | "חבר קיבוץ";

export type SendCustomProviderEmailActionOutputAccountTypeEnum =
  | "פרטי"
  | "עסקי";

export type SendCustomProviderEmailActionOutputChargeDayEnum =
  | "1"
  | "5"
  | "10"
  | "15"
  | "20"
  | "25";

export type SendCustomProviderEmailActionOutputIndependentTransferTypeEnum =
  | "הוראת קבע"
  | "הפקדה חד פעמית";

/**
 * The item updated in the table, keys are the column names, values are the column values
 */
export interface ISendCustomProviderEmailActionOutputSendCustomProviderEmailActionOutputItemsItemObject {
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
  /** Current processing status of the request  */
  status?: SendCustomProviderEmailActionOutputStatusEnum;
  /** Reference to the request scheme type from RequestSchemes table  */
  requestTypeId?: string;
  /** Reference to the insurance agent handling this request from Agents table  */
  agentId?: string;
  /** Reference to the client submitting this request from Clients table  */
  clientId?: string;
  /** Array of processed form documents with their URL links  */
  forms?: ISendCustomProviderEmailActionOutputSendCustomProviderEmailActionOutputFormsItemObject[];
  /** Reference to the healthcare provider associated with this request from Providers table  */
  providerId?: string;
  /** Dynamic tracks/מסלולים object structure from the request scheme, stores the track field values for this request  */
  tracks?: ISendCustomProviderEmailActionOutputTracksObject;
  /** Reference to a specific insurance fund from the Funds table associated with this request  */
  fundId?: string;
  /** Management fee deposit (דמי ניהול מהפקדה) associated with this insurance request, representing the fee percentage charged on deposits for managing the fund  */
  managementFee?: number;
  /** תקופת בחירה בחודשים - the duration of the choice period in months for this insurance request  */
  choiceDuration?: SendCustomProviderEmailActionOutputChoiceDurationEnum;
  /** סוג העברה - the type of transfer for this insurance request: accumulation and deposits, accumulation only, or deposits only  */
  transferType?: SendCustomProviderEmailActionOutputTransferTypeEnum;
  /** The name of the keren (fund) associated with this request. Optional enum field with values: כללי (Klali) or אומגה (Omega). Empty string means no keren selected.  */
  kerenName?: SendCustomProviderEmailActionOutputKerenNameEnum;
  /** The transfer amount (יתרת העברה) for the insurance request, stored as a string to support formatted values  */
  transferAmount?: string;
  /** Indicates whether the transfer amount is the full/total amount. True means transfer all funds, false or null means partial or unspecified transfer amount.  */
  isTotalTransfer?: boolean;
  /** True when the request was created directly from the client profile page (standalone request), false or null when created as part of a meeting wizard flow.  */
  isStandalone?: boolean;
  /** מעמד - the standing/status classification of the request, e.g. שכיר, עצמאי, or other relevant standing values  */
  standing?: SendCustomProviderEmailActionOutputStandingEnum;
  /** Management fee accumulation (דמי ניהול מצבירה) associated with this insurance request, representing the fee percentage charged on accumulated funds  */
  managementFeeAccumulation?: number;
  /** סוג חשבון - the account type for this insurance request. פרטי means personal account, עסקי means business account.  */
  accountType?: SendCustomProviderEmailActionOutputAccountTypeEnum;
  /** מועד חיוב - the charge day of the month for this insurance request. Enum values represent the day of the month on which the charge is made.  */
  chargeDay?: SendCustomProviderEmailActionOutputChargeDayEnum;
  /** Type of independent transfer for the insurance request. Either 'הוראת קבע' (standing order) or 'הפקדה חד פעמית' (one-time deposit).  */
  independentTransferType?: SendCustomProviderEmailActionOutputIndependentTransferTypeEnum;
  /** The amount for the independent transfer in the insurance request. Stored as a string to support various formats.  */
  independentTransferAmount?: string;
  /** ניוד חלקי - indicates whether this request involves a partial transfer of funds  */
  isPartialTransfer?: boolean;
  /** סכום ניוד חלקי - the amount for a partial transfer in the insurance request  */
  partialTransferAmount?: number;
  /** סכום הפקדה חד פעמית - the amount for a one-time deposit transfer in the insurance request  */
  oneTimeTransferAmount?: number;
}

/**
 * SendCustomProviderEmail output payload
 */
export interface ISendCustomProviderEmailActionOutput {
  /** The items updated in the table  */
  items: ISendCustomProviderEmailActionOutputSendCustomProviderEmailActionOutputItemsItemObject[];
}

/**
 * SendCustomProviderEmailAction
 * Sends a fully customizable email to a provider/יצרן with custom subject, body, and signed document attachments as real file attachments. After sending, updates the request status to 'נשלח ליצרן'. Used when the agent wants to send signed documents to a provider with a custom message.
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
  /** Reference to the Requests table record this signature request belongs to  */
  requestId?: string;
  /** Reference to the Clients table record — the signer  */
  clientId?: string;
  /** Reference to the Forms table record (form template) that was sent for signature  */
  formId?: string;
  /** Current status of the signature request: pending (awaiting signature), signed (completed), declined (signer declined), cancelled  */
  status?: SendMeetingFormsForSignatureActionOutputStatusEnum;
  /** The URL of the filled PDF that was sent for signature  */
  formPdfUrl?: string;
  /** Timestamp when the signature request was sent to the client. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  sentAt?: string;
  /** Title of the form that was sent for signature, stored for display purposes  */
  formTitle?: string;
  /** Reference to the Meetings table record this signature request is associated with. Nullable.  */
  meetingId?: string;
  /** The Docuseal submission ID for this signature request (integer).  */
  docusealSubmissionId?: number;
  /** The Docuseal merged template ID used for this signature request (integer).  */
  docusealMergedTemplateId?: number;
  /** The Docuseal submitter ID for the agent signer (integer).  */
  agentSubmitterId?: number;
  /** The Docuseal submitter ID for the client signer (integer).  */
  clientSubmitterId?: number;
  /** The embed source URL for the agent to sign the document via Docuseal.  */
  agentEmbedSrc?: string;
  /** The embed source URL for the client to sign the document via Docuseal.  */
  clientEmbedSrc?: string;
  /** Timestamp when the agent signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  agentSignedAt?: string;
  /** Timestamp when the client signed the document. Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  clientSignedAt?: string;
  /** Timestamp when the signature request was fully completed (all parties signed). Nullable.. ISO 8601 datetime string, format: YYYY-MM-DDTHH:MM:SS, e.g. 2025-09-30T18:45:00Z, 2025-09-30T18:45:00+05:30  */
  completedAt?: string;
  /** Array of form-to-request mappings for meeting-level submissions. Each entry contains formId, requestId, and formIndex (0-based position in the merged DocuSeal submission). Used by the webhook to save each signed document back to its correct request.  */
  formMapping?: ISendMeetingFormsForSignatureActionOutputFormMappingObject;
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
 * Sends ALL filled forms from ALL requests in a meeting as ONE single DocuSeal envelope. Fetches the meeting, then for each request fetches its forms. Fetches form details to get real form titles. Builds a clientContext from the first request (for evaluating signature field conditions). Creates one DocuSeal template per form (via CreateDocuSealTemplateForForm, passing clientContext), merges ALL templates into one combined template, creates ONE submission with client+agent signers, then saves ONE SignatureRequest row PER REQUEST using forEach (each with its own requestId), all sharing the same DocuSeal submission and formMapping.
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

/**
 * All form fields submitted by the client
 */
export interface ISubmitClientIntakeFormActionInputFormDataObject {}

/**
 * SubmitClientIntakeForm input payload
 */
export interface ISubmitClientIntakeFormActionInput {
  /** The unique token from the form URL  */
  token: string;
  /** All form fields submitted by the client  */
  formData: ISubmitClientIntakeFormActionInputFormDataObject;
  /** URL of the uploaded back side of the ID card  */
  idBackUrl?: string;
  /** URL of the uploaded front side of the ID card  */
  idFrontUrl?: string;
  /** URL of the uploaded ID appendix (ספח)  */
  idAppendixUrl?: string;
}

/**
 * SubmitClientIntakeForm output payload
 */
export interface ISubmitClientIntakeFormActionOutput {
  /** Error message if submission failed  */
  error?: string;
  /** Status message  */
  message?: string;
  /** Whether the submission was successful  */
  success?: boolean;
  /** The ID of the created or updated client  */
  clientId?: string;
  /** True if a new client was created, false if existing client was updated  */
  isNewClient?: boolean;
}

/**
 * SubmitClientIntakeFormAction
 * Execute code action
 */
export const SubmitClientIntakeFormAction = {
  actionBlockId: "6a1abd0f3702184f08216af3",

  inputInstanceType: {} as ISubmitClientIntakeFormActionInput,
  outputInstanceType: {} as ISubmitClientIntakeFormActionOutput,
} as const;

export type SyncRoetoClientsActionInputSyncModeEnum =
  | "active"
  | "tromYeutz"
  | "all";

/**
 * SyncRoetoClients input payload
 */
export interface ISyncRoetoClientsActionInput {
  /** Which client types to sync: active, tromYeutz, or all (default: "all") */
  syncMode?: SyncRoetoClientsActionInputSyncModeEnum;
}

/**
 * SyncRoetoClients output payload
 */
export interface ISyncRoetoClientsActionOutput {
  /** List of error messages  */
  errors?: string[];
  /** success or error  */
  status?: string;
  /** Summary message  */
  message?: string;
  /** Total number of clients synced (created + updated)  */
  syncedCount?: number;
  /** Number of new clients created  */
  createdCount?: number;
  /** Number of clients skipped  */
  skippedCount?: number;
  /** Number of existing clients updated  */
  updatedCount?: number;
}

/**
 * SyncRoetoClientsAction
 * Execute code action
 */
export const SyncRoetoClientsAction = {
  actionBlockId: "69ede6b3f00bb8e7d9cec47e",

  inputInstanceType: {} as ISyncRoetoClientsActionInput,
  outputInstanceType: {} as ISyncRoetoClientsActionOutput,
} as const;

export type SyncSingleClientActionInputClientStatusEnum = "פעיל" | "טרום יעוץ";

/**
 * SyncSingleClient input payload
 */
export interface ISyncSingleClientActionInput {
  /** The client's 9-digit Israeli personal ID number  */
  userID: string;
  /** The client's status - determines which portfolio endpoint to call  */
  clientStatus: SyncSingleClientActionInputClientStatusEnum;
}

/**
 * SyncSingleClient output payload
 */
export interface ISyncSingleClientActionOutput {
  /** List of error messages  */
  errors?: string[];
  /** success or error  */
  status?: string;
  /** Summary message  */
  message?: string;
  /** Whether the client record was updated  */
  clientUpdated?: boolean;
  /** Number of fund records created or updated  */
  fundsUpserted?: number;
}

/**
 * SyncSingleClientAction
 * Execute code action
 */
export const SyncSingleClientAction = {
  actionBlockId: "69ef6053cb086eeb0de18672",

  inputInstanceType: {} as ISyncSingleClientActionInput,
  outputInstanceType: {} as ISyncSingleClientActionOutput,
} as const;

/**
 * TestRoetoConnection input payload
 */
export interface ITestRoetoConnectionActionInput {}

/**
 * TestRoetoConnection output payload
 */
export interface ITestRoetoConnectionActionOutput {
  /** success or error  */
  status?: string;
  /** Summary message  */
  message?: string;
  /** List of Roeto _id values for all active clients  */
  clientIds?: string[];
  /** Total number of agents fetched  */
  agentCount?: number;
  /** Total number of unique active clients found  */
  clientCount?: number;
}

/**
 * TestRoetoConnectionAction
 * Execute code action
 */
export const TestRoetoConnectionAction = {
  actionBlockId: "69ee05df10b251ac6e219afa",

  inputInstanceType: {} as ITestRoetoConnectionActionInput,
  outputInstanceType: {} as ITestRoetoConnectionActionOutput,
} as const;

/**
 * TranscribeAudioWithWhisper input payload
 */
export interface ITranscribeAudioWithWhisperActionInput {
  /** URL of the uploaded audio file to transcribe  */
  audioFileUrl: string;
}

/**
 * TranscribeAudioWithWhisper output payload
 */
export interface ITranscribeAudioWithWhisperActionOutput {
  /** The transcribed text in Hebrew  */
  text?: string;
  /** Error message if transcription failed  */
  error?: string;
  /** Whether transcription was successful  */
  success?: boolean;
}

/**
 * TranscribeAudioWithWhisperAction
 * Execute code action
 */
export const TranscribeAudioWithWhisperAction = {
  actionBlockId: "6a3835f710e19a1ab822510e",

  inputInstanceType: {} as ITranscribeAudioWithWhisperActionInput,
  outputInstanceType: {} as ITranscribeAudioWithWhisperActionOutput,
} as const;

export const NicoAgent = {
  id: "69db99a87d23f0bc9a294e93",
  name: "Nico",
  title: "",
  harness: undefined,
  photoUrl:
    "https://res.cloudinary.com/blocksws/image/upload/Blocks/app-agents/Nico/Nico_image.png",
  avatarUrl:
    "https://res.cloudinary.com/blocksws/image/upload/Blocks/app-agents/Nico/Nico_avatar.png",
} as const;
