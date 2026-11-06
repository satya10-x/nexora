import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { introState } from '@/intro/introState'
import { particleFragmentShader, particleVertexShader } from '@/shaders/particles'

type StarfieldProps = {
  count?: number
  opacity?: number
  warp?: number
  speed?: number
  intro?: boolean
  size?: number
}

export function Starfield({
  count = 7000,
  opacity = 1,
  warp = 0,
  speed = 0,
  intro = false,
  size = 2.2,
}: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { size: viewportSize } = useThree()
  const travelRef = useRef(0)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      const radius = 3.5 + Math.random() * 24
      const angle = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(angle) * radius * (0.5 + Math.random())
      positions[i * 3 + 1] = Math.sin(angle) * radius * (0.4 + Math.random() * 0.8)
      positions[i * 3 + 2] = -Math.random() * 100
      seeds[i] = Math.random()
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -50), 160)
    return geo
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uWarp: { value: warp },
          uSize: { value: size },
          uPixelRatio: { value: Math.min(2, window.devicePixelRatio || 1) },
          uOpacity: { value: opacity },
          uColorA: { value: new THREE.Color('#00f0ff') },
          uColorB: { value: new THREE.Color('#8b5cf6') },
          uColorC: { value: new THREE.Color('#ff2bd6') },
        },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((state, delta) => {
    const uniforms = material.uniforms
    const isIntro = intro

    travelRef.current += delta * (2.0 + (isIntro ? introState.speed : speed) * 20.0)
    uniforms.uTime.value = travelRef.current

    const targetWarp = isIntro ? introState.warp : warp
    const currentWarp = uniforms.uWarp.value as number
    uniforms.uWarp.value = currentWarp + (targetWarp - currentWarp) * Math.min(1, delta * 2.4)

    const targetOpacity = isIntro ? introState.starOpacity : opacity
    const currentOpacity = uniforms.uOpacity.value as number
    uniforms.uOpacity.value =
      currentOpacity + (targetOpacity - currentOpacity) * Math.min(1, delta * 3)

    uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), viewportSize.width > 768 ? 2 : 1.5)

    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.006
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
