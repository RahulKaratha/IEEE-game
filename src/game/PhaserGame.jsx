import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import EventBus from './EventBus';
import useGameStore from '../store/useGameStore';

export default function PhaserGame({ className }) {
    const containerRef = useRef(null);
    const gameRef = useRef(null);
    const sceneRef = useRef(null);
    const logLenRef = useRef(0);

    useEffect(() => {
        if (!containerRef.current || gameRef.current) return;

        const config = {
            type: Phaser.CANVAS,           // CANVAS avoids WebGL texture-gen issues
            parent: containerRef.current,
            backgroundColor: '#1a472a',    // dark green fallback while scene draws
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false },
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1280,               // fixed design width
                height: 720,               // fixed design height
            },
            scene: [GameScene],
            antialias: false,
            roundPixels: true,
        };

        gameRef.current = new Phaser.Game(config);

        EventBus.on('scene-ready', (scene) => {
            sceneRef.current = scene;
        });

        EventBus.on('open-modal', (buildingId) => {
            useGameStore.getState().openModal(buildingId);
        });

        const handleResize = () => {
            if (gameRef.current) {
                gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            EventBus.removeAllListeners('scene-ready');
            EventBus.removeAllListeners('open-modal');
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    // Forward XP/level into Phaser scene; trigger floating XP text on new activities
    useEffect(() => {
        const unsub = useGameStore.subscribe((state) => {
            EventBus.emit('xp-update', {
                xp: state.xp,
                level: state.levelData.level,
            });
            const newLen = state.activityLog.length;
            if (sceneRef.current?.showXPGain && newLen > logLenRef.current) {
                const last = state.activityLog[newLen - 1];
                if (last) sceneRef.current.showXPGain(last.xp);
                logLenRef.current = newLen;
            }
        });
        return unsub;
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            id="phaser-container"
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
        />
    );
}
