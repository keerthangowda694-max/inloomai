import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  BookOpen,
  ArrowRight,
  Edit3,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import {
  apiGetSubmissionById,
  apiGetFindingsBySubmission,
  apiReviewFinding
} from '../../api/client';
import { Submission, Finding, Severity, FindingCategory, EvidenceStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface FindingsWorkspaceProps {
  initialSubmissionId?: number;
  onNavigateOverview: () => void;
}

export const FindingsWorkspace: React.FC<FindingsWorkspaceProps> = ({
  initialSubmissionId = 1,
  onNavigateOverview,
}) => {
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFindingId, setSelectedFindingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Edit Correction state
  const [isEditingCorrection, setIsEditingCorrection] = useState(false);
  const [customCorrection, setCustomCorrection] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async (subId: number) => {
    setLoading(true);
    setError(null);
    try {
      const sub = await apiGetSubmissionById(subId);
      setSubmission(sub);
      const fList = await apiGetFindingsBySubmission(subId);
      setFindings(fList);
      if (fList.length > 0) {
        setSelectedFindingId(fList[0].id);
        setCustomCorrection(fList[0].suggestedCorrection || '');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load submission findings from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(initialSubmissionId);
  }, [initialSubmissionId]);

  const selectedFinding = findings.find((f) => f.id === selectedFindingId) || findings[0];

  useEffect(() => {
    if (selectedFinding) {
      setCustomCorrection(selectedFinding.suggestedCorrection || '');
      setIsEditingCorrection(false);
      setReviewNotes('');
    }
  }, [selectedFindingId]);

  const handleReviewAction = async (decision: 'ACCEPT' | 'REJECT' | 'EDIT' | 'REVISE') => {
    if (!selectedFinding) return;
    setActionLoading(true);
    try {
      const updated = await apiReviewFinding(selectedFinding.id, {
        decision,
        finalCorrection: decision === 'EDIT' ? customCorrection : undefined,
        notes: reviewNotes || `Decision: ${decision} executed via Findings Workspace`,
      });

      // Update in local state
      const nextFindings = findings.map((f) => (f.id === updated.id ? updated : f));
      setFindings(nextFindings);

      // Check if all findings are resolved
      const allResolved = nextFindings.every((f) => f.status !== 'PENDING');
      if (allResolved) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#635BFF', '#A99BFF', '#10B981'],
        });
        if (submission) {
          setSubmission({ ...submission, status: 'APPROVED' });
        }
      }

      setIsEditingCorrection(false);
    } catch (err: any) {
      alert(`Action error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFindings = findings.filter((f) => {
    if (filterSeverity !== 'ALL' && f.severity !== filterSeverity) return false;
    if (filterCategory !== 'ALL' && f.category !== filterCategory) return false;
    return true;
  });

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-coral/20 text-coral border border-coral/30">CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber/20 text-amber border border-amber/30">WARNING</span>;
      case 'INFO':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo/20 text-lavender border border-indigo/30">INFO</span>;
    }
  };

  const getEvidenceBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED_EVIDENCE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-mint/15 text-mint border border-mint/40 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Verified Evidence</span>;
      case 'MISSING_EVIDENCE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-coolwhite border border-white/20 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber" /> Missing Evidence</span>;
      case 'CONFLICTING_EVIDENCE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber/20 text-amber border border-amber/30 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Conflicting Sources</span>;
      case 'EXPIRED_SOURCE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-coral/20 text-coral border border-coral/30 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Expired Source</span>;
      case 'AI_ASSISTED_PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo/20 text-electric-lavender border border-indigo/40 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Suggestion</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-muted animate-pulse">
        Loading document findings and verified evidence from MySQL...
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="p-8 rounded-2xl glass-panel text-center max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-amber mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Finding Not Found</h3>
        <p className="text-sm text-muted mb-6">{error || 'No submission found.'}</p>
        <button
          onClick={onNavigateOverview}
          className="px-6 py-2.5 rounded-xl bg-indigo text-white text-xs font-bold"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-lavender uppercase font-semibold">
              FINDINGS WORKSPACE
            </span>
            <span className="text-xs font-mono text-muted">•</span>
            <span className="text-xs font-mono text-muted">{submission.title}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Split-Pane Evidence Review
          </h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span className="text-muted">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-navy">ALL</option>
              <option value="CRITICAL" className="bg-navy">CRITICAL</option>
              <option value="WARNING" className="bg-navy">WARNING</option>
              <option value="INFO" className="bg-navy">INFO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Split Pane Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Pane: Submitted Document & Findings Navigator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Document Content View */}
          <div className="rounded-2xl glass-panel p-5 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span className="uppercase">Submitted Candidate Copy</span>
              <span>{submission.wordCount} words</span>
            </div>
            <div className="p-4 rounded-xl bg-obsidian/70 border border-white/5 text-sm font-sans leading-relaxed text-coolwhite/90 max-h-60 overflow-y-auto">
              {submission.extractedText || submission.rawContent}
            </div>
          </div>

          {/* Findings Navigator List */}
          <div className="rounded-2xl glass-panel p-4 border border-white/5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-mono uppercase text-muted font-semibold">
                Identified Findings ({filteredFindings.length})
              </span>
              <span className="text-[10px] font-mono text-muted">Click to inspect</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {filteredFindings.map((f) => {
                const isSelected = f.id === selectedFinding?.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFindingId(f.id)}
                    className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-indigo bg-indigo/15 shadow-glow-indigo/20'
                        : 'border-white/5 hover:border-white/15 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(f.severity)}
                        <span className="text-[11px] font-mono uppercase text-muted">
                          {f.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${
                        f.status === 'ACCEPTED' ? 'text-mint' :
                        f.status === 'REJECTED' ? 'text-coral' :
                        f.status === 'MODIFIED' ? 'text-lavender' :
                        'text-amber'
                      }`}>
                        {f.status}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-white truncate mb-1">
                      "{f.claimExcerpt}"
                    </p>
                    <p className="text-[11px] text-muted line-clamp-1">{f.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Pane: Authoritative Approved Source & Review Decisions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {selectedFinding ? (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 flex-1 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(selectedFinding.severity)}
                    {getEvidenceBadge(selectedFinding.evidenceStatus)}
                  </div>
                  <span className="text-xs font-mono text-muted">
                    FINDING #{selectedFinding.id}
                  </span>
                </div>

                {/* Claim Excerpt Highlight */}
                <div className="p-4 rounded-2xl bg-coral/10 border border-coral/30">
                  <span className="text-[10px] font-mono uppercase text-coral font-bold block mb-1">
                    Problematic Document Claim
                  </span>
                  <p className="text-base text-white font-semibold">
                    "{selectedFinding.claimExcerpt}"
                  </p>
                </div>

                {/* Finding Explanation */}
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase text-muted">Governance Diagnosis</span>
                  <p className="text-sm text-coolwhite/90 leading-relaxed font-normal">
                    {selectedFinding.explanation}
                  </p>
                </div>

                {/* Authoritative Approved Source Evidence Card */}
                <div className="p-5 rounded-2xl bg-obsidian/80 border border-mint/40 shadow-glow-mint/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-mint font-bold flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Authoritative Approved Source
                    </span>
                    <span className="text-[11px] font-mono text-muted">
                      {selectedFinding.sourceVersion || 'v3.0.0'}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white">
                    {selectedFinding.sourceTitle || 'Corporate Specification Document'}
                  </h4>

                  {selectedFinding.approvedSourceExcerpt && (
                    <blockquote className="p-3 rounded-xl bg-white/5 border-l-2 border-mint text-xs text-white/90 italic">
                      "{selectedFinding.approvedSourceExcerpt}"
                    </blockquote>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-muted border-t border-white/5 pt-2">
                    <span>Section: {selectedFinding.sourceSection || 'Section 2.1'}</span>
                    <span>Owner: {selectedFinding.sourceOwner || 'Elena Rostova'}</span>
                  </div>
                </div>

                {/* Suggested Brand-Compliant Correction */}
                <div className="p-4 rounded-2xl bg-navy/80 border border-indigo/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-lavender font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-electric-lavender" />
                      Suggested Correction
                    </span>
                    {!isEditingCorrection && (
                      <button
                        onClick={() => setIsEditingCorrection(true)}
                        className="text-xs text-muted hover:text-white font-mono flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Text
                      </button>
                    )}
                  </div>

                  {isEditingCorrection ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={customCorrection}
                        onChange={(e) => setCustomCorrection(e.target.value)}
                        className="w-full p-3 rounded-xl glass-input text-xs font-medium"
                      />
                      <button
                        onClick={() => setIsEditingCorrection(false)}
                        className="text-xs text-mint font-mono"
                      >
                        ✓ Done Editing
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-white">
                      "{customCorrection || selectedFinding.suggestedCorrection}"
                    </p>
                  )}
                </div>
              </div>

              {/* Reviewer Action Controls */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                <input
                  type="text"
                  placeholder="Optional decision note for MySQL audit trail..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted">DECISION:</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {selectedFinding.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleReviewAction('ACCEPT')}
                      className="px-4 py-2.5 rounded-xl bg-mint hover:bg-emerald-600 text-obsidian text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleReviewAction('EDIT')}
                      className="px-4 py-2.5 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Save Edit
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleReviewAction('REJECT')}
                      className="px-4 py-2.5 rounded-xl bg-coral/20 hover:bg-coral/30 text-coral text-xs font-semibold border border-coral/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleReviewAction('REVISE')}
                      className="px-4 py-2.5 rounded-xl glass-panel text-xs text-lavender font-mono hover:border-lavender transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Request Revision
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-muted font-mono text-sm glass-panel rounded-3xl">
              Select a finding from the left pane to view verified evidence citations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
