export const tunnelVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const tunnelFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec2 cell = vec2(vUv.x * 72.0, vUv.y * 48.0 - uTime * 2.4);
    vec2 grid = abs(fract(cell) - 0.5);

    float lineX = 1.0 - smoothstep(0.0, 0.028, grid.x);
    float lineY = 1.0 - smoothstep(0.0, 0.028, grid.y);
    float line = max(lineX, lineY);

    float pulse = 0.5 + 0.5 * sin(uTime * 1.4 + vUv.x * 18.0 - vUv.y * 8.0);

    vec3 color = mix(uColorA, uColorB, vUv.x);
    color += uColorB * pulse * 0.35;

    float endFade = smoothstep(0.0, 0.10, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
    float depthFade = 1.0 - smoothstep(60.0, 130.0, vDepth);
    float alpha = line * endFade * depthFade * uOpacity * (0.45 + pulse * 0.55);

    if (alpha < 0.002) discard;

    gl_FragColor = vec4(color * 1.5, alpha);
  }
`
