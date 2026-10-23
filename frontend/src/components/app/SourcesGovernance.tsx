import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  CheckCircle2,
  Archive
} from 'lucide-react';
import { apiGetSources, apiCreateSource, apiArchiveSource } from '../../api/client';
import { SourceDocument } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const SourcesGovernance: React.FC = () => {
  const { workspace, user } = useAuth();
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [section, setSection] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [ownerName, setOwnerName] = useState(user?.fullName || '');
  const [contentExcerpt, setContentExcerpt] = useState('');
  const [fullText, setFullText] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [priority, setPriority] = useState(5);

  const fetchSources = async () => {
    if (!workspace) return;
    setLoading(true);
    try {
      const data = await apiGetSources(workspace.id);
      setSources(data);
    } catch (err: any) {
      console.error('Error fetching sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [workspace]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    try {
      await apiCreateSource({
        workspaceId: workspace.id,
        title,
        section,
        version,
        ownerName,
        contentExcerpt,
        fullText,
        expiryDate: expiryDate || undefined,
        priority,
      });
      setShowModal(false);
      resetForm();
      fetchSources();
    } catch (err: any) {
      alert(`Error creating source: ${err.message}`);
    }
  };

  const handleArchive = async (id: number) => {
    if (!confirm('Archive this source? It will no longer serve as approved active evidence.')) return;
    try {
      await apiArchiveSource(id);
      fetchSources();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSection('');
    setVersion('v1.0.0');
    setContentExcerpt('');
    setFullText('');
    setExpiryDate('');
  };

  const filtered = sources.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.contentExcerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Source & Fact Governance
          </h1>
          <p className="text-sm text-muted mt-1">
            Authoritative corporate documentation, product specifications, and SLA guarantees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search approved facts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 rounded-xl glass-input text-xs w-48"
          />

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-glow-indigo transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Source</span>
          </button>
        </div>
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="p-12 text-center text-muted font-mono animate-pulse">
          Loading approved sources from MySQL...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`p-6 rounded-2xl glass-panel border transition-all ${
                s.isExpired
                  ? 'border-coral/40 bg-coral/5'
                  : 'border-white/5 hover:border-indigo/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-mint" />
                  <span className="text-xs font-mono font-bold text-electric-lavender">
                    {s.version}
                  </span>
                  {s.section && (
                    <span className="text-[11px] font-mono text-muted">• {s.section}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {s.isExpired ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-coral/20 text-coral border border-coral/30 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3" /> EXPIRED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-mint/15 text-mint border border-mint/30">
                      ACTIVE
                    </span>
                  )}

                  {s.id && (
                    <button
                      onClick={() => handleArchive(s.id!)}
                      className="text-muted hover:text-coral transition-colors p-1"
                      title="Archive Source"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-display font-semibold text-base text-white mb-2">
                {s.title}
              </h3>

              <blockquote className="p-3.5 rounded-xl bg-obsidian/70 border-l-2 border-mint text-xs text-coolwhite/90 leading-relaxed italic mb-4">
                "{s.contentExcerpt}"
              </blockquote>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-muted border-t border-white/5 pt-3">
                <span>Owner: {s.ownerName}</span>
                <span>Priority: {s.priority}</span>
                {s.expiryDate && <span>Expires: {s.expiryDate}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Source Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl glass-panel border border-white/10 bg-navy p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-white mb-4">
              Register Authoritative Source Document
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Architecture Specification v3.0"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Section</label>
                  <input
                    type="text"
                    placeholder="e.g. Section 2.1 (Scalability)"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Version *</label>
                  <input
                    type="text"
                    required
                    placeholder="v3.0.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova (CPO)"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">
                  Authoritative Fact Excerpt *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="The exact certified corporate claim (e.g. 'Orbit Suite supports up to 500 users.')"
                  value={contentExcerpt}
                  onChange={(e) => setContentExcerpt(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Priority (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value) || 5)}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
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
                  Register Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
