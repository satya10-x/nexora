import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { HeroScene } from './HeroScene'

type HeroCanvasProps = {
  active: boolean
  mobile: boolean
}

export function HeroCanvas({ active, mobile }: HeroCanvasProps) {
  if (!active) return null

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, mobile ? 1.4 : 1.75]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 180 }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0)
      }}
    >
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
    </Canvas>
  )
}
