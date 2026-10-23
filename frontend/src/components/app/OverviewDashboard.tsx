import React, { useEffect, useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Plus,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { apiGetDashboardStats } from '../../api/client';
import { DashboardStats, Submission } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AppView } from './AppShell';

interface OverviewDashboardProps {
  onNavigate: (view: AppView, submissionId?: number) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const { workspace } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = async () => {
    if (!workspace) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetDashboardStats(workspace.id);
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [workspace]);

  const filteredSubmissions = stats?.recentSubmissions.filter((sub) =>
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl glass-panel" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl glass-panel" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl glass-panel border border-coral/30 text-center max-w-xl mx-auto my-12">
        <XCircle className="w-12 h-12 text-coral mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Unable to Load Metrics</h3>
        <p className="text-sm text-muted mb-6">{error}</p>
        <button
          onClick={fetchStats}
          className="px-6 py-2.5 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-xs font-semibold tracking-wide inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry Query
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Governance Overview
          </h1>
          <p className="text-sm text-muted mt-1 font-mono">
            {workspace?.name} • Real-time MySQL Persistence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl glass-panel hover:bg-white/5 text-muted hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className="px-5 py-2.5 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-sm font-semibold tracking-wide shadow-glow-indigo transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Content Review</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Submissions */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 relative overflow-hidden group hover:border-indigo/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-muted">Total Submissions</span>
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-muted group-hover:text-coolwhite">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">
              {stats?.totalSubmissions || 0}
            </span>
            <span className="text-xs font-mono text-muted">documents</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-muted/80 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-indigo" />
            <span>Indexed in MySQL database</span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 relative overflow-hidden group hover:border-amber/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-amber">Pending Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-amber/10 flex items-center justify-center text-amber">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">
              {stats?.pendingReviews || 0}
            </span>
            <span className="text-xs font-mono text-amber">awaiting decision</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-muted/80 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber" />
            <span>Requires reviewer sign-off</span>
          </div>
        </div>

        {/* Open Findings */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 relative overflow-hidden group hover:border-lavender/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-lavender">Open Findings</span>
            <div className="w-9 h-9 rounded-xl bg-indigo/15 flex items-center justify-center text-electric-lavender">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">
              {stats?.openFindings || 0}
            </span>
            <span className="text-xs font-mono text-muted">flagged points</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-muted/80 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-lavender" />
            <span>Dual-engine validated</span>
          </div>
        </div>

        {/* High Severity Issues */}
        <div className="p-6 rounded-2xl glass-panel border border-coral/30 relative overflow-hidden group hover:shadow-glow-coral/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-coral font-bold">Critical Mismatches</span>
            <div className="w-9 h-9 rounded-xl bg-coral/15 flex items-center justify-center text-coral">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-coral">
              {stats?.highSeverityIssues || 0}
            </span>
            <span className="text-xs font-mono text-coral/80">critical</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-coral/80 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Blocks automated approval</span>
          </div>
        </div>
      </div>

      {/* Findings Breakdown by Category */}
      {stats?.findingsByCategory && Object.keys(stats.findingsByCategory).length > 0 && (
        <div className="p-6 rounded-2xl glass-panel border border-white/5">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
            Findings Distribution by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(stats.findingsByCategory).map(([cat, count]) => {
              const colors: Record<string, string> = {
                CLAIM_MISMATCH: 'border-coral/40 bg-coral/10 text-coral',
                PROHIBITED: 'border-amber/40 bg-amber/10 text-amber',
                TERMINOLOGY: 'border-indigo/40 bg-indigo/10 text-lavender',
                MISSING_EVIDENCE: 'border-white/20 bg-white/5 text-coolwhite',
                SOURCE_EXPIRED: 'border-coral/30 bg-coral/5 text-coral',
                TONE_STYLE: 'border-mint/30 bg-mint/5 text-mint',
              };
              return (
                <div
                  key={cat}
                  className={`p-3.5 rounded-xl border text-center ${
                    colors[cat] || 'border-white/10 bg-white/5 text-white'
                  }`}
                >
                  <span className="text-xl font-bold font-display block">{count}</span>
                  <span className="text-[10px] font-mono uppercase tracking-tight mt-0.5 block truncate">
                    {cat.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Submissions Table & Audit Ledger Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Submissions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-white">Recent Submissions</h2>
            <input
              type="text"
              placeholder="Filter by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs w-48"
            />
          </div>

          <div className="rounded-2xl glass-panel border border-white/5 overflow-hidden">
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-muted font-mono text-xs">
                No submissions matching query.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredSubmissions.map((sub) => {
                  const statusColors: Record<string, string> = {
                    REVIEW_PENDING: 'bg-amber/15 text-amber border-amber/30',
                    APPROVED: 'bg-mint/15 text-mint border-mint/30',
                    REJECTED: 'bg-coral/15 text-coral border-coral/30',
                    REVISION_REQUESTED: 'bg-lavender/15 text-lavender border-lavender/30',
                    ANALYZING: 'bg-indigo/15 text-electric-lavender border-indigo/30',
                  };

                  return (
                    <div
                      key={sub.id}
                      onClick={() => onNavigate('findings', sub.id)}
                      className="p-4 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm text-white truncate group-hover:text-lavender transition-colors">
                            {sub.title}
                          </h3>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${statusColors[sub.status] || 'bg-white/5'}`}>
                            {sub.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-muted">
                          <span>{sub.contentType === 'PDF_UPLOAD' ? 'PDF Upload' : 'Text Paste'}</span>
                          <span>•</span>
                          <span>{sub.wordCount} words</span>
                          <span>•</span>
                          <span className={sub.criticalCount > 0 ? 'text-coral font-bold' : ''}>
                            {sub.findingCount} findings ({sub.criticalCount} crit)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 text-muted group-hover:text-white transition-colors">
                        <span className="text-xs font-mono hidden sm:inline">Inspect</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Audit Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-white">Live Audit Log</h2>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs font-mono text-lavender hover:underline"
            >
              View Full History →
            </button>
          </div>

          <div className="rounded-2xl glass-panel border border-white/5 p-4 divide-y divide-white/5">
            {stats?.recentAuditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-electric-lavender font-semibold">{log.action}</span>
                  <span className="font-mono text-[10px] text-muted">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-coolwhite/80 line-clamp-2 leading-relaxed">{log.details}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-muted/60">
                  <span>Actor: {log.userName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
