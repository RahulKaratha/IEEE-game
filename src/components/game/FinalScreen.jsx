import { useEffect, useRef } from 'react';
import useGameStore from '../../store/useGameStore';

export default function FinalScreen() {
    const { activityLog, gainXP } = useGameStore();
    const canvasRef = useRef(null); // Keep this as it's used later

    useEffect(() => {
        launchConfetti(canvasRef.current);
    }, []);

    // Calculate totals
    const totalEarned = activityLog.reduce((sum, act) => sum + act.xp, 0);
    const finalScore = 1200 + totalEarned; // HQ gives base 1200 theoretically, plus extra

    // Map building names to their emojis for the UI log
    const buildingIcons = {
        'Hackathon Arena': '⚡',
        'Workshop Hall': '🔧',
        'Sir Mv Hall ': '📅',
        'Sir MV Hall': '🏛️',
        'Volunteering Hub': '🤝',
        'Industry Visit': '🏭',
        'Golden Jubilee': '🏢',
        'Diamond Jubilee': '💎',
        'Virgin Tree': '🌳',
        'Red Canteen': '🍔',
        'Chai Shop': '☕',
        'NISB Club (IEEE HQ)': '🌟',
    };

    return (
        <div className="final-screen">
            <canvas ref={canvasRef} className="confetti-canvas" />

            <div className="final-card">
                {/* Trophy */}
                <div className="final-trophy">🏆</div>
                <h1 className="final-headline">Your Journey is Complete!</h1>
                <p className="final-sub">You've evolved from a Freshman to a <strong>Professional Engineer</strong></p>

                {/* Stats */}
                <div className="final-stats">
                    <div className="stat-item">
                        <div className="stat-val">{finalScore.toLocaleString()}</div>
                        <div className="stat-label">Total XP</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-val">5</div>
                        <div className="stat-label">Max Level</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-val">{activityLog.length}</div>
                        <div className="stat-label">Activities</div>
                    </div>
                </div>

                {/* Activity summary */}
                <div className="final-log">
                    <h3>Activities Completed</h3>
                    {activityLog.map((entry, i) => (
                        <div key={i} className="final-log-row">
                            <span className="final-log-icon">{buildingIcons[entry.building] ?? '📋'}</span>
                            <span className="final-log-name">{entry.building}</span>
                            <span className="final-log-xp">+{entry.xp} XP</span>
                        </div>
                    ))}
                    <div className="final-log-total">
                        <span>Grand Total</span>
                        <span>{totalEarned} XP</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="final-cta-wrap">
                    <a
                        href="https://tinyurl.com/MEMBERSHIPDRIVE26"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ieee-join"
                    >
                        🌐 Join IEEE Now →
                    </a>
                    <a
                        href="https://www.ieee.org/membership/students/benefits.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ieee-guide"
                    >
                        📄 Student Benefits Guide
                    </a>
                </div>

                <p className="final-footer">IEEE – Advancing Technology for Humanity</p>
            </div>
        </div>
    );
}

// ── Canvas Confetti ──
function launchConfetti(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#fbbf24', '#3b82f6', '#10b981', '#ef4444', '#a855f7', '#06b6d4', '#f97316'];
    const pieces = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: -20,
        w: Math.random() * 12 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 3,
        opacity: 1,
    }));

    let raf;
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        pieces.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.rotSpeed;
            if (p.y > canvas.height * 0.6) p.opacity -= 0.02;
            if (p.opacity > 0) {
                alive = true;
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                ctx.rotate((p.rot * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
        });
        if (alive) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
}
