import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { damp3 } from 'maath/easing'
import { CoreOrb } from './CoreOrb'
import { Starfield } from './Starfield'

function HeroObject() {
  const groupRef = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)
  const { size } = useThree()
  const isMobile = size.width < 768

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
    }

    onScroll()
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const basePosition: [number, number, number] = isMobile ? [1.35, 2.6, -4] : [3.05, 0.05, -0.7]
  const baseScale = isMobile ? 0.48 : 0.9

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    const { x, y } = pointer.current
    const scrollOffset = scroll.current

    damp3(
      group.position,
      [
        basePosition[0] + x * 0.38,
        basePosition[1] - y * 0.22 - scrollOffset * 0.8,
        basePosition[2],
      ],
      0.45,
      delta,
    )

    const smoothing = 1 - Math.exp(-6 * delta)
    const targetRotX = y * 0.22
    const targetRotY = x * 0.45 + state.clock.elapsedTime * 0.08
    const targetRotZ = x * 0.05

    group.rotation.x += (targetRotX - group.rotation.x) * smoothing
    group.rotation.y += (targetRotY - group.rotation.y) * smoothing * 0.35
    group.rotation.z += (targetRotZ - group.rotation.z) * smoothing

    group.scale.setScalar(baseScale * (1 - scrollOffset * 0.14))
  })

  return (
    <group ref={groupRef} position={basePosition}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
        <CoreOrb
          interactive
          radius={1.55}
          distortion={1.05}
          colorA="#00f0ff"
          colorB="#8b5cf6"
          colorC="#ff2bd6"
        />
      </Float>

      <mesh rotation={[Math.PI / 2.15, 0.2, 0]}>
        <torusGeometry args={[2.15, 0.004, 6, 220]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 1.75, -0.55, 0.4]}>
        <torusGeometry args={[2.55, 0.003, 6, 220]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {[
        [2.3, 0.9, 0.2],
        [-2.1, -1.2, 0.4],
        [1.7, -1.6, -0.4],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} scale={0.045}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            color={index === 1 ? '#ff2bd6' : '#7df9ff'}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

export function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <Starfield count={1800} opacity={0.34} speed={0.05} warp={0.06} size={1.7} />
      <HeroObject />
    </>
  )
}
