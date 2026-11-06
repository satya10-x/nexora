import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { StudioEnvironment } from './StudioEnvironment'

function MiniObject() {
  const groupRef = useRef<THREE.Group>(null)
  const { size } = useThree()
  const compact = size.width < 520
  const position: [number, number, number] = compact ? [0.8, -1.15, 0] : [1.35, 0.08, 0]

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.25
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.1
  })

  return (
    <group position={position} scale={compact ? 0.56 : 0.92}>
      <group ref={groupRef}>
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh>
            <icosahedronGeometry args={[1.15, 3]} />
            <MeshDistortMaterial
              color="#07121c"
              emissive="#00f0ff"
              emissiveIntensity={0.14}
              metalness={0.72}
              roughness={0.24}
              clearcoat={1}
              clearcoatRoughness={0.16}
              envMapIntensity={1.3}
              distort={0.28}
              speed={2}
            />
          </mesh>
          <mesh scale={1.16}>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshBasicMaterial
              color="#00f0ff"
              wireframe
              transparent
              opacity={0.18}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </Float>

        <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
          <torusGeometry args={[1.7, 0.005, 6, 180]} />
          <meshBasicMaterial
            color="#ff2bd6"
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

export function MiniOrbCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      camera={{ position: [0, 0, 4.2], fov: 40 }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <Suspense fallback={null}>
        <StudioEnvironment intensity={0.9} />
        <ambientLight intensity={0.28} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#dffcff" />
        <directionalLight position={[-4, -2, 3]} intensity={1} color="#00f0ff" />
        <pointLight position={[3, 2, 3]} intensity={8} color="#00f0ff" distance={14} decay={2} />
        <pointLight position={[-3, -1, 2]} intensity={6} color="#ff2bd6" distance={14} decay={2} />
        <MiniObject />
      </Suspense>
    </Canvas>
  )
}
