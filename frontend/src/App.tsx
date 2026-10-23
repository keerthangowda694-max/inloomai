import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { AppShell, AppView } from './components/app/AppShell';
import { OverviewDashboard } from './components/app/OverviewDashboard';
import { ContentStudio } from './components/app/ContentStudio';
import { FindingsWorkspace } from './components/app/FindingsWorkspace';
import { ReviewQueue } from './components/app/ReviewQueue';
import { SourcesGovernance } from './components/app/SourcesGovernance';
import { BrandRulesManager } from './components/app/BrandRulesManager';
import { AuditTrail } from './components/app/AuditTrail';
import { SettingsView } from './components/app/SettingsView';
import { apiGetDashboardStats } from './api/client';
import { Lock, X, AlertCircle } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { user, workspace, login, quickLogin, isLoading } = useAuth();
  const [inApp, setInApp] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('overview');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number>(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Real-time badge indicators
  const [pendingCount, setPendingCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    if (user) {
      setInApp(true);
    }
  }, [user]);

  const updateBadges = async () => {
    if (!workspace) return;
    try {
      const stats = await apiGetDashboardStats(workspace.id);
      setPendingCount(stats.pendingReviews);
      setCriticalCount(stats.highSeverityIssues);
      setAiAvailable(stats.aiAvailable);
    } catch {
      // Ignore background badge fetch errors
    }
  };

  useEffect(() => {
    if (inApp && workspace) {
      updateBadges();
      const interval = setInterval(updateBadges, 8000);
      return () => clearInterval(interval);
    }
  }, [inApp, workspace]);

  const handleNavigate = (view: AppView, submissionId?: number) => {
    setCurrentView(view);
    if (submissionId) {
      setSelectedSubmissionId(submissionId);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      await login(loginEmail, loginPassword);
      setShowLoginModal(false);
      setInApp(true);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickLoginAndEnter = async (role: 'REVIEWER' | 'ADMIN' | 'CREATOR') => {
    setLoginLoading(true);
    try {
      await quickLogin(role);
      setShowLoginModal(false);
      setInApp(true);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center text-coolwhite font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo border-t-transparent animate-spin" />
          <span>INITIALIZING INKLOOM AI...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!inApp ? (
        <LandingPage
          onEnterApp={() => setInApp(true)}
          onOpenLogin={() => setShowLoginModal(true)}
        />
      ) : (
        <AppShell
          currentView={currentView}
          onNavigate={handleNavigate}
          onExitToLanding={() => setInApp(false)}
          pendingCount={pendingCount}
          criticalCount={criticalCount}
          aiAvailable={aiAvailable}
        >
          {currentView === 'overview' && <OverviewDashboard onNavigate={handleNavigate} />}
          {currentView === 'studio' && <ContentStudio onNavigate={handleNavigate} />}
          {currentView === 'findings' && (
            <FindingsWorkspace
              initialSubmissionId={selectedSubmissionId}
              onNavigateOverview={() => handleNavigate('overview')}
            />
          )}
          {currentView === 'queue' && (
            <ReviewQueue
              onNavigateFindings={(id) => handleNavigate('findings', id)}
            />
          )}
          {currentView === 'sources' && <SourcesGovernance />}
          {currentView === 'rules' && <BrandRulesManager />}
          {currentView === 'audit' && <AuditTrail />}
          {currentView === 'settings' && <SettingsView />}
        </AppShell>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-white/10 bg-navy p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-muted hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo/15 text-indigo border border-indigo/20 flex items-center justify-center mx-auto mb-3 shadow-glow-indigo">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">Sign In to Inkloom</h2>
              <p className="text-xs text-muted font-mono mt-1">Authenticate to access governed workspace</p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Quick Login Test Accounts */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 mb-6 space-y-2">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                Quick Test Authentication (1-Click)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLoginAndEnter('REVIEWER')}
                  className="py-2 px-2.5 rounded-xl bg-mint/15 hover:bg-mint/25 text-mint border border-mint/30 text-xs font-bold transition-all text-center"
                >
                  Reviewer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLoginAndEnter('ADMIN')}
                  className="py-2 px-2.5 rounded-xl bg-indigo/25 hover:bg-indigo/35 text-electric-lavender border border-indigo/40 text-xs font-bold transition-all text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLoginAndEnter('CREATOR')}
                  className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-coolwhite border border-white/20 text-xs font-bold transition-all text-center"
                >
                  Creator
                </button>
              </div>
            </div>

            {/* Manual Credential Form */}
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="reviewer@inkloom.ai"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-indigo hover:bg-indigo-hover text-white text-xs font-bold tracking-wide shadow-glow-indigo transition-all disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loginLoading ? 'Authenticating...' : 'Sign In with Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
};

export default App;
