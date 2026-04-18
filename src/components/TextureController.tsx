import { useEffect } from 'react';
import { useStore, BlockType } from '../hooks/useStore';
import { useKeyboard } from '../hooks/useKeyboard';

export const TextureController = () => {
  const [setTexture] = useStore((state) => [state.setTexture]);
  const { dirt, grass, glass, wood, log, cobblestone, stone, sand, diamond_ore } = useKeyboard();

  useEffect(() => {
    if (dirt) setTexture('dirt');
    if (grass) setTexture('grass');
    if (glass) setTexture('glass');
    if (wood) setTexture('wood');
    if (log) setTexture('log');
    if (cobblestone) setTexture('cobblestone');
    if (stone) setTexture('stone');
    if (sand) setTexture('sand');
    if (diamond_ore) setTexture('diamond_ore');
  }, [dirt, grass, glass, wood, log, cobblestone, stone, sand, diamond_ore, setTexture]);

  return null;
};
