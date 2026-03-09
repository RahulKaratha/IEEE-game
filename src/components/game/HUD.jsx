import { useEffect, useRef, useState } from 'react';
import useGameStore from '../../store/useGameStore';
import EventBus from '../../game/EventBus';

export default function HUD() {
    const { xp, levelData, getXPProgress, LEVELS } = useGameStore();
    const progress = getXPProgress();
    const barRef = useRef(null);
    const prevXP = useRef(xp);
    const [musicOn, setMusicOn] = useState(true);

    useEffect(() => {
        if (xp !== prevXP.current && barRef.current) {
            barRef.current.classList.add('xp-pulse');
            setTimeout(() => barRef.current?.classList.remove('xp-pulse'), 600);
            prevXP.current = xp;
        }
    }, [xp]);

    const nextLevel = LEVELS.find(l => l.level === levelData.level + 1);

    const levelColors = {
        1: { from: '#64748b', to: '#94a3b8', glow: '#94a3b8' },
        2: { from: '#0284c7', to: '#38bdf8', glow: '#38bdf8' },
        3: { from: '#7c3aed', to: '#a78bfa', glow: '#a78bfa' },
        4: { from: '#059669', to: '#34d399', glow: '#34d399' },
        5: { from: '#b45309', to: '#fbbf24', glow: '#fbbf24' },
    };
    const colors = levelColors[levelData.level] || levelColors[1];

    const handleMusicToggle = () => {
        const next = !musicOn;
        setMusicOn(next);
        EventBus.emit('toggle-music', next);
    };

    return (
        <div className="hud-container">
            {/* Left panel – Level badge */}
            <div className="hud-level-badge" style={{ '--glow': colors.glow }}>
                <div className="hud-level-icon">{levelData.emoji}</div>
                <div className="hud-level-info">
                    <div className="hud-level-num">LVL {levelData.level}</div>
                    <div className="hud-level-title">{levelData.title}</div>
                </div>
            </div>

            {/* Center – XP bar */}
            <div className="hud-xp-wrap">
                <div className="hud-xp-label">
                    <span className="hud-xp-val">{xp.toLocaleString()} XP</span>
                    {nextLevel && (
                        <span className="hud-xp-next">/ {nextLevel.xpRequired.toLocaleString()}</span>
                    )}
                    {!nextLevel && <span className="hud-xp-max">MAX LEVEL ✨</span>}
                </div>
                <div className="hud-xp-track" ref={barRef}>
                    <div
                        className="hud-xp-fill"
                        style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                            boxShadow: `0 0 14px ${colors.glow}88`,
                        }}
                    >
                        {/* Animated shimmer */}
                        <div className="xp-shimmer" />
                    </div>
                </div>
                {nextLevel && (
                    <div className="hud-next-label">
                        Next: <span>{nextLevel.emoji} {nextLevel.title}</span>
                    </div>
                )}
            </div>

            {/* Right – Controls hint */}
            <div className="hud-controls">
                <div className="hud-ctrl-key">WASD</div>
                <div className="hud-ctrl-text">Move</div>
                <div className="hud-ctrl-key" style={{ marginLeft: 8 }}>E</div>
                <div className="hud-ctrl-text">Enter</div>
            </div>

            <button className="hud-music-btn" onClick={handleMusicToggle}>
                {musicOn ? 'Stop Music' : 'Play Music'}
            </button>
        </div>
    );
}
