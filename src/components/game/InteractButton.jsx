import EventBus from '../../game/EventBus';

export default function InteractButton() {
    const handleTap = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        EventBus.emit('mobile-interact');
    };

    return (
        <button
            id="interact-btn"
            onTouchStart={handleTap}
            onClick={handleTap}
            style={{
                position: 'fixed',
                right: 32, bottom: 80,
                zIndex: 500,
                width: 80, height: 80,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.6)',
                background: 'rgba(59,130,246,0.75)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 'bold',
                fontFamily: '"Inter", sans-serif',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(59,130,246,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                touchAction: 'manipulation',
                userSelect: 'none',
            }}
        >
            <span style={{ fontSize: '22px' }}>⚡</span>
            <span>ENTER</span>
        </button>
    );
}
