import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Education } from './pages/Education';
import { CourseDetail } from './pages/CourseDetail';
import { Game } from './pages/Game';
import { TetrisPage } from './pages/TetrisPage';
import { Market } from './pages/Market';
import { StockDetail } from './pages/StockDetail';
import { Mentoring } from './pages/Mentoring';
import { AIAssistant } from './pages/AIAssistant';
import { Community } from './pages/Community';
import { Landing } from './pages/Landing';
import { AuthModal } from './components/AuthModal';
import { authClient } from './lib/auth-client';
import { PortfolioProvider } from './context/PortfolioContext';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'; // Added useNavigate
import { ProfileSetup } from './pages/ProfileSetup';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/profile-setup" element={<ProfileSetup />} /> {/* Added ProfileSetup route */}
    <Route path="/education" element={<Education />} />
    <Route path="/education/:id" element={<CourseDetail />} />
    <Route path="/game" element={<Game />} />
    <Route path="/game/tetris" element={<TetrisPage />} />
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
  const { data: session, isPending } = authClient.useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Initialized useNavigate

  // If session exists, user is authenticated
  const isAuthenticated = !!session;

  const handleLogin = async (email?: string, password?: string, name?: string) => {
    if (!email || !password) return;

    try {
      if (name) {
        // Sign Up
        await authClient.signUp.email({
          email,
          password,
          name,
        }, {
          onSuccess: () => {
            // Session hook will update automatically
            setIsAuthModalOpen(false);
            navigate('/profile-setup'); // Redirect to profile setup after successful sign-up
          },
          onError: (ctx) => {
            alert(ctx.error?.message || "Something went wrong during sign up");
          }
        });
      } else {
        // Sign In
        await authClient.signIn.email({
          email,
          password,
        }, {
          onSuccess: () => {
            // Session hook will update automatically
            setIsAuthModalOpen(false);
          },
          onError: (ctx) => {
            alert(ctx.error?.message || "Something went wrong during sign in");
          }
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("An error occurred during authentication");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        {isPending ? (
          <div className="flex h-screen items-center justify-center bg-[#0f1f1e] text-white">
            Loading...
          </div>
        ) : (
          <>
            <Landing onOpenAuth={() => setIsAuthModalOpen(true)} />
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onLogin={handleLogin}
            />
          </>
        )}
      </>
    );
  }

  const shouldHideGlobalHeader = ['/market', '/mentoring', '/ai-assistant', '/community'].some(path => location.pathname.startsWith(path));

  return (
    <PortfolioProvider userId={session?.user?.id}>
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
    </PortfolioProvider>
  );
}

export default App;
