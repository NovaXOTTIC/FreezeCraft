import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type BlockType = 
  | 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'cobblestone' 
  | 'stone' | 'leaves' | 'ice' | 'sand' | 'gravel' | 'bedrock' 
  | 'coal_ore' | 'iron_ore' | 'gold_ore' | 'diamond_ore' | 'obsidian'
  | 'bricks' | 'bookshelf' | 'tnt';

export interface Block {
  key: string;
  pos: [number, number, number];
  type: BlockType;
}

interface State {
  texture: BlockType;
  blocks: Block[];
  inventory: { [key in BlockType]?: number };
  setBlocks: (blocks: Block[]) => void;
  addBlock: (x: number, y: number, z: number, type?: BlockType) => void;
  removeBlock: (x: number, y: number, z: number) => void;
  setTexture: (texture: BlockType) => void;
  saveWorld: () => void;
  resetWorld: () => void;
  craftItem: (recipeId: string) => boolean;
}

const getLocalStorage = (key: string) => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) || 'null');
    return saved;
  } catch {
    return null;
  }
}

const setLocalStorage = (key: string, value: any) => window.localStorage.setItem(key, JSON.stringify(value));

import { RECIPES } from '../lib/recipes';

export const useStore = create<State>((set) => ({
  texture: 'grass',
  blocks: getLocalStorage('world') || [],
  inventory: getLocalStorage('inventory') || { grass: 64, dirt: 64 }, // Start with some blocks
  setBlocks: (blocks) => set(() => ({ blocks })),
  addBlock: (x, y, z, type) => {
    set((state) => {
      const blockType = type || state.texture;
      const count = state.inventory[blockType] || 0;
      
      if (count <= 0) return state; // Can't place if you don't have it

      return {
        blocks: [
          ...state.blocks,
          {
            key: nanoid(),
            pos: [x, y, z],
            type: blockType,
          },
        ],
        inventory: {
            ...state.inventory,
            [blockType]: count - 1,
        }
      };
    });
  },
  removeBlock: (x, y, z) => {
    set((state) => {
      const blockToRemove = state.blocks.find(b => {
        const [bx, by, bz] = b.pos;
        return bx === Math.round(x) && by === Math.round(y) && bz === Math.round(z);
      });

      if (!blockToRemove) return state;

      return {
        blocks: state.blocks.filter((block) => block.key !== blockToRemove.key),
        inventory: {
            ...state.inventory,
            [blockToRemove.type]: (state.inventory[blockToRemove.type] || 0) + 1,
        }
      };
    });
  },
  setTexture: (texture) => {
    set(() => ({ texture }));
  },
  saveWorld: () => {
    set((state) => {
      setLocalStorage('world', state.blocks);
      setLocalStorage('inventory', state.inventory);
      return state;
    });
  },
  resetWorld: () => {
    set(() => {
        localStorage.removeItem('world');
        localStorage.removeItem('inventory');
        return { blocks: [], inventory: { grass: 64, dirt: 64 } };
    });
  },
  craftItem: (recipeId: string) => {
    let success = false;
    set((state) => {
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (!recipe) return state;

      // Check ingredients
      const canCraft = Object.entries(recipe.ingredients).every(([ing, amount]) => {
        return (state.inventory[ing as BlockType] || 0) >= (amount || 0);
      });

      if (!canCraft) return state;

      success = true;
      const newInventory = { ...state.inventory };
      Object.entries(recipe.ingredients).forEach(([ing, amount]) => {
        newInventory[ing as BlockType] = (newInventory[ing as BlockType] || 0) - (amount || 0);
      });

      newInventory[recipe.result] = (newInventory[recipe.result] || 0) + recipe.resultCount;

      return { inventory: newInventory };
    });
    return success;
  }
}));
