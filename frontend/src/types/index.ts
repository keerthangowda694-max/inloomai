export type UserRole = 'ADMIN' | 'SOURCE_OWNER' | 'REVIEWER' | 'CREATOR';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  description: string;
  userRole?: string;
}

export type SubmissionStatus =
  | 'SUBMITTED'
  | 'ANALYZING'
  | 'VALIDATED'
  | 'REVIEW_PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVISION_REQUESTED';

export interface Submission {
  id: number;
  workspaceId: number;
  title: string;
  contentType: 'TEXT_PASTE' | 'PDF_UPLOAD';
  rawContent: string;
  extractedText: string;
  wordCount: number;
  characterCount: number;
  originalFileName?: string;
  status: SubmissionStatus;
  findingCount: number;
  criticalCount: number;
  warningCount: number;
  submittedByName?: string;
  submittedByEmail?: string;
  createdAt: string;
  updatedAt?: string;
}

export type FindingCategory =
  | 'TERMINOLOGY'
  | 'PROHIBITED'
  | 'CLAIM_MISMATCH'
  | 'MISSING_EVIDENCE'
  | 'SOURCE_EXPIRED'
  | 'CONFLICTING_SOURCES'
  | 'TONE_STYLE';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';

export type EvidenceStatus =
  | 'VERIFIED_EVIDENCE'
  | 'MISSING_EVIDENCE'
  | 'CONFLICTING_EVIDENCE'
  | 'EXPIRED_SOURCE'
  | 'AI_ASSISTED_PENDING';

export type FindingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'MODIFIED';

export interface Finding {
  id: number;
  submissionId: number;
  ruleId?: number;
  sourceDocumentId?: number;
  category: FindingCategory;
  severity: Severity;
  claimExcerpt: string;
  startIndex: number;
  endIndex: number;
  explanation: string;
  approvedSourceExcerpt?: string;
  suggestedCorrection?: string;
  evidenceStatus: EvidenceStatus;
  status: FindingStatus;
  reviewerComment?: string;
  createdAt: string;

  sourceTitle?: string;
  sourceVersion?: string;
  sourceSection?: string;
  sourceOwner?: string;
  sourceExpired?: boolean;
}

export interface ReviewDecisionRequest {
  decision: 'ACCEPT' | 'REJECT' | 'EDIT' | 'REVISE';
  finalCorrection?: string;
  notes?: string;
}

export interface SourceDocument {
  id?: number;
  workspaceId: number;
  title: string;
  section?: string;
  version: string;
  ownerName: string;
  contentExcerpt: string;
  fullText?: string;
  reviewDate?: string;
  expiryDate?: string;
  isArchived?: boolean;
  priority?: number;
  isExpired?: boolean;
  createdAt?: string;
}

export type RuleType =
  | 'PROHIBITED_PHRASE'
  | 'APPROVED_TERMINOLOGY'
  | 'NUMERICAL_BOUND'
  | 'TONE_STYLE';

export interface BrandRule {
  id?: number;
  workspaceId: number;
  ruleType: RuleType;
  targetPhrase: string;
  approvedAlternative?: string;
  contextGuideline?: string;
  severity: Severity;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType?: string;
  entityId?: number;
  details: string;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalSubmissions: number;
  pendingReviews: number;
  openFindings: number;
  highSeverityIssues: number;
  recentSubmissions: Submission[];
  findingsByCategory: Record<string, number>;
  recentAuditLogs: AuditLog[];
  systemHealth: string;
  aiAvailable: boolean;
}
