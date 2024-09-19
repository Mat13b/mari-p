'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Text, Plane, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FistL from './fistL';

const MenuMario = () => {
  const boxRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const texture = useTexture('/papier-peint-champignon-fond-bleu-fond-vert-fond-bleu-quelques-feuilles_899870-27651.avif');
  const { viewport } = useThree();
  const [planeSize, setPlaneSize] = useState<[number, number]>([10, 6]);

  useEffect(() => {
    const updatePlaneSize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const width = viewport.width;
      const height = width / aspect;
      setPlaneSize([width, height]);
    };

    updatePlaneSize();
    window.addEventListener('resize', updatePlaneSize);
    return () => window.removeEventListener('resize', updatePlaneSize);
  }, [viewport]);

  useFrame((state, delta) => {
    if (boxRef.current) boxRef.current.rotation.y += delta * 0.5;
  });

  const handleOptionClick = (option: string) => {
    console.log(`Option sélectionnée : ${option}`);
    if (option === 'Nouvelle Partie') {
      router.push('First');
    }
    // Ici, vous pouvez ajouter la logique pour les autres options
  };

  return (
    <>
      <Plane args={[planeSize[0], planeSize[1]]} position={[0, 0, -1]}>
        <meshStandardMaterial map={texture} />
      </Plane>
      
      <Box ref={boxRef} position={[0, 2, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial map={new THREE.TextureLoader().load('/textures/question_block.png')} />
      </Box>
      
      <group position={[0, 0.9, 0]}>
        <Html>
       
            <button onClick={() => handleOptionClick('Nouvelle Partie')} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', padding: '5px 10px', backgroundColor: '#FF0000', color: 'white' }}>
              Nouvelle Partie
            </button>
        </Html>
      </group>
      
      <group position={[0, -0.1, 0]}>
        <Text fontSize={0.5} color="#0000FF">
          Continuer
        </Text>
        <Html>
          <button onClick={() => handleOptionClick('Continuer')} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', padding: '5px 10px', backgroundColor: '#0000FF', color: 'white' }}>
            Continuer
          </button>
        </Html>
      </group>
      
      <group position={[0, -0.8, 0]}>
        <Text fontSize={0.5} color="#00FF00">
          Options
        </Text>
        <Html>
          <button onClick={() => handleOptionClick('Options')} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', padding: '5px 10px', backgroundColor: '#00FF00', color: 'black' }}>
            Options
          </button>
        </Html>
      </group>
      
      <group position={[0, -1.5, 0]}>
        <Text fontSize={0.5} color="#FFA500">
          Quitter
        </Text>
        <Html>
          <button onClick={() => handleOptionClick('Quitter')} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', padding: '5px 10px', backgroundColor: '#FFA500', color: 'black' }}>
            Quitter
          </button>
        </Html>
      </group>
    </>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} style={{ background: 'transparent', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <MenuMario />
    </Canvas>
  );
};

export default Scene;
