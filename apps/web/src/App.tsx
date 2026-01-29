import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Education } from './pages/Education';
import { Game } from './pages/Game';
import { Market } from './pages/Market';
import { StockDetail } from './pages/StockDetail';
import { Mentoring } from './pages/Mentoring';
import { AIAssistant } from './pages/AIAssistant';
import { Community } from './pages/Community';
import { Landing } from './pages/Landing';
import { AuthModal } from './components/AuthModal';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/education" element={<Education />} />
    <Route path="/game" element={<Game />} />
    <Route path="/market" element={<Market />} />
    <Route path="/market/:ticker" element={<StockDetail />} />
    <Route path="/mentoring" element={<Mentoring />} />
    <Route path="/ai-assistant" element={<AIAssistant />} />
    <Route path="/community" element={<Community />} />
    {/* Redirect any unhandled routes to dashboard if authenticated */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Landing onOpenAuth={() => setIsAuthModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  const shouldHideGlobalHeader = ['/market', '/mentoring', '/ai-assistant', '/community'].some(path => location.pathname.startsWith(path));

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-900 dark:text-white bg-background-light dark:bg-background-dark font-display">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {!shouldHideGlobalHeader && <Header />}
        <main className={shouldHideGlobalHeader ? "flex-1 overflow-hidden relative" : "flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-card-border scrollbar-track-transparent"}>
          <div className={shouldHideGlobalHeader ? "h-full" : "mx-auto max-w-6xl flex flex-col gap-8"}>
            <AppRoutes />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
