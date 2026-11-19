import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import { fetchMatches } from './services/api';

function App() {
  const [matchesCount, setMatchesCount] = useState(0);

  // Sync matches count on app startup
  useEffect(() => {
    const checkMatches = async () => {
      try {
        const res = await fetchMatches();
        if (res && res.success) {
          setMatchesCount(res.matches?.length || 0);
        }
      } catch (err) {
        // Silent fail on badge load
      }
    };
    checkMatches();
  }, []);

  const handleMatchCreated = () => {
    setMatchesCount((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-coy-bg text-coy-text">
        {/* Desktop Navbar */}
        <Navbar matchesCount={matchesCount} />

        {/* Main Content Area */}
        <main className="flex-1 w-full pb-16 md:pb-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/discover"
              element={<Discover onMatchCreated={handleMatchCreated} />}
            />
            <Route
              path="/matches"
              element={<Matches onMatchesCountChange={setMatchesCount} />}
            />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation matchesCount={matchesCount} />
      </div>
    </BrowserRouter>
  );
}

export default App;

