export type IntroState = {
  act: number
  speed: number
  warp: number
  core: number
  energy: number
  flash: number
  shock: number
  shake: number
  pull: number
  starOpacity: number
  tunnelOpacity: number
  logo: number
}

const initial: IntroState = {
  act: 1,
  speed: 0.15,
  warp: 0,
  core: 0.02,
  energy: 0,
  flash: 0,
  shock: 0,
  shake: 0,
  pull: 0,
  starOpacity: 0,
  tunnelOpacity: 0,
  logo: 0,
}

/**
 * Mutable bridge between the master GSAP timeline (DOM) and the R3F render loop.
 * Mutating a plain object avoids React re-renders at 60fps.
 */
export const introState: IntroState = { ...initial }

export function resetIntroState(): void {
  Object.assign(introState, initial)
}
