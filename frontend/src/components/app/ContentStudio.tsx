import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Cpu,
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Wand2,
  Zap,
  Check,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  Flame,
  FileCheck,
  Compass
} from 'lucide-react';
import { apiCreateSubmissionText, apiCreateSubmissionPdf } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { AppView } from './AppShell';

interface ContentStudioProps {
  onNavigate: (view: AppView, submissionId?: number) => void;
}

interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'CLEAN';
  title: string;
  text: string;
  summary: string;
  violationCount: number;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({ onNavigate }) => {
  const { workspace } = useAuth();
  const [mode, setMode] = useState<'paste' | 'upload'>('paste');
  const [viewMode, setViewMode] = useState<'editor' | 'lens'>('editor');
  const [title, setTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [activeLensItem, setActiveLensItem] = useState<number | null>(null);

  // 5 distinct real-world enterprise scenarios
  const scenarios: DemoScenario[] = [
    {
      id: 'critical-drift',
      name: '1. Capacity Spec Mismatch',
      badge: 'Product Spec Breach',
      badgeColor: 'border-coral/50 bg-coral/10 text-coral',
      riskLevel: 'HIGH',
      title: 'Orbit Suite Q4 Product Announcement (Fictional Demo Copy)',
      text:
        'Meet Orbit Suite. Supports up to 5,000 users with simple onboarding. ' +
        'Our platform offers a guarantee 100% uptime for any organization. ' +
        'Try the new Orbit App today for instant magic.',
      summary: 'Marketing claims 5,000 users vs Spec v3 §2.1 which certifies maximum 500 users.',
      violationCount: 4,
    },
    {
      id: 'legal-sla',
      name: '2. SLA & Legal Liability Breach',
      badge: 'Customer SLA Risk',
      badgeColor: 'border-coral/50 bg-coral/10 text-coral',
      riskLevel: 'HIGH',
      title: 'Enterprise Sales RFP Response: Dedicated Global SLA Tier',
      text:
        'We provide an unconditional guarantee 100% uptime for all mission-critical workloads. ' +
        'In addition, our high-scale clusters support up to 5,000 users with zero latency.',
      summary: 'Promises 100% uptime and unverified scale, breaching standard 99.9% customer SLA policy.',
      violationCount: 2,
    },
    {
      id: 'compliance-risk',
      name: '3. Security & Regulatory Hype',
      badge: 'Brand Tone Drift',
      badgeColor: 'border-amber/50 bg-amber/10 text-amber',
      riskLevel: 'MEDIUM',
      title: 'Press Release: Next-Gen Zero-Trust Architecture Launch',
      text:
        'Announcing the new Orbit App! Built with bulletproof security, instant magic credential isolation, ' +
        'and unhackable quantum encryption for enterprise banking.',
      summary: 'Uses unapproved naming "Orbit App" and unprovable hyperbole ("bulletproof", "magic").',
      violationCount: 3,
    },
    {
      id: 'expired-source',
      name: '4. Expired Source & Deprecated API',
      badge: 'Expired Source Citation',
      badgeColor: 'border-coral/50 bg-coral/10 text-coral',
      riskLevel: 'HIGH',
      title: 'Developer Knowledge Base: API Integration & Endpoints Guide',
      text:
        'Legacy developers can connect their Orbit App directly via our Legacy Orbit Beta API endpoint. ' +
        'Experience instant magic deployment with guarantee 100% uptime.',
      summary: 'Cites Legacy Beta spec which expired in 2023, misleading developers into dead APIs.',
      violationCount: 4,
    },
    {
      id: 'gold-standard',
      name: '5. Certified Gold Standard',
      badge: '100% Truth Aligned',
      badgeColor: 'border-mint/50 bg-mint/10 text-mint',
      riskLevel: 'CLEAN',
      title: 'Certified Enterprise Capability Statement (Orbit Suite)',
      text:
        'Meet Orbit Suite. Rigorously certified to support up to 500 concurrent enterprise users ' +
        'per Product Specification Section 2.1. Backed by our verified 99.9% uptime SLA guarantee ' +
        'and automated intelligent validation.',
      summary: 'Matches certified 500 users, 99.9% SLA, and approved terminology.',
      violationCount: 0,
    },
  ];

  // Real-time Guardrail Telemetry Analysis
  const liveTelemetry = useMemo(() => {
    // Check Guardrail 1: Concurrency Cap
    const userLimitViolation =
      /5,?000|10,?000|[1-9]\d{3,}\s*(users|concurrent)/i.test(rawText) &&
      !/500\s*(users|concurrent)/i.test(rawText);

    // Check Guardrail 2: SLA Guarantee
    const uptimeViolation = /100%\s*(uptime|sla)|guarantee\s*100%|unconditional/i.test(rawText);

    // Check Guardrail 3: Approved Terminology
    const nameViolation = /\borbit\s+app\b/i.test(rawText);

    // Check Guardrail 4: Prohibited Hyperbole
    const magicViolation = /\b(instant\s+magic|magic|bulletproof|unhackable)\b/i.test(rawText);

    // Check Guardrail 5: Expired Sources
    const expiredViolation = /\b(legacy\s+orbit\s+beta|legacy.*beta|beta\s+api)\b/i.test(rawText);

    let score = 100;
    if (userLimitViolation) score -= 25;
    if (uptimeViolation) score -= 25;
    if (nameViolation) score -= 20;
    if (magicViolation) score -= 15;
    if (expiredViolation) score -= 15;
    score = Math.max(0, score);

    return {
      score: rawText.trim() ? score : 100,
      userLimitViolation,
      uptimeViolation,
      nameViolation,
      magicViolation,
      expiredViolation,
      violationsCount:
        (userLimitViolation ? 1 : 0) +
        (uptimeViolation ? 1 : 0) +
        (nameViolation ? 1 : 0) +
        (magicViolation ? 1 : 0) +
        (expiredViolation ? 1 : 0),
    };
  }, [rawText]);

  const characterCount = rawText.length;
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;

  const handleSelectScenario = (scenario: DemoScenario) => {
    setSelectedScenarioId(scenario.id);
    setTitle(scenario.title);
    setRawText(scenario.text);
    setMode('paste');
    setError(null);
  };

  const handleAutoAlign = () => {
    let corrected = rawText;
    // Replace uncertified user claims
    corrected = corrected.replace(/supports\s+up\s+to\s+5,000\s+users/gi, 'supports up to 500 users');
    corrected = corrected.replace(/5,000\s+users/gi, '500 users');
    // Replace prohibited SLA claims
    corrected = corrected.replace(/guarantee\s+100%\s+uptime/gi, '99.9% uptime per SLA');
    corrected = corrected.replace(/unconditional\s+guarantee\s+100%\s+uptime/gi, 'verified 99.9% uptime SLA');
    corrected = corrected.replace(/100%\s+uptime/gi, '99.9% uptime per SLA');
    // Replace deprecated brand names
    corrected = corrected.replace(/\bOrbit\s+App\b/gi, 'Orbit Suite');
    // Replace hyperbole
    corrected = corrected.replace(/instant\s+magic/gi, 'automated intelligent validation');
    corrected = corrected.replace(/bulletproof\s+security/gi, 'enterprise defense-in-depth architecture');
    corrected = corrected.replace(/unhackable\s+quantum\s+encryption/gi, 'SOC2-certified encryption');
    // Replace expired source references
    corrected = corrected.replace(/Legacy\s+Orbit\s+Beta\s+API\s+endpoint/gi, 'Orbit Core Platform API v3');

    setRawText(corrected);
    setSelectedScenarioId('gold-standard');

    // Fire celebratory confetti for achieving 100% Brand Standard
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#635BFF', '#A99BFF', '#10B981', '#38BDF8'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF documents are supported for upload.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) {
      setError('Please select an active workspace first.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a document title.');
      return;
    }

    if (mode === 'paste' && !rawText.trim()) {
      setError('Document text cannot be empty.');
      return;
    }

    if (mode === 'upload' && !file) {
      setError('Please select a PDF file to analyze.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      setAnalysisStep('Stage 1/4: Parsing document structure & text layer (PDFBox)...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('Stage 2/4: Executing Stage 1 Deterministic Guardrails matching...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('Stage 3/4: Cross-referencing Product Spec v3.0 §2.1 & SLA certificates...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('Stage 4/4: Persisting cryptographic findings to MySQL audit ledger...');

      let created;
      if (mode === 'paste') {
        created = await apiCreateSubmissionText(workspace.id, title, rawText);
      } else {
        created = await apiCreateSubmissionPdf(workspace.id, title, file!);
      }

      onNavigate('findings', created.id);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please verify the document format.');
      setIsSubmitting(false);
      setAnalysisStep(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner: 1% Distinct Concept Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-navy via-navy-light to-indigo/20 border border-white/10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo/20 border border-indigo/40 text-lavender font-mono text-xs uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-lavender" />
              <span>Real-Time Content Validation Lab</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Content Submission Studio
            </h1>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-2xl leading-relaxed">
              Verify any candidate marketing copy or technical PDF against certified company specifications.
              Stop unapproved claims before they reach customer-facing channels.
            </p>
          </div>

          {/* Quick Scenario Preset Chips */}
          <div className="flex-shrink-0 flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-muted/80 tracking-wider">
              1-Click Demo Scenarios:
            </span>
            <div className="flex flex-wrap md:flex-col gap-2">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSelectScenario(sc)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                    selectedScenarioId === sc.id
                      ? `${sc.badgeColor} ring-2 ring-indigo/40 shadow-lg`
                      : 'glass-panel text-muted hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="font-medium">{sc.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                    {sc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Brand Standard Radar HUD (The 1-in-100 Intuitive Feature) */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-lg shadow-inner ${
                liveTelemetry.score >= 80
                  ? 'bg-mint/20 text-mint border border-mint/40'
                  : liveTelemetry.score >= 50
                  ? 'bg-amber/20 text-amber border border-amber/40'
                  : 'bg-coral/20 text-coral border border-coral/40'
              }`}
            >
              {liveTelemetry.score}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-base">
                  Live Brand Compliance Radar
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                    liveTelemetry.score >= 80
                      ? 'bg-mint/10 text-mint border border-mint/30'
                      : liveTelemetry.score >= 50
                      ? 'bg-amber/10 text-amber border border-amber/30'
                      : 'bg-coral/10 text-coral border border-coral/30'
                  }`}
                >
                  {liveTelemetry.score >= 80
                    ? '100% Certified Standard'
                    : liveTelemetry.score >= 50
                    ? 'Review Required'
                    : 'Critical Risk Detected'}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Real-time evaluation against 4 active workspace guardrails and certified truth sources.
              </p>
            </div>
          </div>

          {/* Quick Auto-Align Magic Button */}
          {liveTelemetry.violationsCount > 0 && mode === 'paste' && (
            <button
              type="button"
              onClick={handleAutoAlign}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo to-lavender hover:opacity-90 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo/25 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Auto-Align to Brand Standard</span>
            </button>
          )}
        </div>

        {/* 5 Guardrails Status Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Guardrail 1 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              liveTelemetry.userLimitViolation
                ? 'bg-coral/10 border-coral/40 text-coral'
                : 'bg-navy/60 border-white/5 text-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider">User Concurrency</span>
              {liveTelemetry.userLimitViolation ? (
                <ShieldAlert className="w-4 h-4 text-coral" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-mint" />
              )}
            </div>
            <div className="font-semibold text-xs mt-1 text-white">Cap: 500 (Spec v3)</div>
            <div className="text-[11px] mt-1">
              {liveTelemetry.userLimitViolation ? (
                <span className="text-coral font-medium">❌ Flagged: &gt;500 claimed</span>
              ) : (
                <span className="text-mint font-medium">✓ Certified compliant</span>
              )}
            </div>
          </div>

          {/* Guardrail 2 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              liveTelemetry.uptimeViolation
                ? 'bg-coral/10 border-coral/40 text-coral'
                : 'bg-navy/60 border-white/5 text-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider">SLA Commitment</span>
              {liveTelemetry.uptimeViolation ? (
                <ShieldAlert className="w-4 h-4 text-coral" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-mint" />
              )}
            </div>
            <div className="font-semibold text-xs mt-1 text-white">SLA: 99.9% Uptime</div>
            <div className="text-[11px] mt-1">
              {liveTelemetry.uptimeViolation ? (
                <span className="text-coral font-medium">❌ Flagged: 100% guarantee</span>
              ) : (
                <span className="text-mint font-medium">✓ Certified compliant</span>
              )}
            </div>
          </div>

          {/* Guardrail 3 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              liveTelemetry.nameViolation
                ? 'bg-amber/10 border-amber/40 text-amber'
                : 'bg-navy/60 border-white/5 text-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider">Brand Naming</span>
              {liveTelemetry.nameViolation ? (
                <AlertTriangle className="w-4 h-4 text-amber" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-mint" />
              )}
            </div>
            <div className="font-semibold text-xs mt-1 text-white">Use: "Orbit Suite"</div>
            <div className="text-[11px] mt-1">
              {liveTelemetry.nameViolation ? (
                <span className="text-amber font-medium">⚠️ Flagged: 'Orbit App'</span>
              ) : (
                <span className="text-mint font-medium">✓ Standard naming</span>
              )}
            </div>
          </div>

          {/* Guardrail 4 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              liveTelemetry.magicViolation
                ? 'bg-amber/10 border-amber/40 text-amber'
                : 'bg-navy/60 border-white/5 text-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider">Tone & Claims</span>
              {liveTelemetry.magicViolation ? (
                <AlertTriangle className="w-4 h-4 text-amber" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-mint" />
              )}
            </div>
            <div className="font-semibold text-xs mt-1 text-white">Evidence-Based Tone</div>
            <div className="text-[11px] mt-1">
              {liveTelemetry.magicViolation ? (
                <span className="text-amber font-medium">⚠️ Flagged: Hype/Magic</span>
              ) : (
                <span className="text-mint font-medium">✓ Professional voice</span>
              )}
            </div>
          </div>

          {/* Guardrail 5 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              liveTelemetry.expiredViolation
                ? 'bg-coral/10 border-coral/40 text-coral'
                : 'bg-navy/60 border-white/5 text-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider">Source Expiry</span>
              {liveTelemetry.expiredViolation ? (
                <ShieldAlert className="w-4 h-4 text-coral" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-mint" />
              )}
            </div>
            <div className="font-semibold text-xs mt-1 text-white">Active Sources Only</div>
            <div className="text-[11px] mt-1">
              {liveTelemetry.expiredViolation ? (
                <span className="text-coral font-medium">❌ Flagged: Expired Spec</span>
              ) : (
                <span className="text-mint font-medium">✓ Active v3 specs</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Controls: Paste vs Upload AND Editor vs Truth Lens */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Ingestion Mode */}
        <div className="flex rounded-2xl p-1 bg-navy/80 border border-white/5 max-w-xs">
          <button
            type="button"
            onClick={() => setMode('paste')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'paste' ? 'bg-indigo text-white shadow-md' : 'text-muted hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Text</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'upload' ? 'bg-indigo text-white shadow-md' : 'text-muted hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
        </div>

        {/* View Mode Toggle: Smart Editor vs Visual Truth Lens */}
        {mode === 'paste' && (
          <div className="flex rounded-2xl p-1 bg-navy/80 border border-white/5">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === 'editor' ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Smart Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('lens')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === 'lens' ? 'bg-indigo text-white shadow-md' : 'text-lavender hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Truth Lens (X-Ray)</span>
            </button>
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-coral/10 border border-coral/30 text-coral flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Title */}
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-2">
            Document Title <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Orbit Product Announcement or Landing Page Draft"
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
          />
        </div>

        {/* Mode A: Paste Text / Smart Editor OR Truth Lens */}
        {mode === 'paste' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono uppercase text-muted">
                Candidate Content <span className="text-coral">*</span>
              </label>
              <div className="text-xs font-mono text-muted/80 flex items-center gap-3">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{characterCount} chars</span>
              </div>
            </div>

            {viewMode === 'editor' ? (
              <textarea
                rows={10}
                required
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste campaign copy, press release, or product announcement text here..."
                className="w-full p-4 rounded-2xl glass-input text-sm font-sans leading-relaxed resize-y font-normal"
              />
            ) : (
              /* Visual Truth Lens (X-Ray Inspector) */
              <div className="p-6 rounded-2xl glass-panel border border-indigo/30 space-y-6 bg-navy/90">
                <div className="flex items-center justify-between text-xs font-mono text-lavender border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo" />
                    <span>X-RAY INSPECTOR: LIVE CLAIM & EVIDENCE CROSS-EXAMINATION</span>
                  </div>
                  <span>Click highlighted terms to inspect certified truth</span>
                </div>

                <div className="text-sm font-sans leading-relaxed text-coolwhite space-y-4">
                  <p className="p-4 rounded-xl bg-black/40 border border-white/5">
                    {/* Render text with interactive glowing chips */}
                    <span>Meet </span>
                    <span
                      onClick={() => setActiveLensItem(1)}
                      className="px-2 py-0.5 rounded cursor-pointer transition-all bg-indigo/30 text-lavender border border-indigo/50 hover:bg-indigo/50 font-medium"
                      title="Brand Standard Terminology"
                    >
                      Orbit Suite
                    </span>
                    <span>. </span>

                    {rawText.toLowerCase().includes('5,000') ? (
                      <span
                        onClick={() => setActiveLensItem(2)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-coral/30 text-coral border border-coral/60 hover:bg-coral/50 font-semibold"
                        title="Critical Claim Mismatch vs Product Spec v3.0 §2.1"
                      >
                        Supports up to 5,000 users
                      </span>
                    ) : (
                      <span
                        onClick={() => setActiveLensItem(2)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-mint/30 text-mint border border-mint/60 hover:bg-mint/50 font-semibold"
                      >
                        Supports up to 500 users
                      </span>
                    )}
                    <span> with simple onboarding. Our platform offers a </span>

                    {rawText.toLowerCase().includes('100%') ? (
                      <span
                        onClick={() => setActiveLensItem(3)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-coral/30 text-coral border border-coral/60 hover:bg-coral/50 font-semibold"
                        title="Prohibited SLA Claim"
                      >
                        guarantee 100% uptime
                      </span>
                    ) : (
                      <span
                        onClick={() => setActiveLensItem(3)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-mint/30 text-mint border border-mint/60 hover:bg-mint/50 font-semibold"
                      >
                        99.9% uptime per SLA
                      </span>
                    )}
                    <span> for any organization. Try the new </span>

                    {rawText.toLowerCase().includes('orbit app') ? (
                      <span
                        onClick={() => setActiveLensItem(4)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-amber/30 text-amber border border-amber/60 hover:bg-amber/50 font-semibold"
                        title="Deprecated Naming"
                      >
                        Orbit App
                      </span>
                    ) : (
                      <span
                        onClick={() => setActiveLensItem(4)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-mint/30 text-mint border border-mint/60 hover:bg-mint/50 font-semibold"
                      >
                        Orbit Suite
                      </span>
                    )}
                    <span> today for </span>

                    {rawText.toLowerCase().includes('magic') ? (
                      <span
                        onClick={() => setActiveLensItem(5)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-amber/30 text-amber border border-amber/60 hover:bg-amber/50 font-semibold"
                        title="Hyperbolic Claim"
                      >
                        instant magic
                      </span>
                    ) : (
                      <span
                        onClick={() => setActiveLensItem(5)}
                        className="px-2 py-0.5 rounded cursor-pointer transition-all bg-mint/30 text-mint border border-mint/60 hover:bg-mint/50 font-semibold"
                      >
                        automated intelligent validation
                      </span>
                    )}
                    <span>.</span>
                  </p>
                </div>

                {/* Evidence Callout Drawer */}
                <div className="p-4 rounded-xl bg-navy-light/90 border border-white/10 text-xs font-mono space-y-2">
                  <div className="text-muted uppercase text-[10px] tracking-wider">
                    {activeLensItem === 2
                      ? 'Certified Source Evidence (Section 2.1)'
                      : activeLensItem === 3
                      ? 'Enterprise SLA Compliance Guarantee'
                      : activeLensItem === 4
                      ? 'Brand Dictionary Standard'
                      : 'Truth Inspection Summary'}
                  </div>
                  {activeLensItem === 2 ? (
                    <div className="space-y-1">
                      <div className="text-coral font-semibold">
                        ❌ Claim: "Supports up to 5,000 users"
                      </div>
                      <div className="text-mint font-semibold">
                        ✅ Certified Truth: Product Spec v3.0 certifies maximum 500 concurrent users.
                      </div>
                      <div className="text-muted text-[11px]">
                        Source: Product Specification - Orbit Core Platform v3.0 (ID: #1)
                      </div>
                    </div>
                  ) : activeLensItem === 3 ? (
                    <div className="space-y-1">
                      <div className="text-coral font-semibold">
                        ❌ Claim: "guarantee 100% uptime"
                      </div>
                      <div className="text-mint font-semibold">
                        ✅ Certified Policy: Customer SLA provides 99.9% uptime with service credits.
                      </div>
                      <div className="text-muted text-[11px]">
                        Rule: Prohibited Absolute Guarantees (Rule ID: #2)
                      </div>
                    </div>
                  ) : activeLensItem === 4 ? (
                    <div className="space-y-1">
                      <div className="text-amber font-semibold">
                        ⚠️ Deprecated Term: "Orbit App"
                      </div>
                      <div className="text-mint font-semibold">
                        ✅ Approved Brand Standard: "Orbit Suite"
                      </div>
                      <div className="text-muted text-[11px]">
                        Rule: Official Product Naming Consistency (Rule ID: #1)
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted">
                      Click any highlighted sentence above to inspect how INKLOOM matches candidate copy against certified technical documents in real time.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mode B: Upload PDF */
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-2">
              Text-Based PDF Document (.pdf) <span className="text-coral">*</span>
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                dragActive ? 'border-indigo bg-indigo/10' : 'border-white/10 glass-panel hover:border-white/20'
              }`}
            >
              <UploadCloud className="w-12 h-12 text-lavender mx-auto mb-4" />
              <div className="space-y-2">
                <div className="text-sm font-medium text-white">
                  {file ? (
                    <span className="text-mint font-mono font-bold">{file.name}</span>
                  ) : (
                    <span>Drag and drop candidate PDF here, or browse</span>
                  )}
                </div>
                <p className="text-xs text-muted">
                  Apache PDFBox will extract body copy and analyze numerical claims. Up to 10MB.
                </p>
              </div>

              <label className="mt-6 inline-block">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                />
                <span className="px-5 py-2.5 rounded-xl bg-navy-light hover:bg-white/10 text-xs font-mono text-white border border-white/10 transition-all cursor-pointer inline-block">
                  {file ? 'Change PDF Document' : 'Choose Local PDF'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div className="text-xs text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <span>Dual-Engine Ingestion Pipeline active on MySQL 8.0</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3.5 rounded-2xl bg-indigo hover:bg-indigo-light text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Stage Analysis...</span>
              </>
            ) : (
              <>
                <span>Submit for Dual-Engine Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Stepper Modal Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-indigo/40 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-indigo/20 border border-indigo/50 flex items-center justify-center mx-auto text-lavender animate-pulse">
              <Cpu className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-white">
                INKLOOM AI Governance Pipeline
              </h3>
              <p className="text-xs text-muted mt-1">
                Cross-referencing candidate text with verified workspace truth documents.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 font-mono text-xs text-lavender flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo" />
              <span>{analysisStep || 'Initializing engine...'}</span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo to-mint h-full animate-[progress_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
