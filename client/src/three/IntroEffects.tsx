import { useMemo, useRef, type ReactElement } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Glitch,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { introState } from '@/intro/introState'

type IntroEffectsProps = {
  mobile: boolean
  glitching: boolean
}

export function IntroEffects({ mobile, glitching }: IntroEffectsProps) {
  // The postprocessing wrappers expose class constructors in their ref types,
  // while the runtime value is the effect instance.
  const bloomRef = useRef<any>(null)
  const caRef = useRef<any>(null)
  const offset = useMemo(() => new THREE.Vector2(0.0012, 0.0012), [])
  const glitchDelay = useMemo(() => new THREE.Vector2(0.6, 1.6), [])
  const glitchDuration = useMemo(() => new THREE.Vector2(0.12, 0.4), [])
  const glitchStrength = useMemo(() => new THREE.Vector2(0.18, 0.65), [])

  useFrame(() => {
    if (bloomRef.current) {
      bloomRef.current.intensity =
        0.4 +
        introState.warp * 0.65 +
        introState.energy * 0.9 +
        introState.flash * 2.2 +
        introState.shock * 0.45
    }

    if (caRef.current) {
      const amount =
        0.0006 + introState.warp * 0.0038 + introState.shake * 0.0022 + introState.flash * 0.004
      caRef.current.offset.set(amount, amount * 0.55)
    }
  })

  const effects: ReactElement[] = [
    <Bloom
      key="bloom"
      ref={bloomRef}
      mipmapBlur
      intensity={0.55}
      luminanceThreshold={0.42}
      luminanceSmoothing={0.35}
    />,
  ]

  if (!mobile) {
    effects.push(
      <ChromaticAberration
        key="chromatic"
        ref={caRef}
        offset={offset}
        radialModulation
        modulationOffset={0.12}
        blendFunction={BlendFunction.NORMAL}
      />,
      <Glitch
        key="glitch"
        active={glitching}
        delay={glitchDelay}
        duration={glitchDuration}
        strength={glitchStrength}
        mode={GlitchMode.CONSTANT_MILD}
        ratio={0.7}
      />,
    )
  }

  effects.push(
    <Noise key="noise" premultiply blendFunction={BlendFunction.OVERLAY} />,
    <Vignette key="vignette" eskil={false} offset={0.18} darkness={0.92} />,
  )

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {effects}
    </EffectComposer>
  )
}
