import { usePlane } from '@react-three/cannon';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/textures/blocks/grass_top.png');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(100, 100);
grassTexture.magFilter = THREE.NearestFilter;

const placeSound = new Audio('https://raw.githubusercontent.com/Lax1dude/eaglecraft-assets-1.8.8/main/assets/minecraft/sounds/dig/wood1.ogg');

export const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  const addBlock = useStore((state) => state.addBlock);
  const activeTexture = useStore((state) => state.texture);
  const inventory = useStore((state) => state.inventory);

  return (
    <mesh
      ref={ref as any}
      onClick={(e) => {
        e.stopPropagation();
        const [x, y, z] = [Math.round(e.point.x), Math.round(e.point.y + 0.5), Math.round(e.point.z)];
        
        const canPlace = (inventory[activeTexture] || 0) > 0;
        if (canPlace) {
            addBlock(x, y, z);
            placeSound.currentTime = 0;
            placeSound.play().catch(() => {});
        }
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={grassTexture} />
    </mesh>
  );
};
