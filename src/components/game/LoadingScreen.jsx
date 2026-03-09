import { useState, useEffect } from 'react';
import EventBus from '../../game/EventBus';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [tip] = useState(() => {
        const tips = [
            'Attend seminars to earn Technical XP 🎓',
            'Complete the code challenge at the Innovation Lab ⚡',
            'Visit the Bus Stop for an Industrial experience 🚌',
            'Reach Level 5 to unlock the IEEE Headquarters 🏛️',
            'Use WASD or Arrow Keys to move around the campus 🎮',
            'Reach 1200 XP to become a Professional Member 💼',
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    });

    useEffect(() => {
        // Simulate loading progress bar
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 12 + 3;
            if (p >= 95) { p = 95; clearInterval(interval); }
            setProgress(Math.min(p, 95));
        }, 120);

        // Listen for Phaser scene ready
        const onReady = () => {
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => setVisible(false), 700);
            }, 400);
        };
        EventBus.on('scene-ready', onReady);

        return () => {
            clearInterval(interval);
            EventBus.off('scene-ready', onReady);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={`loading-screen ${fadeOut ? 'loading-fade-out' : ''}`}>
            {/* Animated background particles */}
            <div className="loading-particles">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="loading-particle" style={{ '--i': i }} />
                ))}
            </div>

            <div className="loading-content">
                {/* Logo */}
                <div className="loading-logo">
                    <div className="loading-logo-ring" />
                    <div className="loading-logo-ring loading-logo-ring-2" />
                    <div className="loading-logo-text">IEEE</div>
                </div>

                <h1 className="loading-title">Life Quest</h1>
                <p className="loading-subtitle">Your journey to becoming a Professional Member</p>

                {/* Progress bar */}
                <div className="loading-bar-wrap">
                    <div className="loading-bar-track">
                        <div className="loading-bar-fill" style={{ width: `${progress}%` }}>
                            <div className="loading-bar-shimmer" />
                        </div>
                    </div>
                    <div className="loading-bar-pct">{Math.floor(progress)}%</div>
                </div>

                <p className="loading-status">
                    {progress < 30 ? '🗺️ Building campus map…'
                        : progress < 55 ? '🧍 Rendering characters…'
                            : progress < 75 ? '🌳 Planting trees & flowers…'
                                : progress < 95 ? '✨ Adding particle effects…'
                                    : '🎮 Ready!'}
                </p>

                {/* Tip */}
                <div className="loading-tip">
                    <span className="loading-tip-label">💡 TIP</span>
                    <span>{tip}</span>
                </div>

                {/* Level previews */}
                <div className="loading-levels">
                    {[
                        { emoji: '🎒', label: 'Freshman' },
                        { emoji: '💻', label: 'Tech Enthusiast' },
                        { emoji: '🏅', label: 'Active Member' },
                        { emoji: '👥', label: 'Project Lead' },
                        { emoji: '💼', label: 'Professional' },
                    ].map((lvl, i) => (
                        <div
                            key={i}
                            className="loading-level-chip"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        >
                            <span>{lvl.emoji}</span>
                            <span>{lvl.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
