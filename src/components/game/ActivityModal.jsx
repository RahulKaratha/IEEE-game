import { useState, useEffect } from 'react';
import useGameStore from '../../store/useGameStore';

// ── Hackathon: Compile & Deploy rhythm game (+250 XP) ────────────────────────
function HackathonActivity({ onComplete, done }) {
    const [started, setStarted] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 100
    const [dir, setDir] = useState(1);
    const [successes, setSuccesses] = useState(0);
    const [failed, setFailed] = useState(false);

    // The "sweet spot" is 40% to 60%
    const inZone = progress >= 40 && progress <= 60;

    useEffect(() => {
        if (!started || done || successes >= 3 || failed) return;

        let currentProgress = progress;
        let currentDir = dir;

        // Speed up a little each success
        const speed = 2.5 + (successes * 1.5);

        const t = setInterval(() => {
            currentProgress += currentDir * speed;
            if (currentProgress > 100) { currentProgress = 100; currentDir = -1; setDir(-1); }
            if (currentProgress < 0) { currentProgress = 0; currentDir = 1; setDir(1); }
            setProgress(currentProgress);
        }, 30);
        return () => clearInterval(t);
    }, [started, done, successes, failed, progress, dir]);

    const handleDeploy = () => {
        if (inZone) {
            setSuccesses(s => {
                const newS = s + 1;
                if (newS >= 3) {
                    setTimeout(() => onComplete(250, 'Hackathon Arena'), 500);
                }
                return newS;
            });
        } else {
            setFailed(true);
            setTimeout(() => {
                setFailed(false);
                setSuccesses(0); // reset game on fail
                setProgress(0);
            }, 1000);
        }
    };

    return (
        <div className="activity-content">
            <div className="activity-icon">⚡</div>
            <h3>24-Hour Hackathon</h3>
            {!started ? (
                <>
                    <p className="activity-desc">Deploy your code exactly when the server is ready!</p>
                    <p className="activity-desc">Tap when the indicator is in the <strong style={{ color: '#22c55e' }}>Green Zone</strong> 3 times.</p>
                    <p className="activity-desc">Earn <span className="xp-chip">+250 XP</span></p>
                    <button className="btn-primary" onClick={() => setStarted(true)} disabled={done} style={{ marginTop: 10 }}>
                        Start Coding →
                    </button>
                </>
            ) : successes >= 3 ? (
                <div className="activity-complete">🏆 Hackathon Won! Code Deployed!</div>
            ) : (
                <div style={{ width: '100%', marginTop: 10 }}>
                    <p className="activity-desc" style={{ marginBottom: 15 }}>
                        Successful Deploys: <strong style={{ color: '#f1f5f9' }}>{successes} / 3</strong>
                    </p>

                    {/* Timing Bar Container */}
                    <div style={{
                        width: '100%', height: 32, background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,255,255,0.1)', borderRadius: 16,
                        position: 'relative', overflow: 'hidden', marginBottom: 20,
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        {/* Target Zone */}
                        <div style={{
                            position: 'absolute', left: '40%', width: '20%', height: '100%',
                            background: failed ? '#ef4444' : (inZone ? '#22c55e' : 'rgba(34,197,94,0.3)'),
                            boxShadow: inZone && !failed ? '0 0 15px #22c55e' : 'none',
                            transition: 'background 0.1s'
                        }} />

                        {/* Moving Indicator */}
                        <div style={{
                            position: 'absolute', left: `${progress}%`, top: 0, bottom: 0,
                            width: 6, background: '#fff', marginLeft: -3,
                            boxShadow: '0 0 8px #fff', borderRadius: 3
                        }} />
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleDeploy}
                        style={{
                            width: '100%', padding: 16, fontSize: '18px',
                            background: failed ? '#ef4444' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
                        }}
                        disabled={failed}
                    >
                        {failed ? 'DEPLOY FAILED! Rebooting...' : '⚡ DEPLOY CODE ⚡'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Workshop: 8-second attend timer (+200 XP) ────────────────────────────
function WorkshopActivity({ onComplete, done }) {
    const [timer, setTimer] = useState(8);
    const [started, setStarted] = useState(false);
    const topics = ['IoT & Embedded Systems', 'Machine Learning 101', 'PCB Design', 'Cloud & DevOps'];
    const [topic] = useState(() => topics[Math.floor(Math.random() * topics.length)]);

    useEffect(() => {
        if (!started || done || timer <= 0) {
            if (timer <= 0) onComplete(200, 'Workshop Hall');
            return;
        }
        const t = setTimeout(() => setTimer(v => v - 1), 1000);
        return () => clearTimeout(t);
    }, [timer, started, done]);

    return (
        <div className="activity-content">
            <div className="activity-icon">🔧</div>
            <h3>IEEE Workshop</h3>
            <p className="activity-desc">Topic: <strong style={{ color: '#60a5fa' }}>{topic}</strong></p>
            <p className="activity-desc">Stay for the full session — earn <span className="xp-chip">+200 XP</span></p>
            {!started ? (
                <button className="btn-primary" onClick={() => setStarted(true)}>▶ Join Workshop</button>
            ) : timer > 0 ? (
                <div className="timer-wrap">
                    <svg className="timer-ring" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="6" fill="none" />
                        <circle cx="40" cy="40" r="34" stroke="#3b82f6" strokeWidth="6" fill="none"
                            strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (timer / 8)}
                            strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }} />
                        <text x="40" y="46" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold">{timer}</text>
                    </svg>
                    <p className="timer-label">seconds of session remaining…</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
                        {['💻', '📊', '🔬', '💡'].map((em, i) =>
                            <span key={i} style={{ fontSize: 24, animation: `float-icon ${1.2 + i * 0.3}s ease-in-out infinite` }}>{em}</span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="activity-complete">✅ Workshop Complete!</div>
            )}
        </div>
    );
}

// ── IEEE Events: pick an event type then 5s countdown (+200 XP) ──────────
const EVENT_TYPES = [
    { label: 'Technical Talk', icon: '🎤', color: '#6366f1' },
    { label: 'Panel Discussion', icon: '👥', color: '#0ea5e9' },
    { label: 'Research Showcase', icon: '🔬', color: '#10b981' },
    { label: 'Networking Night', icon: '🤝', color: '#f59e0b' },
];
function EventsActivity({ onComplete, done }) {
    const [picked, setPicked] = useState(null);
    const [timer, setTimer] = useState(5);
    const [counting, setCounting] = useState(false);

    useEffect(() => {
        if (!counting || done || timer <= 0) {
            if (timer <= 0) onComplete(200, 'IEEE Events Center');
            return;
        }
        const t = setTimeout(() => setTimer(v => v - 1), 1000);
        return () => clearTimeout(t);
    }, [timer, counting, done]);

    const pick = (ev) => { setPicked(ev); setCounting(true); };

    return (
        <div className="activity-content">
            <div className="activity-icon">📅</div>
            <h3>IEEE Events Center</h3>
            <p className="activity-desc">Choose an event to attend — earn <span className="xp-chip">+200 XP</span></p>
            {!picked ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
                    {EVENT_TYPES.map((ev, i) => (
                        <button key={i} className="btn-primary" disabled={done}
                            style={{ background: `linear-gradient(135deg,${ev.color}cc,${ev.color})`, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, borderRadius: 14 }}
                            onClick={() => pick(ev)}>
                            <span style={{ fontSize: 28 }}>{ev.icon}</span>
                            <span style={{ fontSize: 13 }}>{ev.label}</span>
                        </button>
                    ))}
                </div>
            ) : timer > 0 ? (
                <div className="timer-wrap">
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{picked.icon}</div>
                    <p style={{ fontWeight: 700, color: picked.color, fontSize: 16 }}>{picked.label}</p>
                    <svg className="timer-ring" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="6" fill="none" />
                        <circle cx="40" cy="40" r="34" stroke={picked.color} strokeWidth="6" fill="none"
                            strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (timer / 5)}
                            strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }} />
                        <text x="40" y="46" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold">{timer}</text>
                    </svg>
                    <p className="timer-label">event in progress…</p>
                </div>
            ) : (
                <div className="activity-complete">✅ Event Attended!</div>
            )}
            {done && picked && <div className="activity-complete">✅ Event Attended!</div>}
        </div>
    );
}

// ── Volunteering: Tracing Activity (+250 XP) ──────────────────────────────
function VolunteeringActivity({ onComplete, done }) {
    const TARGET = ['N', 'I', 'S', 'B'];
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const [letters, setLetters] = useState(() => shuffle(TARGET));
    const [picked, setPicked] = useState([]);
    const [wrongPick, setWrongPick] = useState(false);
    const [finished, setFinished] = useState(false);

    const resetChallenge = () => {
        setPicked([]);
        setLetters(shuffle(TARGET));
    };

    const chooseLetter = (letter, idx) => {
        if (done || finished) return;
        const expected = TARGET[picked.length];

        if (letter !== expected) {
            setWrongPick(true);
            setTimeout(() => {
                setWrongPick(false);
                resetChallenge();
            }, 550);
            return;
        }

        const nextPicked = [...picked, letter];
        setPicked(nextPicked);
        setLetters(prev => prev.filter((_, i) => i !== idx));

        if (nextPicked.length === TARGET.length) {
            setFinished(true);
            setTimeout(() => onComplete(250, 'Volunteering Hub'), 700);
        }
    };

    useEffect(() => {
        if (!done) return;
        setFinished(true);
    }, [done]);

    return (
        <div className="activity-content">
            <div className="activity-icon">🤝</div>
            <h3>Creative Volunteering</h3>
            <p className="activity-desc">Build the NISB logo by selecting letters in order — earn <span className="xp-chip">+250 XP</span></p>

            {!finished ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: '100%', borderRadius: 14, padding: 14,
                        background: wrongPick ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                        border: `1.5px solid ${wrongPick ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.35)'}`,
                        transition: 'all 0.2s ease'
                    }}>
                        <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 10 }}>Tap letters in this order: <strong style={{ color: '#fbbf24' }}>N → I → S → B</strong></p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {TARGET.map((_, i) => (
                                <div key={i} style={{
                                    height: 42,
                                    borderRadius: 10,
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: picked[i] ? 'rgba(34,197,94,0.22)' : 'rgba(15,23,42,0.55)',
                                    border: `1px solid ${picked[i] ? 'rgba(34,197,94,0.7)' : 'rgba(148,163,184,0.3)'}`,
                                    fontWeight: 800,
                                    color: picked[i] ? '#22c55e' : '#64748b',
                                    fontSize: 20,
                                }}>
                                    {picked[i] || '?'}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, width: '100%' }}>
                        {letters.map((letter, idx) => (
                            <button
                                key={`${letter}-${idx}`}
                                className="btn-primary"
                                onClick={() => chooseLetter(letter, idx)}
                                style={{
                                    padding: '12px 0',
                                    fontSize: 24,
                                    fontWeight: 900,
                                    borderRadius: 12,
                                    background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
                                }}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    <p style={{ fontSize: 13, color: wrongPick ? '#fca5a5' : '#94a3b8' }}>
                        {wrongPick ? 'Wrong order! Board reshuffled.' : `Logo progress: ${picked.length}/4 letters`}
                    </p>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        margin: '0 auto 10px',
                        width: 190,
                        height: 100,
                        borderRadius: 16,
                        background: 'radial-gradient(circle at 30% 20%, rgba(251,191,36,0.35), rgba(15,23,42,0.9))',
                        border: '1.5px solid rgba(251,191,36,0.45)',
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 0 24px rgba(251,191,36,0.35)'
                    }}>
                        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 4, color: '#fbbf24' }}>NISB</div>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>NISB Logo Completed!</p>
                    <div className="activity-complete" style={{ marginTop: 12 }}>✅ Volunteering Complete!</div>
                </div>
            )}
        </div>
    );
}

// ── Industry Visit: Tech Tours (+300 XP) ──────────────────────────────────
const COMPANIES = [
    { name: 'Qualcomm', color: '#3253a8', icon: '📱' },
    { name: 'ISRO', color: '#ff9933', icon: '🚀' },
    { name: 'Google', color: '#ea4335', icon: '🔍' },
    { name: 'Bosch', color: '#005b9f', icon: '⚙️' },
    { name: 'Microsoft', color: '#107c41', icon: '💻' }
];

function IndustryVisitActivity({ onComplete, done }) {
    const [company] = useState(() => COMPANIES[Math.floor(Math.random() * COMPANIES.length)]);
    const [progress, setProgress] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started || done || progress >= 100) {
            if (progress >= 100) onComplete(300, 'Industry Visit');
            return;
        }
        const t = setInterval(() => setProgress(p => Math.min(100, p + 20)), 800);
        return () => clearInterval(t);
    }, [progress, started, done]);

    return (
        <div className="activity-content">
            <div className="activity-icon">🏭</div>
            <h3>Industry Tech Tour</h3>
            <p className="activity-desc">
                Visiting: <strong style={{ color: company.color }}>{company.icon} {company.name}</strong>
            </p>
            <p className="activity-desc">Network and learn — earn <span className="xp-chip">+300 XP</span></p>

            {!started ? (
                <button className="btn-primary" onClick={() => setStarted(true)} disabled={done}>
                    🚌 Board the Bus
                </button>
            ) : progress < 100 ? (
                <div style={{ width: '100%', marginTop: 20 }}>
                    {/* Animated Bus Scene */}
                    <div style={{ position: 'relative', height: 80, marginBottom: 8, background: '#1e293b', borderRadius: 8, overflow: 'hidden', borderBottom: '4px solid #475569' }}>
                        {/* Static Scenery */}
                        <div style={{ position: 'absolute', bottom: 10, left: '20%', fontSize: 20 }}>🌲</div>
                        <div style={{ position: 'absolute', bottom: 10, left: '60%', fontSize: 24 }}>🏢</div>

                        {/* Driving Bus Image */}
                        <img
                            src="/assets/bus.png"
                            alt="Bus"
                            style={{
                                width: 56,
                                position: 'absolute',
                                left: `${progress - 10}%`,
                                bottom: 10,
                                transition: 'left 0.8s linear',
                                filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.6))'
                            }}
                        />

                        {/* Road Lines */}
                        <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, height: 2, background: 'repeating-linear-gradient(90deg, #fbbf24, #fbbf24 10px, transparent 10px, transparent 20px)' }} />
                    </div>
                    <div className="progress-bg" style={{ height: 6, borderRadius: 3 }}>
                        <div className="progress-fill" style={{ width: `${progress}%`, background: company.color }} />
                    </div>
                    <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, fontWeight: 'bold' }}>Driving to {company.name}... {progress}%</p>
                </div>
            ) : (
                <div className="activity-complete">✅ Tech Tour Complete!</div>
            )}
        </div>
    );
}

// ── Left Bus – Future Map (Coming Soon) ─────────────────────────────────────────
function BusLeftActivity({ onClose }) {
    return (
        <div className="activity-content" style={{ textAlign: 'center' }}>
            <div className="activity-icon" style={{ fontSize: 56, marginBottom: 10 }}>🚌</div>
            <h3 style={{ color: '#fbbf24', fontSize: 22, marginBottom: 8 }}>Next Stop: Mystery Map</h3>
            <p className="activity-desc" style={{ marginBottom: 18 }}>
                This bus is heading somewhere <strong style={{ color: '#60a5fa' }}>brand new</strong>.
                <br />The destination is still under construction, though!
            </p>
            <div style={{
                padding: '18px 24px', borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(29,78,216,0.25), rgba(15,23,42,0.9))',
                border: '1.5px solid rgba(251,191,36,0.4)',
                boxShadow: '0 0 24px rgba(251,191,36,0.15)',
                marginBottom: 20,
            }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🚧</div>
                <p style={{ fontSize: 15, color: '#fbbf24', fontWeight: 700 }}>Map Coming Soon!</p>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
                    Come back soon — the next map is being built by the crew!
                </p>
            </div>
            <button className="btn-primary" onClick={onClose}
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                ← Back to Campus
            </button>
        </div>
    );
}

// ── IEEE HQ Activity ──────────────────────────────────────────────────────
function HQActivity({ activityLog }) {
    return (
        <div className="activity-content hq-content">
            <div className="hq-header">
                <div className="hq-logo">IEEE</div>
                <h3 style={{ color: '#f1f5f9', fontSize: 20, marginTop: 8 }}>NISB Club (IEEE HQ)</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
                    You have proven yourself.<br />Welcome, <strong style={{ color: '#fbbf24' }}>Professional Member</strong>.
                </p>
            </div>
            <div className="activity-log" style={{ width: '100%' }}>
                {activityLog.map((e, i) => (
                    <div key={i} className="log-entry">
                        <span className="log-building">{e.building}</span>
                        <span className="log-xp">+{e.xp} XP</span>
                    </div>
                ))}
            </div>
            <div className="total-xp">
                🎓 Total: {activityLog.reduce((s, e) => s + e.xp, 0)} XP Earned
            </div>
        </div>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────
// ── Scenic Locations (0 XP, Just for fun) ───────────────────────────────────
function ScenicActivity({ onComplete, done, icon, title, desc }) {
    const [claimed, setClaimed] = useState(false);

    return (
        <div className="activity-content">
            <div className="activity-icon" style={{ fontSize: 48 }}>{icon}</div>
            <h3>{title}</h3>
            <p className="activity-desc">{desc}</p>

            {!done && !claimed ? (
                <button className="btn-primary" onClick={() => {
                    setClaimed(true);
                    setTimeout(() => onComplete(0, title), 400); // 0 XP!
                }} style={{ marginTop: 10 }}>
                    Take a Break
                </button>
            ) : (
                <div className="activity-complete">✅ Visited!</div>
            )}
        </div>
    );
}

export default function ActivityModal() {
    const { activeModal, closeModal, gainXP, activityLog, triggerFinalScreen, completedBuildings } = useGameStore();
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (activeModal) {
            const nameMap = {
                hackathon: 'Hackathon Arena',
                workshop: 'Workshop Hall',
                events: 'Sir MV Hall',
                volunteering: 'Volunteering Hub',
                industry: 'Industry Visit',
                golden_jubilee: 'Golden Jubilee',
                diamond_jubilee: 'Diamond Jubilee',
                virgin_tree: 'Virgin Tree',
                red_canteen: 'Red Canteen',
                chai_shop: 'Chai Shop'
            };
            setDone(completedBuildings.has(nameMap[activeModal] ?? ''));
        }
    }, [activeModal]);

    if (!activeModal) return null;

    // Bus left modal bypasses the standard modal frame
    if (activeModal === 'bus_left') {
        const busColor = '#fbbf24';
        const busTitle = '← Future Map';
        return (
            <div className="modal-backdrop" onClick={closeModal} onTouchStart={closeModal}>
                <div className="modal-card"
                    style={{ '--modal-color': busColor, '--modal-bg': 'rgba(15,23,42,0.95)' }}
                    onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
                    <div className="modal-header" style={{ borderColor: busColor }}>
                        <h2 style={{ color: busColor }}>🚌 {busTitle}</h2>
                        <button className="modal-close" onClick={closeModal}>✕</button>
                    </div>
                    <div className="modal-body">
                        <BusLeftActivity onClose={closeModal} />
                    </div>
                </div>
            </div>
        );
    }

    const handleComplete = (amount, building) => {
        if (!completedBuildings.has(building)) gainXP(amount, building);
        setDone(true);
    };
    const handleClose = () => {
        if (activeModal === 'hq') triggerFinalScreen();
        closeModal();
    };

    const info = {
        hackathon: { title: 'Hackathon Arena', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
        workshop: { title: 'Workshop Hall', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
        events: { title: 'Sir MV Hall', color: '#9333ea', bg: 'rgba(147,51,234,0.08)' },
        volunteering: { title: 'Volunteering Hub', color: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
        industry: { title: 'Industry Visit', color: '#db2777', bg: 'rgba(219,39,119,0.08)' },
        hq: { title: 'NISB Club (IEEE HQ)', color: '#b45309', bg: 'rgba(180,83,9,0.08)' },
        golden_jubilee: { title: 'Golden Jubilee', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
        diamond_jubilee: { title: 'Diamond Jubilee', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
        virgin_tree: { title: 'Virgin Tree', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
        red_canteen: { title: 'Red Canteen', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
        chai_shop: { title: 'Chai Shop', color: '#a8a29e', bg: 'rgba(168,162,158,0.08)' }
    }[activeModal];

    return (
        <div className="modal-backdrop" onClick={handleClose} onTouchStart={handleClose}>
            <div className="modal-card" style={{ '--modal-color': info.color, '--modal-bg': info.bg }}
                onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
                <div className="modal-header" style={{ borderColor: info.color }}>
                    <h2 style={{ color: info.color }}>{info.title}</h2>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>
                <div className="modal-body">
                    {activeModal === 'hackathon' && <HackathonActivity onComplete={handleComplete} done={done} />}
                    {activeModal === 'workshop' && <WorkshopActivity onComplete={handleComplete} done={done} />}
                    {activeModal === 'events' && <EventsActivity onComplete={handleComplete} done={done} />}
                    {activeModal === 'volunteering' && <VolunteeringActivity onComplete={handleComplete} done={done} />}
                    {activeModal === 'industry' && <IndustryVisitActivity onComplete={handleComplete} done={done} />}
                    {activeModal === 'golden_jubilee' && <ScenicActivity onComplete={handleComplete} done={done} icon="🏢" title="Golden Jubilee" desc="Visit the historic Academic Block." />}
                    {activeModal === 'diamond_jubilee' && <ScenicActivity onComplete={handleComplete} done={done} icon="💎" title="Diamond Jubilee" desc="Check out the Sports & Recreation center." />}
                    {activeModal === 'virgin_tree' && <ScenicActivity onComplete={handleComplete} done={done} icon="🌳" title="Virgin Tree" desc="Hang out and absorb the campus vibes." />}
                    {activeModal === 'red_canteen' && <ScenicActivity onComplete={handleComplete} done={done} icon="🍔" title="Red Canteen" desc="Grab a quick bite to recharge." />}
                    {activeModal === 'chai_shop' && <ScenicActivity onComplete={handleComplete} done={done} icon="☕" title="Chai Shop" desc="Sip some tea at the tapri." />}
                    {activeModal === 'hq' && <HQActivity activityLog={activityLog} />}
                </div>
                {(done || activeModal === 'hq') && (
                    <div className="modal-footer">
                        <button className="btn-primary btn-close-modal" onClick={handleClose}>
                            {activeModal === 'hq' ? '🏆 Claim IEEE Membership →' : '← Return to Campus'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
