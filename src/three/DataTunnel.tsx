import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { introState } from '@/intro/introState'
import { tunnelFragmentShader, tunnelVertexShader } from '@/shaders/tunnel'

export function DataTunnel() {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const geometry = useMemo(() => new THREE.CylinderGeometry(15, 15, 140, 72, 1, true), [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uColorA: { value: new THREE.Color('#00f0ff') },
          uColorB: { value: new THREE.Color('#8b5cf6') },
        },
        vertexShader: tunnelVertexShader,
        fragmentShader: tunnelFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((_, delta) => {
    timeRef.current += delta
    material.uniforms.uTime.value = timeRef.current
    const current = material.uniforms.uOpacity.value as number
    material.uniforms.uOpacity.value =
      current + (introState.tunnelOpacity - current) * Math.min(1, delta * 2.2)

    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.018
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -52]}
      frustumCulled={false}
    />
  )
}
