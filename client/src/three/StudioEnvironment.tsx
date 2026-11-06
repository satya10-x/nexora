import { Environment, Lightformer } from '@react-three/drei'

type StudioEnvironmentProps = {
  intensity?: number
}

export function StudioEnvironment({ intensity = 1 }: StudioEnvironmentProps) {
  return (
    <Environment resolution={128} frames={1} environmentIntensity={0.9 * intensity}>
      <Lightformer
        form="rect"
        intensity={2.2 * intensity}
        color="#dffcff"
        scale={[12, 8, 1]}
        position={[0, 6, -8]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={1.4 * intensity}
        color="#00f0ff"
        scale={[8, 10, 1]}
        position={[-6, 1, 4]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={1.2 * intensity}
        color="#ff2bd6"
        scale={[8, 10, 1]}
        position={[6, -1, 3]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="ring"
        intensity={0.8 * intensity}
        color="#8b5cf6"
        scale={4}
        position={[0, -5, 2]}
        target={[0, 0, 0]}
      />
    </Environment>
  )
}
