import React from 'react';
import { Target, Timer, Zap, Trophy } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '160px' }}>
        <div style={{ padding: '0.5rem', borderRadius: '8px', background: `${color}20`, color: color }}>
            <Icon size={20} />
        </div>
        <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{value}</p>
        </div>
    </div>
);

const Dashboard = ({ stats }) => {
    const accuracy = stats.clicks > 0 ? ((stats.hits / stats.clicks) * 100).toFixed(1) : '0.0';
    const avgReaction = stats.hits > 0 ? (stats.totalReactionTime / stats.hits).toFixed(0) : '0';
    const bestReaction = stats.bestReactionTime === Infinity ? '0' : stats.bestReactionTime.toFixed(0);

    return (
        <div style={{
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            background: 'rgba(10, 11, 16, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            zIndex: 5
        }}>
            <StatCard
                label="Reaction Time"
                value={`${avgReaction}ms`}
                icon={Timer}
                color="var(--accent-cyan)"
            />
            <StatCard
                label="Best Reaction"
                value={`${bestReaction}ms`}
                icon={Zap}
                color="#fbbf24"
            />
            <StatCard
                label="Accuracy"
                value={`${accuracy}%`}
                icon={Target}
                color="#39ff14"
            />
            <StatCard
                label="Hit Streak"
                value={stats.hitStreak}
                icon={Trophy}
                color="var(--accent-purple)"
            />

            <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', gap: '2rem' }}>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>HITS</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--accent-green)' }}>{stats.hits}</p>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>MISSES</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--accent-red)' }}>{stats.misses}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
