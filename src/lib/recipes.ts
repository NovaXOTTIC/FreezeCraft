import { BlockType } from '../hooks/useStore';

export interface Recipe {
  id: string;
  result: BlockType;
  resultCount: number;
  ingredients: { [key in BlockType]?: number };
  description: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'planks',
    result: 'wood',
    resultCount: 4,
    ingredients: { log: 1 },
    description: 'Refine logs into usable wood planks.',
  },
  {
    id: 'bookshelf',
    result: 'bookshelf',
    resultCount: 1,
    ingredients: { wood: 6, dirt: 3 }, // Simplified for now since we don't have paper/leather
    description: 'Combine wood and some organic matter for knowledge.',
  },
  {
    id: 'cobblestone_to_stone',
    result: 'stone',
    resultCount: 1,
    ingredients: { cobblestone: 1 },
    description: 'Smelt or refine cobblestone back into smooth stone.',
  },
  {
    id: 'glass_from_sand',
    result: 'glass',
    resultCount: 1,
    ingredients: { sand: 1 },
    description: 'Heat sand to create translucent glass.',
  },
  {
    id: 'bricks',
    result: 'bricks',
    resultCount: 1,
    ingredients: { stone: 4 },
    description: 'Shape stone into structured bricks.',
  },
  {
    id: 'tnt',
    result: 'tnt',
    resultCount: 1,
    ingredients: { sand: 4, coal_ore: 1 }, // Simplified
    description: 'Dangerous explosive for rapid excavation.',
  },
];
