import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import gsap from 'gsap'
import { StudioEnvironment } from './StudioEnvironment'

type ProcessObjectProps = {
  step: number
}

const STEP_COLORS = ['#00f0ff', '#8b5cf6', '#ff2bd6']

function ProcessObject({ step }: ProcessObjectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { size } = useThree()
  const compact = size.width < 520
  const color = STEP_COLORS[Math.min(step, STEP_COLORS.length - 1)]

  useEffect(() => {
    if (!groupRef.current) return
    const tween = gsap.fromTo(
      groupRef.current.scale,
      { x: 0.86, y: 0.86, z: 0.86 },
      { x: 1, y: 1, z: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)' },
    )
    return () => {
      tween.kill()
    }
  }, [step])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * (0.22 + step * 0.12)
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.14
  })

  return (
    <group scale={compact ? 0.76 : 1}>
      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.6}>
          <mesh>
            <icosahedronGeometry args={[1.32, 3]} />
            <MeshDistortMaterial
              color="#08161f"
              emissive={color}
              emissiveIntensity={0.16 + step * 0.04}
              metalness={0.7}
              roughness={0.24}
              clearcoat={0.9}
              clearcoatRoughness={0.2}
              envMapIntensity={1.3}
              distort={0.18 + step * 0.12}
              speed={1.8 + step * 0.5}
            />
          </mesh>
          <mesh scale={1.14}>
            <icosahedronGeometry args={[1.32, 1]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={0.22}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </Float>

        {[0, 1, 2].map((ring) => (
          <mesh
            key={ring}
            rotation={[Math.PI / 2 + ring * 0.6, ring * 0.4, 0]}
            scale={1.55 + ring * 0.22 + step * 0.08}
          >
            <torusGeometry args={[1, 0.0035, 6, 180]} />
            <meshBasicMaterial
              color={STEP_COLORS[ring]}
              transparent
              opacity={0.5 - ring * 0.1}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

type ProcessCanvasProps = {
  step: number
}

export function ProcessCanvas({ step }: ProcessCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <Suspense fallback={null}>
        <StudioEnvironment intensity={0.9} />
        <ambientLight intensity={0.28} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#dffcff" />
        <directionalLight position={[-4, -2, 3]} intensity={1} color="#00f0ff" />
        <pointLight position={[3, 2, 3]} intensity={8} color="#00f0ff" distance={14} decay={2} />
        <pointLight position={[-3, -2, 2]} intensity={6} color="#ff2bd6" distance={14} decay={2} />
        <ProcessObject step={step} />
      </Suspense>
    </Canvas>
  )
}
