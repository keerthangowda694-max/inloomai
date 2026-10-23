import React, { useEffect, useState } from 'react';
import {
  History,
  Shield,
  Search,
  RefreshCw,
  User,
  Clock,
  ArrowRight
} from 'lucide-react';
import { apiGetAuditLogs } from '../../api/client';
import { AuditLog } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AuditTrail: React.FC = () => {
  const { workspace } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    if (!workspace) return;
    setLoading(true);
    try {
      const data = await apiGetAuditLogs(workspace.id);
      setLogs(data);
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [workspace]);

  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    (l.userName && l.userName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Immutable Audit Trail
          </h1>
          <p className="text-sm text-muted mt-1">
            Cryptographically stamped event ledger persisted to MySQL for compliance governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search action or actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 rounded-xl glass-input text-xs w-56"
          />

          <button
            onClick={fetchLogs}
            className="p-2.5 rounded-xl glass-panel text-muted hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted font-mono animate-pulse">
          Querying audit logs from MySQL...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center max-w-md mx-auto">
          <Shield className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-base font-bold text-white">No Audit Records Found</h3>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 bg-white/[0.02] text-muted font-mono uppercase">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-muted/80 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-electric-lavender whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted">
                      {log.entityType ? `${log.entityType} #${log.entityId || ''}` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-coolwhite max-w-md leading-relaxed">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted whitespace-nowrap">
                      {log.userName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
