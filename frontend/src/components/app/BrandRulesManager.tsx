import React, { useEffect, useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  Tag
} from 'lucide-react';
import { apiGetRules, apiCreateRule, apiDeleteRule } from '../../api/client';
import { BrandRule, RuleType, Severity } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const BrandRulesManager: React.FC = () => {
  const { workspace } = useAuth();
  const [rules, setRules] = useState<BrandRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  // Form state
  const [ruleType, setRuleType] = useState<RuleType>('PROHIBITED_PHRASE');
  const [targetPhrase, setTargetPhrase] = useState('');
  const [approvedAlternative, setApprovedAlternative] = useState('');
  const [contextGuideline, setContextGuideline] = useState('');
  const [severity, setSeverity] = useState<Severity>('WARNING');

  const fetchRules = async () => {
    if (!workspace) return;
    setLoading(true);
    try {
      const data = await apiGetRules(workspace.id);
      setRules(data);
    } catch (err: any) {
      console.error('Error fetching brand rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [workspace]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    try {
      await apiCreateRule({
        workspaceId: workspace.id,
        ruleType,
        targetPhrase,
        approvedAlternative,
        contextGuideline,
        severity,
      });
      setShowModal(false);
      setTargetPhrase('');
      setApprovedAlternative('');
      setContextGuideline('');
      fetchRules();
    } catch (err: any) {
      alert(`Error creating rule: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this brand rule?')) return;
    try {
      await apiDeleteRule(id);
      fetchRules();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filtered = rules.filter((r) =>
    r.targetPhrase.toLowerCase().includes(search.toLowerCase()) ||
    (r.approvedAlternative && r.approvedAlternative.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Brand Rules & Prohibited Lexicon
          </h1>
          <p className="text-sm text-muted mt-1">
            Deterministic policies enforced on candidate documents before AI evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search phrase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 rounded-xl glass-input text-xs w-48"
          />

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-glow-indigo transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand Rule</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted font-mono animate-pulse">
          Loading brand rules from MySQL...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-indigo/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    r.severity === 'CRITICAL' ? 'bg-coral/20 text-coral border border-coral/30' :
                    r.severity === 'WARNING' ? 'bg-amber/20 text-amber border border-amber/30' :
                    'bg-indigo/20 text-lavender border border-indigo/30'
                  }`}>
                    {r.severity}
                  </span>

                  <span className="text-[10px] font-mono uppercase text-muted">
                    {r.ruleType.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-mono uppercase text-muted">Target Phrase:</span>
                  <p className="text-sm font-bold text-white">"{r.targetPhrase}"</p>
                </div>

                {r.approvedAlternative && (
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-mono uppercase text-mint">Approved Alternative:</span>
                    <p className="text-xs font-semibold text-mint">"{r.approvedAlternative}"</p>
                  </div>
                )}

                {r.contextGuideline && (
                  <p className="text-xs text-muted/90 line-clamp-2 leading-relaxed">
                    {r.contextGuideline}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                <span className="text-[10px] font-mono text-muted/60">ID #{r.id}</span>
                {r.id && (
                  <button
                    onClick={() => handleDelete(r.id!)}
                    className="text-muted hover:text-coral transition-colors p-1"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-white/10 bg-navy p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-white mb-4">
              Add New Brand Policy Rule
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Rule Type *</label>
                  <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value as RuleType)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  >
                    <option value="PROHIBITED_PHRASE" className="bg-navy">PROHIBITED PHRASE</option>
                    <option value="APPROVED_TERMINOLOGY" className="bg-navy">APPROVED TERMINOLOGY</option>
                    <option value="NUMERICAL_BOUND" className="bg-navy">NUMERICAL BOUND</option>
                    <option value="TONE_STYLE" className="bg-navy">TONE & STYLE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Severity *</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as Severity)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  >
                    <option value="CRITICAL" className="bg-navy">CRITICAL</option>
                    <option value="WARNING" className="bg-navy">WARNING</option>
                    <option value="INFO" className="bg-navy">INFO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Target Phrase *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. guarantee 100% uptime or Orbit App"
                  value={targetPhrase}
                  onChange={(e) => setTargetPhrase(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Approved Alternative</label>
                <input
                  type="text"
                  placeholder="e.g. 99.9% uptime per SLA or Orbit Suite"
                  value={approvedAlternative}
                  onChange={(e) => setApprovedAlternative(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Context Guideline</label>
                <textarea
                  rows={3}
                  placeholder="Policy explanation explaining why this phrase is restricted..."
                  value={contextGuideline}
                  onChange={(e) => setContextGuideline(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-xs text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-xs font-semibold shadow-glow-indigo"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
