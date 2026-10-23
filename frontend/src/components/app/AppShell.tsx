import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Search,
  CheckSquare,
  BookOpen,
  Sliders,
  History,
  Settings,
  ChevronDown,
  Bell,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  UserCheck,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { BrandMark } from '../common/BrandMark';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export type AppView =
  | 'overview'
  | 'studio'
  | 'findings'
  | 'queue'
  | 'sources'
  | 'rules'
  | 'audit'
  | 'settings';

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onExitToLanding: () => void;
  children: React.ReactNode;
  pendingCount?: number;
  criticalCount?: number;
  aiAvailable?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  onExitToLanding,
  children,
  pendingCount = 0,
  criticalCount = 0,
  aiAvailable = false,
}) => {
  const { user, workspace, workspaces, setWorkspace, logout, quickLogin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const navItems = [
    { id: 'overview' as AppView, label: 'Overview', icon: LayoutDashboard },
    { id: 'studio' as AppView, label: 'Content Studio', icon: FileEdit },
    { id: 'findings' as AppView, label: 'Findings Workspace', icon: Search, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'queue' as AppView, label: 'Review Queue', icon: CheckSquare, badge: criticalCount > 0 ? `${criticalCount} Crit` : undefined },
    { id: 'sources' as AppView, label: 'Sources & Facts', icon: BookOpen },
    { id: 'rules' as AppView, label: 'Brand Rules', icon: Sliders },
    { id: 'audit' as AppView, label: 'Audit Trail', icon: History },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  const roleColors: Record<UserRole, string> = {
    ADMIN: 'bg-indigo/20 text-electric-lavender border-indigo/40',
    REVIEWER: 'bg-mint/20 text-mint border-mint/40',
    SOURCE_OWNER: 'bg-amber/20 text-amber border-amber/40',
    CREATOR: 'bg-white/10 text-coolwhite border-white/20',
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col text-coolwhite selection:bg-indigo selection:text-white">
      {/* Top Application Bar */}
      <header className="h-16 border-b border-white/5 bg-navy-dark/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <BrandMark size="sm" showText={false} />

          {/* Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel hover:bg-navy-light text-xs font-mono font-medium transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-mint" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {workspace ? workspace.name : 'Orbit Enterprise'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl glass-panel border border-white/10 bg-navy p-2 shadow-2xl z-50">
                <span className="text-[10px] font-mono text-muted uppercase px-2 py-1 block">
                  Switch Workspace
                </span>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setWorkspace(ws);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      workspace?.id === ws.id ? 'bg-indigo text-white' : 'text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{ws.name}</span>
                    <span className="text-[10px] font-mono opacity-60">{ws.slug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Engine Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-muted">
            <span className={`w-2 h-2 rounded-full ${aiAvailable ? 'bg-mint' : 'bg-lavender'} animate-pulse`} />
            <span>{aiAvailable ? 'AI Semantic Engine Active' : 'Deterministic Governance Active'}</span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher (Convenient Pair-Programming Tool) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-obsidian/70 border border-white/10 rounded-xl p-1 text-xs">
            <span className="text-[10px] font-mono text-muted px-2">Role:</span>
            <button
              onClick={() => quickLogin('REVIEWER')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                user?.role === 'REVIEWER' ? 'bg-mint text-obsidian font-bold' : 'text-muted hover:text-white'
              }`}
            >
              Reviewer
            </button>
            <button
              onClick={() => quickLogin('ADMIN')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                user?.role === 'ADMIN' ? 'bg-indigo text-white font-bold' : 'text-muted hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin('CREATOR')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                user?.role === 'CREATOR' ? 'bg-lavender text-obsidian font-bold' : 'text-muted hover:text-white'
              }`}
            >
              Creator
            </button>
          </div>

          {/* How It Works Guide Button */}
          <button
            onClick={() => setTourOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-lavender hover:text-white hover:border-lavender/50 transition-all font-mono cursor-pointer"
            title="How INKLOOM Works"
          >
            <HelpCircle className="w-4 h-4 text-lavender" />
            <span className="hidden md:inline font-semibold">How It Works</span>
          </button>

          {/* Notification Indicator */}
          <button
            onClick={() => onNavigate('findings')}
            className="relative p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Open Findings"
          >
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral animate-ping" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo to-lavender flex items-center justify-center font-bold text-xs text-white shadow-glow-indigo">
                {user ? user.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">{user?.fullName}</span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border mt-0.5 inline-block ${roleColors[user?.role || 'CREATOR']}`}>
                  {user?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted hidden md:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel border border-white/10 bg-navy p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-xs font-medium text-white">{user?.fullName}</p>
                  <p className="text-[11px] font-mono text-muted truncate">{user?.email}</p>
                </div>
                <button
                  onClick={onExitToLanding}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-muted hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Landing Page
                </button>
                <button
                  onClick={() => {
                    logout();
                    onExitToLanding();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-coral hover:bg-coral/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`border-r border-white/5 bg-navy-dark/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 z-30 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          {/* Navigation Links */}
          <div className="py-6 px-3 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                    active
                      ? 'bg-indigo text-white font-semibold shadow-glow-indigo'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-muted group-hover:text-coolwhite'}`} />
                  {sidebarOpen && <span className="flex-1 text-left truncate">{item.label}</span>}
                  {sidebarOpen && item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      active ? 'bg-white text-indigo' : 'bg-indigo/30 text-electric-lavender'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Info in Sidebar */}
          {sidebarOpen && (
            <div className="p-4 border-t border-white/5 text-xs font-mono text-muted/70">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-mint" />
                <span>RBAC SECURED</span>
              </div>
              <p className="text-[10px]">Dual Engine v1.0 • MySQL 8.0</p>
            </div>
          )}
        </aside>

        {/* View Content Area */}
        <main className="flex-1 overflow-y-auto bg-obsidian p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Guided Tour / How It Works Modal */}
      {tourOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-panel border border-indigo/40 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo/20 border border-indigo/40 text-lavender font-mono text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-lavender" />
                  <span>1-Minute Quick Guide</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  How INKLOOM AI Enforces Brand Truth
                </h2>
                <p className="text-sm text-muted mt-1">
                  "Every piece of content. One trusted brand standard."
                </p>
              </div>
              <button
                onClick={() => setTourOpen(false)}
                className="p-2 rounded-xl text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Step Visual Progression */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-navy/80 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo/20 text-lavender font-mono font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <div className="font-semibold text-white text-sm">Ingest & Telemetry</div>
                <p className="text-xs text-muted leading-relaxed">
                  Creators paste candidate text or upload PDFs in <strong>Content Studio</strong>. The Live Brand Radar flags violations in real time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy/80 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-lavender/20 text-electric-lavender font-mono font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <div className="font-semibold text-white text-sm">Dual-Stage Pipeline</div>
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Stage 1 Deterministic</strong> tests bounds and prohibited terms; <strong>Stage 2 Semantic</strong> verifies nuance against certified specs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy/80 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-mint/20 text-mint font-mono font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <div className="font-semibold text-white text-sm">Split-Pane Decision</div>
                <p className="text-xs text-muted leading-relaxed">
                  Reviewers inspect side-by-side evidence citations in <strong>Findings Workspace</strong> and accept/edit corrections with 1 click.
                </p>
              </div>
            </div>

            {/* The Orbit Demo Showcase Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-coral/10 via-amber/10 to-indigo/10 border border-white/10 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
                <span>The Pre-Seeded Orbit Suite Demo Case</span>
              </div>
              <div className="text-xs text-coolwhite space-y-1">
                <div>
                  <span className="text-coral font-semibold">❌ Uncertified Draft Claim: </span>
                  <span className="italic">"Supports up to 5,000 users with guarantee 100% uptime."</span>
                </div>
                <div>
                  <span className="text-mint font-semibold">✅ Certified Source Evidence: </span>
                  <span className="font-mono">Product Spec v3.0 §2.1 certifies maximum 500 users; SLA caps at 99.9%.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setTourOpen(false);
                  onNavigate('studio');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo hover:bg-indigo-light text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Try Demo in Content Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setTourOpen(false);
                  onNavigate('findings');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Inspect Findings Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
