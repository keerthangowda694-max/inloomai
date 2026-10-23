import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { apiGetAllFindings, apiReviewFinding } from '../../api/client';
import { Finding, Severity } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AppView } from './AppShell';

interface ReviewQueueProps {
  onNavigateFindings: (submissionId: number) => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({ onNavigateFindings }) => {
  const { workspace } = useAuth();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'ALL'>('PENDING');

  const fetchFindings = async () => {
    if (!workspace) return;
    setLoading(true);
    try {
      const list = await apiGetAllFindings(workspace.id);
      setFindings(list);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, [workspace]);

  const handleQuickApprove = async (id: number) => {
    try {
      await apiReviewFinding(id, {
        decision: 'ACCEPT',
        notes: 'Quick-approved from global Review Queue',
      });
      setFindings((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'ACCEPTED' } : f))
      );
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filtered = findings.filter((f) => {
    if (statusFilter === 'PENDING' && f.status !== 'PENDING') return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Human Review Queue
          </h1>
          <p className="text-sm text-muted mt-1">
            Centrally review and approve evidence findings across all workspace submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl p-1 bg-navy/80 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'PENDING' ? 'bg-indigo text-white' : 'text-muted hover:text-white'
              }`}
            >
              Pending Only
            </button>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === 'ALL' ? 'bg-indigo text-white' : 'text-muted hover:text-white'
              }`}
            >
              All Items
            </button>
          </div>

          <button
            onClick={fetchFindings}
            className="p-2.5 rounded-xl glass-panel text-muted hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted font-mono animate-pulse">
          Loading active review queue from MySQL...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center max-w-md mx-auto">
          <CheckCircle2 className="w-12 h-12 text-mint mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Queue Clear</h3>
          <p className="text-xs text-muted font-mono">
            All submitted content findings have been reviewed and persisted.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel border border-white/5 overflow-hidden divide-y divide-white/5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    item.severity === 'CRITICAL' ? 'bg-coral/20 text-coral border border-coral/30' :
                    item.severity === 'WARNING' ? 'bg-amber/20 text-amber border border-amber/30' :
                    'bg-indigo/20 text-lavender border border-indigo/30'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="text-xs font-mono uppercase text-muted">
                    {item.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-muted/60">ID #{item.id}</span>
                </div>

                <p className="text-sm font-semibold text-white">"{item.claimExcerpt}"</p>
                <p className="text-xs text-muted line-clamp-1">{item.explanation}</p>

                {item.approvedSourceExcerpt && (
                  <p className="text-xs font-mono text-mint/80 truncate">
                    Ref: {item.sourceTitle || 'Product Spec'} • "{item.approvedSourceExcerpt}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
                {item.status === 'PENDING' && (
                  <button
                    onClick={() => handleQuickApprove(item.id)}
                    className="px-3.5 py-2 rounded-xl bg-mint hover:bg-emerald-600 text-obsidian text-xs font-bold transition-all shadow-sm"
                  >
                    Quick Accept
                  </button>
                )}
                <button
                  onClick={() => onNavigateFindings(item.submissionId)}
                  className="px-4 py-2 rounded-xl glass-panel text-xs text-coolwhite hover:border-lavender flex items-center gap-1.5 transition-all"
                >
                  <span>Inspect in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
