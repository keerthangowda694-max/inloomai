import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck2,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Sparkles,
  Lock,
  GitBranch,
  History,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Scale,
  Users
} from 'lucide-react';
import { BrandMark } from '../common/BrandMark';
import { GovernanceEngine3D } from '../3d/GovernanceEngine3D';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenLogin }) => {
  const { user, quickLogin } = useAuth();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(3);
  const [demoReviewState, setDemoReviewState] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EDITED'>('PENDING');

  const workflowSteps = [
    { num: 1, title: 'Submit Content', desc: 'Paste marketing copy or upload text-based PDFs.' },
    { num: 2, title: 'Extract Text', desc: 'Apache PDFBox parses document structure & text layer.' },
    { num: 3, title: 'Check Brand Rules', desc: 'Deterministic matching for prohibited phrases & terms.' },
    { num: 4, title: 'Retrieve Evidence', desc: 'Queries authoritative product specifications & SLAs.' },
    { num: 5, title: 'Validate Findings', desc: 'Precise comparison flags numerical & semantic mismatches.' },
    { num: 6, title: 'Human Review', desc: 'Brand editors accept, edit, or reject before publish.' },
  ];

  const handleStartReview = async () => {
    if (user) {
      onEnterApp();
    } else {
      await quickLogin('REVIEWER');
      onEnterApp();
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian text-coolwhite overflow-hidden selection:bg-indigo selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-lavender/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-mint/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-obsidian/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <BrandMark size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#workflow" className="hover:text-coolwhite transition-colors">Workflow</a>
            <a href="#interactive-preview" className="hover:text-coolwhite transition-colors">Interactive Demo</a>
            <a href="#principles" className="hover:text-coolwhite transition-colors">Trust Principles</a>
            <a href="#features" className="hover:text-coolwhite transition-colors">Capabilities</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={onEnterApp}
                className="px-5 py-2.5 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-sm font-semibold tracking-wide shadow-glow-indigo transition-all flex items-center gap-2"
              >
                Go to Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 text-sm text-muted hover:text-coolwhite transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleStartReview}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo to-indigo-hover text-white text-sm font-semibold tracking-wide shadow-glow-indigo hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  Launch Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo/40 bg-indigo/10 mb-6 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-electric-lavender animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-widest uppercase text-lavender">
                BRAND GOVERNANCE INTELLIGENCE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
            >
              Every piece of content. <br />
              <span className="text-gradient-indigo">One trusted brand standard.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mb-8 font-normal"
            >
              Validate claims, enforce terminology, trace approved evidence, and keep every content decision in human hands.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={handleStartReview}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-base font-semibold tracking-wide shadow-glow-indigo transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Start a Review</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#workflow"
                className="w-full sm:w-auto px-7 py-4 rounded-xl glass-panel glass-panel-hover text-coolwhite text-base font-medium tracking-wide flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <span>Explore the Workflow</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </a>
            </motion.div>

            {/* Trust badge tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center gap-6 text-xs font-mono text-muted/80 border-t border-white/5 pt-6 w-full"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-mint" />
                <span>Deterministic Precision Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-mint" />
                <span>Zero Prompt Hallucination</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-mint" />
                <span>100% Traceable Review Audit</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Signature 3D Experience */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-navy/40 backdrop-blur-md shadow-2xl">
                <GovernanceEngine3D />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Workflow Visualization */}
      <section id="workflow" className="relative py-24 border-t border-white/5 bg-navy-dark/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-medium tracking-widest text-lavender uppercase">
              ARCHITECTURAL PIPELINE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
              How Inkloom AI Governs Every Sentence
            </h2>
            <p className="text-muted text-base">
              Content is never rubber-stamped. Every candidate document is deconstructed and validated against authoritative source repositories.
            </p>
          </div>

          {/* Connected Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                whileHover={{ y: -4 }}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-6 rounded-2xl glass-panel transition-all cursor-pointer relative overflow-hidden ${
                  activeWorkflowStep === idx
                    ? 'border-indigo/80 bg-navy/90 shadow-glow-indigo'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
                    activeWorkflowStep === idx
                      ? 'bg-indigo text-white shadow-md'
                      : 'bg-white/5 text-muted'
                  }`}>
                    0{step.num}
                  </span>
                  {activeWorkflowStep === idx && (
                    <span className="text-[10px] font-mono text-electric-lavender uppercase px-2 py-0.5 rounded-full bg-indigo/20 border border-indigo/30">
                      Active Step
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Product Preview: Orbit Demo Finding */}
      <section id="interactive-preview" className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-medium tracking-widest text-coral uppercase">
              INTERACTIVE DEMO (ORBIT SUITE v3)
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
              Real Evidence Comparison in Action
            </h2>
            <p className="text-muted text-base">
              Try the human review decision workflow below. A marketing draft claimed 5,000 users, but authoritative engineering specifications allow 500.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl glass-panel border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-coral/15 border border-coral/30 text-coral font-mono text-xs font-semibold">
                  CRITICAL MISMATCH
                </span>
                <span className="text-xs font-mono text-muted">
                  CATEGORY: CLAIM_MISMATCH • ID #FND-402
                </span>
              </div>
              <span className="text-xs font-mono text-muted/60">Fictional Demo Content</span>
            </div>

            {/* Split Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Submitted Claim */}
              <div className="p-5 rounded-2xl bg-obsidian/60 border border-coral/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-muted">Submitted Copy Claim</span>
                  <XCircle className="w-4 h-4 text-coral" />
                </div>
                <p className="font-sans text-base text-white font-medium mb-3">
                  "Meet Orbit Suite. <mark className="bg-coral/25 text-coral px-1.5 py-0.5 rounded font-bold">Supports up to 5,000 users</mark> with simple onboarding."
                </p>
                <span className="text-xs font-mono text-muted">Source: Q4_Announcement_Draft.docx</span>
              </div>

              {/* Authoritative Approved Source */}
              <div className="p-5 rounded-2xl bg-obsidian/60 border border-mint/40 shadow-glow-mint/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-mint font-semibold">Authoritative Source</span>
                  <CheckCircle2 className="w-4 h-4 text-mint" />
                </div>
                <p className="font-sans text-base text-white font-medium mb-3">
                  "Orbit Suite <mark className="bg-mint/25 text-mint px-1.5 py-0.5 rounded font-bold">supports up to 500 users</mark> in standard deployment."
                </p>
                <div className="text-xs font-mono text-muted flex flex-col gap-1">
                  <span>Product Spec v3.0 • Section 2.1</span>
                  <span>Owner: Elena Rostova (CPO) • Valid through 2027</span>
                </div>
              </div>
            </div>

            {/* Suggested Correction & Review Decision */}
            <div className="p-5 rounded-2xl bg-navy/60 border border-indigo/30 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-lavender uppercase font-semibold">Suggested Correction</span>
                <span className="text-xs font-mono text-muted">1-Click Replacement</span>
              </div>
              <p className="text-sm text-coolwhite font-medium">
                Change to: <span className="text-white font-semibold underline decoration-mint">"Supports up to 500 users"</span> to reflect certified architecture capacity.
              </p>
            </div>

            {/* Decision Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted">REVIEW STATUS:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  demoReviewState === 'ACCEPTED' ? 'bg-mint/20 text-mint border border-mint/30' :
                  demoReviewState === 'REJECTED' ? 'bg-coral/20 text-coral border border-coral/30' :
                  demoReviewState === 'EDITED' ? 'bg-lavender/20 text-lavender border border-lavender/30' :
                  'bg-amber/20 text-amber border border-amber/30'
                }`}>
                  {demoReviewState}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDemoReviewState('ACCEPTED')}
                  className="px-4 py-2 rounded-xl bg-mint hover:bg-emerald-600 text-obsidian text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Accept Correction
                </button>
                <button
                  onClick={() => setDemoReviewState('EDITED')}
                  className="px-4 py-2 rounded-xl glass-panel text-xs text-white font-semibold hover:border-lavender transition-all cursor-pointer"
                >
                  Edit Custom
                </button>
                <button
                  onClick={() => setDemoReviewState('REJECTED')}
                  className="px-4 py-2 rounded-xl bg-coral/20 hover:bg-coral/30 text-coral text-xs font-semibold border border-coral/30 transition-all cursor-pointer"
                >
                  Reject Finding
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Principles */}
      <section id="principles" className="relative py-24 border-t border-white/5 bg-navy-dark/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-medium tracking-widest text-lavender uppercase">
              GOVERNANCE FOUNDATIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
              Four Non-Negotiable Trust Principles
            </h2>
            <p className="text-muted text-base">
              Built specifically for enterprises where a single erroneous marketing claim causes contractual and regulatory exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Evidence Before Conclusions',
                desc: 'No finding is raised without an explicit citation from registered corporate documentation.',
                color: 'text-mint',
              },
              {
                icon: BookOpen,
                title: 'Approved Sources Only',
                desc: 'Unapproved or draft copy cannot be used to certify brand claims. Authoritative versioning only.',
                color: 'text-indigo',
              },
              {
                icon: Scale,
                title: 'Human-Controlled Decisions',
                desc: 'The AI never auto-publishes or overrides human judgment. Reviewers retain ultimate veto power.',
                color: 'text-lavender',
              },
              {
                icon: History,
                title: 'Traceable Review History',
                desc: 'Every accept, edit, and rejection is permanently recorded in an immutable MySQL audit ledger.',
                color: 'text-amber',
              },
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                    <p.icon className={`w-6 h-6 ${p.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Features Grid */}
      <section id="features" className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-medium tracking-widest text-indigo uppercase">
              ENTERPRISE CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
              Complete Editorial Intelligence Suite
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass-panel border border-white/5">
              <FileCheck2 className="w-8 h-8 text-indigo mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">Source Governance</h3>
              <p className="text-sm text-muted">
                Maintain product specifications, SLA policies, and brand guidelines with version tags, ownership, and expiry management.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5">
              <Cpu className="w-8 h-8 text-mint mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">Deterministic Engine</h3>
              <p className="text-sm text-muted">
                Exact string, word-boundary, and regex checks run first to guarantee zero false positives for prohibited phrases and naming rules.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5">
              <FileText className="w-8 h-8 text-lavender mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">Apache PDFBox Parser</h3>
              <p className="text-sm text-muted">
                Extracts text directly from production PDFs, rejecting unsupported flat scanned images with constructive guidance.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5">
              <GitBranch className="w-8 h-8 text-amber mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">Split-Pane Findings</h3>
              <p className="text-sm text-muted">
                Inspect document text side-by-side with exact approved excerpts, mismatch explanations, and severity pills.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5">
              <Users className="w-8 h-8 text-coral mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">Role-Based Access</h3>
              <p className="text-sm text-muted">
                Server-enforced roles for ADMIN, SOURCE_OWNER, REVIEWER, and CREATOR ensure complete separation of duties.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5">
              <Lock className="w-8 h-8 text-indigo mb-4" />
              <h3 className="font-display font-semibold text-lg text-white mb-2">MySQL Audit Trail</h3>
              <p className="text-sm text-muted">
                Every review decision, source modification, and document submission is recorded with actor ID and timestamp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 border-t border-white/5 bg-gradient-to-b from-navy-dark to-obsidian">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            "Your brand standards deserve more than a prompt."
          </h2>
          <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
            Experience deterministic governance, live MySQL persistence, and the complete ASTRA3 brand platform now.
          </p>
          <button
            onClick={handleStartReview}
            className="px-9 py-5 rounded-2xl bg-indigo hover:bg-indigo-hover text-white text-base font-semibold tracking-wide shadow-glow-indigo transition-all duration-200 inline-flex items-center gap-3 cursor-pointer group"
          >
            <span>Validate Your First Document</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandMark size="sm" />
          <div className="text-xs font-mono text-muted text-center md:text-right">
            <span>INKLOOM AI • Team ASTRA3 Brand Governance Platform • Spring Boot + MySQL + React 3D</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
