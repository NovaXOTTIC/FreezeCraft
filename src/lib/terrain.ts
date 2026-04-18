import { createNoise2D } from 'simplex-noise';
import { BlockType, Block } from '../hooks/useStore';
import { nanoid } from 'nanoid';

export const generateTerrain = (setBlocks: any) => {
  const noise2D = createNoise2D();
  const SIZE = 20;
  const DEPTH = 5;
  const newBlocks: Block[] = [];

  for (let x = -SIZE; x < SIZE; x++) {
    for (let z = -SIZE; z < SIZE; z++) {
      // Noise gives values between -1 and 1
      const noise = noise2D(x / 15, z / 15);
      const height = Math.floor(noise * 3) + 2;

      for (let y = 0; y <= height; y++) {
        let type: BlockType = 'stone';
        if (y === height) {
          type = 'grass';
        } else if (y > height - 3) {
          type = 'dirt';
        }

        newBlocks.push({ key: nanoid(), pos: [x, y, z], type });
      }

      // Random trees
      if (Math.random() > 0.98 && height > 0) {
        const treeX = x;
        const treeZ = z;
        const trunkHeight = 4 + Math.floor(Math.random() * 2);

        // Trunk
        for (let i = 1; i <= trunkHeight; i++) {
          newBlocks.push({ key: nanoid(), pos: [treeX, height + i, treeZ], type: 'log' });
        }

        // Leaves
        for (let lx = -2; lx <= 2; lx++) {
          for (let lz = -2; lz <= 2; lz++) {
            for (let ly = 0; ly <= 2; ly++) {
              if (Math.abs(lx) + Math.abs(lz) + Math.abs(ly) < 4) {
                newBlocks.push({ key: nanoid(), pos: [treeX + lx, height + trunkHeight + ly, treeZ + lz], type: 'leaves' });
              }
            }
          }
        }
      }
    }
  }
  
  setBlocks(newBlocks);
};
