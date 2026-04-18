import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Player } from './components/Player';
import { Ground } from './components/Ground';
import { Cubes } from './components/Voxels';
import { UI } from './components/UI';
import { TextureController } from './components/TextureController';
import { useStore } from './hooks/useStore';
import { useEffect, useState, useMemo } from 'react';

import { generateTerrain } from './lib/terrain';
import { useFrame } from '@react-three/fiber';

const World = () => {
    const [time, setTime] = useState(0);

    // Day/Night Cycle
    useFrame((state, delta) => {
      setTime((t) => t + delta * 0.05);
    });
  
    const sunPosition = useMemo(() => {
      const angle = time % (Math.PI * 2);
      return [Math.cos(angle) * 100, Math.sin(angle) * 100, 20];
    }, [time]);
  
    const ambientIntensity = useMemo(() => {
      const sin = Math.sin(time % (Math.PI * 2));
      return Math.max(0.1, sin * 1.5);
    }, [time]);

    return (
        <>
            <Sky sunPosition={sunPosition as any} inclination={0} azimuth={0.25} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={ambientIntensity} />
            <Physics gravity={[0, -20, 0]}>
                <Player />
                <Cubes />
                <Ground />
            </Physics>
        </>
    )
}

export default function App() {
  const blocks = useStore((state) => state.blocks);
  const setBlocks = useStore((state) => state.setBlocks);

  // Initial world generation
  useEffect(() => {
    if (blocks.length === 0) {
      generateTerrain(setBlocks);
    }
  }, [setBlocks, blocks.length]);

  return (
    <div className="w-full h-screen bg-sky-300 overflow-hidden">
      <Canvas shadows camera={{ fov: 45 }}>
        <World />
        <PointerLockControls />
      </Canvas>
      <UI />
      <TextureController />
    </div>
  );
}
