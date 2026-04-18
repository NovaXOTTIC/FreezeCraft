import { useState, useEffect } from 'react';

function actionByKey(key: string) {
  const keys: Record<string, string> = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyA: 'moveLeft',
    KeyD: 'moveRight',
    Space: 'jump',
    Digit1: 'dirt',
    Digit2: 'grass',
    Digit3: 'glass',
    Digit4: 'wood',
    Digit5: 'log',
    Digit6: 'cobblestone',
    Digit7: 'stone',
    Digit8: 'sand',
    Digit9: 'diamond_ore',
    ShiftLeft: 'sprint',
  };
  return keys[key];
}

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    sprint: false,
    dirt: false,
    grass: false,
    glass: false,
    wood: false,
    log: false,
    cobblestone: false,
    stone: false,
    sand: false,
    diamond_ore: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = actionByKey(event.code);
      if (action) {
        setActions((prev) => ({ ...prev, [action]: true }));
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      const action = actionByKey(event.code);
      if (action) {
        setActions((prev) => ({ ...prev, [action]: false }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return actions;
};
