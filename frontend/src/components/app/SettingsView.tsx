import React from 'react';
import {
  Shield,
  User,
  Building,
  CheckCircle2,
  Lock,
  Cpu,
  Database,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { user, workspace } = useAuth();

  const roleCapabilities = [
    { role: 'ADMIN', desc: 'Full workspace management, system configuration, user role assignments, audit inspection.' },
    { role: 'SOURCE_OWNER', desc: 'Authoritative specification registration, versioning, expiry lifecycle, rule creation.' },
    { role: 'REVIEWER', desc: 'Inspection of split-pane findings, accept/reject/edit decisions, revision requests.' },
    { role: 'CREATOR', desc: 'Candidate copy submission, text paste, PDF upload, reading validation summaries.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-white/5 pb-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          System & Workspace Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Review governance configuration, active tenancy, and server-enforced role permissions.
        </p>
      </div>

      {/* Current Workspace Card */}
      <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo/15 text-indigo flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base text-white">
              {workspace?.name}
            </h2>
            <span className="text-xs font-mono text-muted">Slug: {workspace?.slug}</span>
          </div>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          {workspace?.description}
        </p>
      </div>

      {/* Current User Profile Card */}
      <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint/15 text-mint flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-white">
                {user?.fullName}
              </h2>
              <span className="text-xs font-mono text-muted">{user?.email}</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo/20 text-electric-lavender border border-indigo/40">
            ROLE: {user?.role}
          </span>
        </div>
      </div>

      {/* Role Capabilities Matrix */}
      <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
        <h3 className="font-display font-semibold text-base text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-lavender" /> Server-Enforced Role Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleCapabilities.map((rc) => (
            <div
              key={rc.role}
              className={`p-4 rounded-xl border ${
                user?.role === rc.role
                  ? 'border-indigo/50 bg-indigo/10'
                  : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-white">{rc.role}</span>
                {user?.role === rc.role && (
                  <span className="text-[10px] font-mono text-mint font-semibold">YOUR ACTIVE ROLE</span>
                )}
              </div>
              <p className="text-xs text-muted leading-relaxed">{rc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Backend Infrastructure Diagnostics */}
      <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3 font-mono text-xs text-muted">
        <h3 className="font-display font-semibold text-base text-white flex items-center gap-2 font-sans">
          <Database className="w-4 h-4 text-mint" /> Infrastructure Diagnostics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-xl bg-obsidian/60 border border-white/5">
            <span className="text-muted block text-[10px]">DATABASE ENGINE</span>
            <span className="text-white font-semibold">MySQL 8.0 (localhost:3306)</span>
          </div>
          <div className="p-3 rounded-xl bg-obsidian/60 border border-white/5">
            <span className="text-muted block text-[10px]">BACKEND FRAMEWORK</span>
            <span className="text-white font-semibold">Spring Boot 3.3.5 / Java 21/25</span>
          </div>
          <div className="p-3 rounded-xl bg-obsidian/60 border border-white/5">
            <span className="text-muted block text-[10px]">PDF PARSING</span>
            <span className="text-white font-semibold">Apache PDFBox 3.0.3</span>
          </div>
          <div className="p-3 rounded-xl bg-obsidian/60 border border-white/5">
            <span className="text-muted block text-[10px]">3D RENDER ENGINE</span>
            <span className="text-white font-semibold">React Three Fiber + Three.js</span>
          </div>
        </div>
      </div>
    </div>
  );
};
