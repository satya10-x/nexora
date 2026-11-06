import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { introState } from '@/intro/introState'
import { coreFragmentShader, coreVertexShader } from '@/shaders/core'

type CoreOrbProps = {
  radius?: number
  build?: number
  opacity?: number
  distortion?: number
  colorA?: string
  colorB?: string
  colorC?: string
  wireframe?: boolean
  interactive?: boolean
}

export function CoreOrb({
  radius = 1.55,
  build = 1,
  opacity = 1,
  distortion = 1.1,
  colorA = '#00f0ff',
  colorB = '#8b5cf6',
  colorC = '#ff2bd6',
  wireframe = true,
  interactive = false,
}: CoreOrbProps) {
  const groupRef = useRef<THREE.Group>(null)
  const buildRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBuild: { value: build },
      uDistortion: { value: distortion },
      uOpacity: { value: opacity },
      uFresnel: { value: 2.2 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uColorC: { value: new THREE.Color(colorC) },
    }),
    [build, distortion, opacity, colorA, colorB, colorC],
  )

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    uniforms.uTime.value = time
    uniforms.uOpacity.value = opacity

    const targetBuild = interactive ? build : Math.max(0.015, introState.core)
    buildRef.current += (targetBuild - buildRef.current) * Math.min(1, delta * 4.2)

    uniforms.uBuild.value = buildRef.current
    uniforms.uDistortion.value = distortion + (interactive ? 0 : introState.energy * 1.4)

    if (groupRef.current) {
      const scale = interactive ? 1 : 1.9 * (0.05 + buildRef.current * 0.95)
      groupRef.current.scale.setScalar(scale)
      groupRef.current.rotation.y += delta * (interactive ? 0.18 : 0.28)
      groupRef.current.rotation.x = Math.sin(time * 0.22) * 0.16
      groupRef.current.rotation.z = Math.cos(time * 0.17) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[radius, 5]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          transparent
          depthWrite
          side={THREE.FrontSide}
          blending={THREE.NormalBlending}
          toneMapped
        />
      </mesh>

      {wireframe && (
        <mesh scale={1.015}>
          <icosahedronGeometry args={[radius, 2]} />
          <meshBasicMaterial
            color={colorA}
            wireframe
            transparent
            opacity={0.14}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  )
}
