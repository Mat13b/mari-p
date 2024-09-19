'use client'

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Plane } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const Personnage = ({ position }: { position: [number, number, number] }) => {
  const texture = useLoader(THREE.TextureLoader, '/w_mm10-megaman.png');
  return (
    <group position={position}>
      <Plane args={[1.5, 1.5 ]} rotation={[0, 0, 0]}>
        <meshBasicMaterial attach="material" map={texture} />
      </Plane>
    </group>
  );
};

const Plateforme = ({ position, size }: { position: [number, number, number]; size: [number, number, number] }) => {
  return (
    <Box args={size} position={position}>
      <meshStandardMaterial color="green" />
    </Box>
  );
};

export default function FistL() {
  const [personnagePosition, setPersonnagePosition] = useState([0, 1, 0]);
  const [estEnSaut, setEstEnSaut] = useState(false);
  const [direction, setDirection] = useState(0);
  const plateformes = [
    { position: [0, -1, 0], size: [10, 0.5, 10] },
    { position: [-3, 1, 0], size: [2, 0.5, 2] },
    { position: [3, 2, 0], size: [2, 0.5, 2] },
    { position: [0, 3, 0], size: [2, 0.5, 2] },
  ];

  const verifierCollision = (nouvellePosition: number[]) => {
    return plateformes.some(plateforme => {
      const [px, py, pz] = plateforme.position;
      const [sx, sy, sz] = plateforme.size;
      return (
        nouvellePosition[0] >= px - sx / 2 &&
        nouvellePosition[0] <= px + sx / 2 &&
        nouvellePosition[1] >= py &&
        nouvellePosition[1] <= py + sy / 2 &&
        nouvellePosition[2] >= pz - sz / 2 &&
        nouvellePosition[2] <= pz + sz / 2
      );
    });
  };

  const sauter = () => {
    if (!estEnSaut) {
      setEstEnSaut(true);
      let hauteurSaut = 0;
      const intervalId = setInterval(() => {
        if (hauteurSaut < 2) {
          setPersonnagePosition(prev => {
            const nouvellePosition = [
              prev[0] + direction * 0.1,
              prev[1] + 0.2,
              prev[2]
            ];
            if (verifierCollision(nouvellePosition as number[])) {
              clearInterval(intervalId);
              setEstEnSaut(false);
              return prev;
            }
            return nouvellePosition;
          });
          hauteurSaut += 0.2;
        } else {
          clearInterval(intervalId);
          retomber();
        }
      }, 30);
    }
  };

  const retomber = () => {
    const intervalId = setInterval(() => {
      setPersonnagePosition(prev => {
        const nouvellePosition = [
          prev[0] + direction * 0.1,
          prev[1] - 0.2,
          prev[2]
        ];
        if (verifierCollision(nouvellePosition as number[])) {
          clearInterval(intervalId);
          setEstEnSaut(false);
          setDirection(0);
          return prev;
        }
        return nouvellePosition;
      });
    }, 30);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setDirection(-1);
          if (!estEnSaut) {
            setPersonnagePosition(prev => {
              const nouvellePosition = [prev[0] - 0.5, prev[1], prev[2]];
              return verifierCollision(nouvellePosition as number[]) ? prev : nouvellePosition;
            });
          }
          break;
        case 'ArrowRight':
          setDirection(1);
          if (!estEnSaut) {
            setPersonnagePosition(prev => {
              const nouvellePosition = [prev[0] + 0.5, prev[1], prev[2]];
              return verifierCollision(nouvellePosition as number[]) ? prev : nouvellePosition;
            });
          }
          break;
        case 'Space':
          sauter();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        setDirection(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [estEnSaut]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={1} />
        <pointLight position={[1, 1, 1]} />
        <Personnage position={personnagePosition as [number, number, number]} />
        {plateformes.map((plateforme, index) => (
          <Plateforme key={index} position={plateforme.position as [number, number, number]} size={plateforme.size as [number, number, number]} />
        ))}
      </Canvas>
    </div>
  );
}