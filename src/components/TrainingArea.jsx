import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { TrainerEngine } from '../engine/TrainerEngine';

const TrainingArea = ({ gameState, settings, onHit, onMiss, setGameState }) => {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Engine
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        engineRef.current = new TrainerEngine(canvas, ctx, settings, {
            onHit,
            onMiss,
            onEnd: () => setGameState('finished')
        });

        const handleResize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
                engineRef.current?.resize();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            engineRef.current?.stop();
        };
    }, []);

    // Update engine settings when they change
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.updateSettings(settings);
        }
    }, [settings]);

    // Handle game state changes
    useEffect(() => {
        if (!engineRef.current) return;

        if (gameState === 'playing') {
            engineRef.current.start();
        } else if (gameState === 'paused') {
            engineRef.current.pause();
        } else if (gameState === 'menu' || gameState === 'finished') {
            engineRef.current.stop();
        }
    }, [gameState]);

    const handleClick = (e) => {
        if (gameState !== 'playing') return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        engineRef.current.handleClick(x, y);
    };

    return (
        <div
            ref={containerRef}
            className="training-viewport"
            style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: gameState === 'playing' ? 'crosshair' : 'default' }}
            onClick={handleClick}
        >
            <canvas ref={canvasRef} style={{ display: 'block' }} />

            {gameState === 'menu' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    background: 'rgba(10, 11, 16, 0.8)',
                    padding: '3rem',
                    borderRadius: '24px',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h2 className="neon-text-cyan" style={{ fontSize: '3rem', margin: 0 }}>READY?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Choose your mode and start training</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <div className="glass-panel" style={{ padding: '1rem' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>CURRENT MODE</p>
                            <p style={{ fontWeight: 800, textTransform: 'uppercase' }}>{settings.mode.replace('-', ' ')}</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '1rem' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>DIFFICULTY</p>
                            <p style={{ fontWeight: 800, textTransform: 'uppercase' }}>{settings.difficulty}</p>
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'paused' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <h2 className="neon-text-cyan" style={{ fontSize: '4rem' }}>PAUSED</h2>
                </div>
            )}

            {gameState === 'finished' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    background: 'rgba(10, 11, 16, 0.9)',
                    padding: '3rem',
                    borderRadius: '24px',
                    border: '1px solid var(--accent-cyan)',
                    boxShadow: 'var(--neon-glow-cyan)'
                }}>
                    <h2 className="neon-text-cyan" style={{ fontSize: '3rem', margin: 0 }}>SESSION COMPLETE</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Check your stats in the sidebar</p>
                    <button className="neon-button" onClick={() => setGameState('playing')}>TRY AGAIN</button>
                </div>
            )}
        </div>
    );
};

export default TrainingArea;
