import { useEffect, useState } from 'react';
import { useStore, BlockType } from '../hooks/useStore';
import { motion } from 'motion/react';
import { Hammer } from 'lucide-react';
import { CraftingUI } from './CraftingUI';

const blocks: Record<BlockType, { color: string; label: string }> = {
  dirt: { color: '#4a3d34', label: 'Dirt' },
  grass: { color: '#59a03c', label: 'Grass' },
  glass: { color: '#e8f4f8', label: 'Glass' },
  wood: { color: '#7a5c3e', label: 'Wood' },
  log: { color: '#4d3b2b', label: 'Log' },
  cobblestone: { color: '#7b7b7b', label: 'Stone' },
  stone: { color: '#8c8c8c', label: 'Rocks' },
  leaves: { color: '#2e7d32', label: 'Leaves' },
  ice: { color: '#81d4fa', label: 'Ice' },
  sand: { color: '#d7c297', label: 'Sand' },
  gravel: { color: '#9a9590', label: 'Gravel' },
  bedrock: { color: '#333333', label: 'Bedrock' },
  coal_ore: { color: '#2c2c2c', label: 'Coal' },
  iron_ore: { color: '#e2d2c1', label: 'Iron' },
  gold_ore: { color: '#fdd835', label: 'Gold' },
  diamond_ore: { color: '#00e5ff', label: 'Diamond' },
  obsidian: { color: '#1a1a1a', label: 'Obsidian' },
  bricks: { color: '#b71c1c', label: 'Bricks' },
  bookshelf: { color: '#5d4037', label: 'Books' },
  tnt: { color: '#f44336', label: 'TNT' },
};

const HOTBAR_BLOCKS: BlockType[] = [
    'grass', 'dirt', 'stone', 'cobblestone', 'wood', 'log', 'glass', 'sand', 'diamond_ore'
];

export const UI = () => {
  const [activeTexture, setTexture, saveWorld, resetWorld, inventory] = useStore((state) => [state.texture, state.setTexture, state.saveWorld, state.resetWorld, state.inventory]);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isCraftingOpen, setIsCraftingOpen] = useState(false);

  useEffect(() => {
    const handleLock = () => setIsPointerLocked(document.pointerLockElement !== null);
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'KeyE') {
            setIsCraftingOpen(prev => !prev);
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
        }
    };

    document.addEventListener('pointerlockchange', handleLock);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
        document.removeEventListener('pointerlockchange', handleLock);
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <CraftingUI isOpen={isCraftingOpen} onClose={() => setIsCraftingOpen(false)} blocksConfig={blocks} />

      {/* Top Buttons (Save/Reset) */}
      <div className="fixed top-8 right-8 flex gap-4 z-50">
        <button 
          onClick={() => setIsCraftingOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 flex items-center gap-2"
        >
          <Hammer size={16} />
          CRAFTING
        </button>
        <button 
          onClick={() => saveWorld()}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border-b-4 border-green-800 active:translate-y-1 active:border-b-0"
        >
          SAVE WORLD
        </button>
        <button 
          onClick={() => {
            if(confirm("Are you sure? This will delete your current world.")) {
              resetWorld();
              window.location.reload();
            }
          }}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border-b-4 border-red-800 active:translate-y-1 active:border-b-0"
        >
          RESET WORLD
        </button>
      </div>

      {/* Crosshair */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="w-4 h-4 border-2 border-white opacity-50 rounded-full" />
      </div>

      {/* Instructions */}
      {!isPointerLocked && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100] text-white">
          <div className="text-center p-8 bg-slate-900 border-2 border-slate-700 rounded-lg shadow-2xl">
            <h1 className="text-4xl font-bold mb-4 tracking-tighter uppercase italic">Minecraft</h1>
            <p className="mb-2">Click to start playing</p>
            <div className="text-sm text-slate-400 mt-4 space-y-1">
              <p>WASD to Move | SHIFT to Sprint | SPACE to Jump</p>
              <p>LEFT CLICK to Mine | RIGHT CLICK to Build</p>
              <p>Numbers 1-9 to change blocks | E to Open Crafting</p>
            </div>
          </div>
        </div>
      )}

      {/* Hotbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 z-50">
        {HOTBAR_BLOCKS.map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTexture(type)}
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${
              activeTexture === type ? 'ring-4 ring-blue-400 scale-110 shadow-lg bg-white/10' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: blocks[type].color }}
          >
            <span className="text-[9px] text-white font-bold drop-shadow-md text-center leading-tight uppercase">
              {blocks[type].label}
            </span>
            <span className="absolute -top-1 -right-1 bg-slate-900 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white/20 text-blue-300 font-black">
              {inventory[type] || 0}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Title */}
      <div className="fixed top-8 left-8 text-white z-50">
        <h2 className="text-2xl font-black italic tracking-tighter opacity-20">Minecraft</h2>
      </div>
    </>
  );
};
