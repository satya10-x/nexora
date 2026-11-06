import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import { introState } from '@/intro/introState'
import { Starfield } from './Starfield'
import { DataTunnel } from './DataTunnel'
import { CoreOrb } from './CoreOrb'
import { EnergyRings } from './EnergyRings'
import { Shockwave } from './Shockwave'
import { IntroEffects } from './IntroEffects'

function CameraRig() {
  const { camera } = useThree()

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera
    const targetFov = 44 + introState.warp * 44 + introState.flash * 10
    cam.fov += (targetFov - cam.fov) * Math.min(1, delta * 4.5)
    cam.updateProjectionMatrix()

    const targetZ = 9.2 + introState.pull * 9
    cam.position.z += (targetZ - cam.position.z) * Math.min(1, delta * 2.6)

    const time = state.clock.elapsedTime
    const shake = introState.shake
    cam.position.x = Math.sin(time * 17.0) * 0.075 * shake + Math.sin(time * 2.3) * 0.02
    cam.position.y = Math.cos(time * 19.5) * 0.06 * shake + Math.sin(time * 3.1) * 0.015

    cam.lookAt(0, 0, 0)
  })

  return null
}

type IntroSceneProps = {
  mobile: boolean
  glitching: boolean
}

export function IntroScene({ mobile, glitching }: IntroSceneProps) {
  return (
    <>
      <CameraRig />

      <Starfield count={mobile ? 3200 : 9000} intro size={mobile ? 1.8 : 2.4} />
      <DataTunnel />

      <CoreOrb radius={1.55} interactive={false} />
      <EnergyRings />
      <Shockwave />

      <IntroEffects mobile={mobile} glitching={glitching} />
      <AdaptiveDpr pixelated={false} />
      <Preload all />
    </>
  )
}
