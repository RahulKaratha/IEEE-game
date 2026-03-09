import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';
import EventBus from '../../game/EventBus';

export default function VirtualJoystick() {
    const zoneRef = useRef(null);
    const joystickRef = useRef(null);

    useEffect(() => {
        if (!zoneRef.current) return;
        joystickRef.current = nipplejs.create({
            zone: zoneRef.current,
            mode: 'static',
            position: { left: '80px', bottom: '80px' },
            size: 120,
            color: 'rgba(255,255,255,0.5)',
            fadeTime: 250,
        });

        joystickRef.current.on('move', (_, data) => {
            const angle = data.angle?.radian ?? 0;
            const force = Math.min(data.force ?? 0, 1);
            EventBus.emit('joystick-move', {
                x: Math.cos(angle) * force,
                y: -Math.sin(angle) * force,
            });
        });

        joystickRef.current.on('end', () => {
            EventBus.emit('joystick-move', { x: 0, y: 0 });
        });

        return () => {
            joystickRef.current?.destroy();
        };
    }, []);

    return (
        <div
            ref={zoneRef}
            id="joystick-zone"
            style={{
                position: 'fixed',
                left: 0, bottom: 0,
                width: 220, height: 220,
                zIndex: 500,
                touchAction: 'none',
            }}
        />
    );
}
