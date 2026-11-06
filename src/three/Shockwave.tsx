import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { introState } from '@/intro/introState'

export function Shockwave() {
  const cyanRef = useRef<THREE.Mesh>(null)
  const magentaRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const shock = introState.shock
    const time = state.clock.elapsedTime

    if (cyanRef.current) {
      const material = cyanRef.current.material as THREE.MeshBasicMaterial
      const scale = 0.05 + shock * 26
      cyanRef.current.scale.setScalar(scale)
      cyanRef.current.rotation.z = time * 0.35
      material.opacity = Math.pow(1 - Math.min(1, shock), 2) * 0.9
    }

    if (magentaRef.current) {
      const material = magentaRef.current.material as THREE.MeshBasicMaterial
      const scale = 0.05 + Math.max(0, shock - 0.08) * 20
      magentaRef.current.scale.setScalar(scale)
      magentaRef.current.rotation.z = -time * 0.5
      material.opacity = Math.pow(1 - Math.min(1, shock), 2) * 0.55
    }

    if (cyanRef.current) cyanRef.current.position.z = 1.4 + shock * 1.5
  })

  return (
    <group>
      <mesh ref={cyanRef} position={[0, 0, 1.4]} frustumCulled={false}>
        <ringGeometry args={[0.96, 1, 160]} />
        <meshBasicMaterial
          color="#bdfcff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={magentaRef} position={[0, 0, 1.1]} frustumCulled={false}>
        <ringGeometry args={[0.94, 1, 160]} />
        <meshBasicMaterial
          color="#ff2bd6"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
