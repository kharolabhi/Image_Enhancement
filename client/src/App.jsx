import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EnhancePage from './pages/EnhancePage';
import Navbar from './components/Navbar';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './App.css';

function AppContent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/enhance') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [location.pathname, setTheme]);

  return (
    <div className={theme}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/enhance" element={<EnhancePage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;