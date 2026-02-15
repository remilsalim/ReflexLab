import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TrainingArea from './components/TrainingArea';
import PerformanceChart from './components/PerformanceChart';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, finished
  const [stats, setStats] = useState({
    hits: 0,
    misses: 0,
    clicks: 0,
    startTime: null,
    totalReactionTime: 0,
    bestReactionTime: Infinity,
    hitStreak: 0,
    bestStreak: 0,
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('reflexlab_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('reflexlab_settings');
    return saved ? JSON.parse(saved) : {
      mode: 'static',
      difficulty: 'medium',
      targetSize: 40,
      spawnRate: 1000,
      soundEnabled: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('reflexlab_settings', JSON.stringify(settings));
  }, [settings]);

  const handleStart = () => {
    setGameState('playing');
    setStats({
      hits: 0,
      misses: 0,
      clicks: 0,
      startTime: Date.now(),
      totalReactionTime: 0,
      bestReactionTime: Infinity,
      hitStreak: 0,
      bestStreak: 0,
    });
  };

  const handlePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const handleReset = () => {
    if (gameState === 'playing' || gameState === 'paused') {
      saveSession();
    }
    setGameState('menu');
  };

  const saveSession = () => {
    if (stats.clicks === 0) return;

    const session = {
      date: Date.now(),
      mode: settings.mode,
      difficulty: settings.difficulty,
      hits: stats.hits,
      accuracy: (stats.hits / stats.clicks) * 100,
      avgReaction: stats.hits > 0 ? stats.totalReactionTime / stats.hits : 0,
      bestReaction: stats.bestReactionTime
    };

    const newHistory = [...history, session].slice(-20);
    setHistory(newHistory);
    localStorage.setItem('reflexlab_history', JSON.stringify(newHistory));
  };

  useEffect(() => {
    if (gameState === 'finished') {
      saveSession();
    }
  }, [gameState]);

  const handleRecordHit = (reactionTime) => {
    setStats(prev => {
      const newHits = prev.hits + 1;
      const newStreak = prev.hitStreak + 1;
      return {
        ...prev,
        hits: newHits,
        clicks: prev.clicks + 1,
        totalReactionTime: prev.totalReactionTime + reactionTime,
        bestReactionTime: Math.min(prev.bestReactionTime, reactionTime),
        hitStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });
  };

  const handleRecordMiss = () => {
    setStats(prev => ({
      ...prev,
      misses: prev.misses + 1,
      clicks: prev.clicks + 1,
      hitStreak: 0,
    }));
  };

  return (
    <div className="reflexlab-container">
      <Sidebar
        gameState={gameState}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        settings={settings}
        setSettings={setSettings}
        stats={stats}
        history={history}
        PerformanceChart={PerformanceChart}
      />

      <main className="main-content">
        <Dashboard stats={stats} />
        <TrainingArea
          gameState={gameState}
          settings={settings}
          onHit={handleRecordHit}
          onMiss={handleRecordMiss}
          setGameState={setGameState}
        />
      </main>
    </div>
  );
}

export default App;
