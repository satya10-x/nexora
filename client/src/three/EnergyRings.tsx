import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { introState } from '@/intro/introState'

const RING_COLORS = ['#00f0ff', '#8b5cf6', '#ff2bd6', '#7df9ff']

export function EnergyRings() {
  const groupRef = useRef<THREE.Group>(null)
  const ringRefs = useRef<Array<THREE.Mesh | null>>([])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const energy = introState.energy

    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.14
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.24
    }

    ringRefs.current.forEach((mesh, index) => {
      if (!mesh) return
      const wobble = 0.95 + Math.sin(time * 1.5 + index * 1.2) * 0.06
      const scale = 0.01 + energy * (1.85 + index * 0.52) * wobble
      mesh.scale.setScalar(scale)
      mesh.rotation.x = Math.PI / 2 + index * 0.48 + Math.sin(time * 0.4 + index) * 0.16
      mesh.rotation.y = index * 0.7 + time * 0.1

      const material = mesh.material as THREE.MeshBasicMaterial
      material.opacity = energy * (0.55 - index * 0.1)
    })
  })

  return (
    <group ref={groupRef}>
      {RING_COLORS.map((color, index) => (
        <mesh
          key={color}
          ref={(el) => {
            ringRefs.current[index] = el
          }}
          frustumCulled={false}
        >
          <torusGeometry args={[1, 0.0045, 8, 180]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
