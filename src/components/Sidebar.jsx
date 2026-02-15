import { Settings, Play, Pause, RotateCcw, Target, Zap, Activity, BarChart2, Volume2, VolumeX } from 'lucide-react';

const Sidebar = ({ gameState, onStart, onPause, onReset, settings, setSettings, stats, history, PerformanceChart }) => {
    const modes = [
        { id: 'static', label: 'Static Click', icon: Target },
        { id: 'moving', label: 'Moving Target', icon: Activity },
        { id: 'precision', label: 'Precision Mode', icon: Zap },
        { id: 'time-attack', label: 'Time Attack', icon: Activity },
    ];

    const difficulties = ['easy', 'medium', 'hard'];

    return (
        <aside className="sidebar">
            <div className="logo-section" style={{ marginBottom: '2rem' }}>
                <h1 className="neon-text-cyan" style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>REFLEX<span style={{ color: 'var(--text-primary)' }}>LAB</span></h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>AI-POWERED REACTION TRAINER</p>
            </div>

            <div className="section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Training Mode</h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {modes.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setSettings({ ...settings, mode: mode.id })}
                            className={`glass-panel ${settings.mode === mode.id ? 'neon-border-cyan' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                border: settings.mode === mode.id ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                                borderRadius: '8px',
                                background: settings.mode === mode.id ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                color: settings.mode === mode.id ? 'var(--accent-cyan)' : 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                            }}
                        >
                            <mode.icon size={18} />
                            <span style={{ fontWeight: 600 }}>{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Difficulty</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {difficulties.map(diff => (
                        <button
                            key={diff}
                            onClick={() => setSettings({ ...settings, difficulty: diff })}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: '6px',
                                background: settings.difficulty === diff ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                                color: settings.difficulty === diff ? 'var(--bg-deep)' : 'var(--text-primary)',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>

            <div className="section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={14} /> Settings
                </h3>
                <button
                    onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                    className="glass-panel"
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        color: settings.soundEnabled ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s',
                        background: 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <span style={{ fontWeight: 600 }}>Sound Effects</span>
                    {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
            </div>

            <div className="section" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart2 size={14} /> Progress
                </h3>
                <div style={{ flex: 1, minHeight: '150px' }}>
                    {history.length > 0 ? (
                        <PerformanceChart history={history} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No session data yet. Start training to see your progress!</p>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem', paddingBottom: '2rem' }}>
                {gameState === 'menu' || gameState === 'finished' ? (
                    <button className="neon-button" onClick={onStart} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Play size={18} fill="currentColor" /> START TRAINING
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="glass-panel"
                            onClick={onPause}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            {gameState === 'paused' ? <Play size={18} /> : <Pause size={18} />}
                            {gameState === 'paused' ? 'RESUME' : 'PAUSE'}
                        </button>
                        <button
                            className="glass-panel"
                            onClick={onReset}
                            style={{
                                padding: '0.75rem',
                                color: 'var(--accent-red)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
