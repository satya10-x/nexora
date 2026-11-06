import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { IntroScene } from './IntroScene'

type IntroCanvasProps = {
  mobile: boolean
  glitching: boolean
}

export function IntroCanvas({ mobile, glitching }: IntroCanvasProps) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.4 : 1.9]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      camera={{ position: [0, 0, 9.2], fov: 46, near: 0.1, far: 260 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#030409', 1)
      }}
    >
      <Suspense fallback={null}>
        <IntroScene mobile={mobile} glitching={glitching} />
      </Suspense>
    </Canvas>
  )
}
