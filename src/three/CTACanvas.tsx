import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { CoreOrb } from './CoreOrb'
import { Starfield } from './Starfield'

function CTAObject() {
  const { size } = useThree()
  const compact = size.width < 768
  const position: [number, number, number] = compact ? [0.55, -1.3, -1.7] : [0, -1.15, -1.7]

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position} scale={compact ? 0.58 : 0.74}>
        <CoreOrb
          interactive
          radius={1.35}
          distortion={0.95}
          colorA="#00f0ff"
          colorB="#8b5cf6"
          colorC="#ff2bd6"
        />
      </group>
    </Float>
  )
}

export function CTACanvas() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      camera={{ position: [0, 0, 6.4], fov: 46, near: 0.1, far: 160 }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <Suspense fallback={null}>
        <Starfield count={2200} opacity={0.42} speed={0.1} warp={0.1} size={1.8} />
        <CTAObject />
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={2.7} position={[0, -0.35, -0.8]}>
          <torusGeometry args={[1, 0.003, 6, 220]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Suspense>
    </Canvas>
  )
}
