import { BlockType, useStore } from '../hooks/useStore';
import * as THREE from 'three';
import { useBox } from '@react-three/cannon';
import { useMemo, useState, useRef, useEffect } from 'react';

const textureLoader = new THREE.TextureLoader();

const TEXTURES = {
  dirt: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/dirt.png',
  grass: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/grass_top.png',
  glass: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/glass.png',
  wood: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/planks_oak.png',
  log: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/log_oak.png',
  cobblestone: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/cobblestone.png',
  stone: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/stone.png',
  leaves: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/leaves_oak.png',
  ice: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/ice.png',
  sand: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/sand.png',
  gravel: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/gravel.png',
  bedrock: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/bedrock.png',
  coal_ore: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/coal_ore.png',
  iron_ore: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/iron_ore.png',
  gold_ore: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/gold_ore.png',
  diamond_ore: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/diamond_ore.png',
  obsidian: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/obsidian.png',
  bricks: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/brick.png',
  bookshelf: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/bookshelf.png',
  tnt: 'https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/tnt_side.png',
};

// Create textures once
const loadedTextures: Record<string, THREE.Texture> = {};
Object.entries(TEXTURES).forEach(([key, url]) => {
  const tex = textureLoader.load(url);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  loadedTextures[key] = tex;
});

export const Voxels = () => {
  const blocks = useStore((state) => state.blocks);

  // Group blocks by type for instancing
  const blocksByType = useMemo(() => {
    const groups: Record<BlockType, [number, number, number][]> = {} as any;
    blocks.forEach((b) => {
      if (!groups[b.type]) groups[b.type] = [];
      groups[b.type].push(b.pos);
    });
    return groups;
  }, [blocks]);

  return (
    <>
      {Object.entries(blocksByType).map(([type, positions]) => (
        <VoxelInstance key={type} type={type as BlockType} positions={positions} />
      ))}
    </>
  );
};

const VoxelInstance = ({ type, positions }: { type: BlockType; positions: [number, number, number][] }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = new THREE.Object3D();

  useEffect(() => {
    if (meshRef.current) {
      positions.forEach((pos, i) => {
        tempObject.position.set(...pos);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [positions, tempObject]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[new THREE.BoxGeometry(1, 1, 1), undefined, positions.length]}
    >
      <meshStandardMaterial map={loadedTextures[type]} transparent={type === 'glass' || type === 'ice'} opacity={type === 'ice' ? 0.6 : 1} />
    </instancedMesh>
  );
}

const breakSound = new Audio('https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/sounds/dig/grass1.ogg');
const placeSound = new Audio('https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/sounds/dig/wood1.ogg');

export const Block = ({ position, type }: { position: [number, number, number], type: BlockType }) => {
  const [hover, setHover] = useState<number | null>(null);
  const addBlock = useStore((state) => state.addBlock);
  const removeBlock = useStore((state) => state.removeBlock);
  const [activeTexture, inventory] = useStore((state) => [state.texture, state.inventory]);

  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }));

  const texture = loadedTextures[type];

  const playSound = (audio: HTMLAudioElement) => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return (
    <mesh
      ref={ref as any}
      onPointerMove={(e) => {
        e.stopPropagation();
        setHover(Math.floor(e.faceIndex! / 2));
      }}
      onPointerOut={() => {
        setHover(null);
      }}
      onContextMenu={(e) => {
        e.nativeEvent.preventDefault();
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex! / 2);
        const [x, y, z] = position;
        let newPos: [number, number, number] | null = null;
        if (clickedFace === 0) newPos = [x + 1, y, z];
        else if (clickedFace === 1) newPos = [x - 1, y, z];
        else if (clickedFace === 2) newPos = [x, y + 1, z];
        else if (clickedFace === 3) newPos = [x, y - 1, z];
        else if (clickedFace === 4) newPos = [x, y, z + 1];
        else if (clickedFace === 5) newPos = [x, y, z - 1];
        
        if (newPos) {
            const canPlace = (inventory[activeTexture] || 0) > 0;
            if (canPlace) {
                addBlock(...newPos);
                playSound(placeSound);
            }
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.button === 0) {
          removeBlock(...position);
          playSound(breakSound);
        }
      }}
    >
      <boxGeometry />
      <meshStandardMaterial
        map={texture}
        color={hover !== null ? '#cccccc' : '#ffffff'}
        transparent={type === 'glass' || type === 'ice'}
        opacity={type === 'glass' || type === 'ice' ? 0.7 : 1}
      />
    </mesh>
  );
};

export const Cubes = () => {
  const blocks = useStore((state) => state.blocks);
  return (
    <>
      {blocks.map((block) => (
        <Block key={block.key} position={block.pos} type={block.type} />
      ))}
    </>
  );
};
