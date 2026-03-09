import { useEffect, useRef } from 'react';
import useGameStore from '../../store/useGameStore';

export default function EvolutionToast() {
    const { levelUpToast, dismissToast } = useGameStore();
    const timer = useRef(null);

    useEffect(() => {
        if (levelUpToast) {
            clearTimeout(timer.current);
            timer.current = setTimeout(dismissToast, 4500);
        }
        return () => clearTimeout(timer.current);
    }, [levelUpToast]);

    if (!levelUpToast) return null;

    const gradients = {
        2: 'linear-gradient(135deg, #0284c7, #38bdf8)',
        3: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
        4: 'linear-gradient(135deg, #059669, #34d399)',
        5: 'linear-gradient(135deg, #b45309, #fbbf24)',
    };

    return (
        <div className="evo-toast-wrap">
            <div className="evo-toast" style={{ background: gradients[levelUpToast.level] || gradients[2] }}>
                {/* Particle burst */}
                <div className="toast-particles">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="toast-particle" style={{ '--i': i }} />
                    ))}
                </div>
                <div className="toast-inner">
                    <div className="toast-level-up">LEVEL UP!</div>
                    <div className="toast-emoji">{levelUpToast.emoji}</div>
                    <div className="toast-title">{levelUpToast.title}</div>
                    <div className="toast-desc">{levelUpToast.description}</div>
                </div>
                <div className="toast-glow" />
            </div>
        </div>
    );
}
