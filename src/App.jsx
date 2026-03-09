import './index.css';
import { useState, useEffect } from 'react';
import PhaserGame from './game/PhaserGame';
import HUD from './components/game/HUD';
import ActivityModal from './components/game/ActivityModal';
import EvolutionToast from './components/game/EvolutionToast';
import FinalScreen from './components/game/FinalScreen';
import VirtualJoystick from './components/game/VirtualJoystick';
import InteractButton from './components/game/InteractButton';
import LoadingScreen from './components/game/LoadingScreen';
import useGameStore from './store/useGameStore';

function App() {
  const showFinalScreen = useGameStore(s => s.showFinalScreen);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Phaser canvas – full screen */}
      <PhaserGame />

      {/* HUD overlaid on game */}
      <HUD />

      {/* Mobile controls */}
      {isTouchDevice && (
        <>
          <VirtualJoystick />
          <InteractButton />
        </>
      )}

      {/* Building activity modals */}
      <ActivityModal />

      {/* Level-up toast */}
      <EvolutionToast />

      {/* Final screen */}
      {showFinalScreen && <FinalScreen />}

      {/* Loading screen – sits on top of everything, fades out on scene-ready */}
      <LoadingScreen />
    </div>
  );
}

export default App;
