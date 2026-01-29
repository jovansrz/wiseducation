import { useState } from 'react';
import { Landing } from './pages/Landing';
import { AuthModal } from './components/AuthModal';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    // For now, just close the modal since we're only showing landing page
    setIsAuthModalOpen(false);
    // You can add redirect logic here later when other pages are ready
    alert('Login successful! Dashboard coming soon.');
  };

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

export default App;
