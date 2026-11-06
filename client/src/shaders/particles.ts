export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWarp;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute float aSeed;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec3 p = position;

    float travel = uTime;
    p.z = mod(p.z + travel + 100.0, 100.0) - 100.0;

    float depthNorm = (p.z + 100.0) / 100.0;
    p.xy *= 1.0 + uWarp * (0.35 + depthNorm * 1.35);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mvPosition.z;
    vSeed = aSeed;

    gl_PointSize = min(
      14.0,
      uSize * uPixelRatio * (150.0 / max(1.0, vDepth))
    );
    gl_PointSize = max(gl_PointSize, 1.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`

export const particleFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.18, d);
    float flare = max(0.0, 1.0 - abs(uv.x) * 7.0) * max(0.0, 1.0 - abs(uv.y) * 2.2);

    vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.55, vSeed));
    color = mix(color, uColorC, smoothstep(0.62, 1.0, vSeed));

    float nearFade = smoothstep(0.6, 3.0, vDepth);
    float farFade = 1.0 - smoothstep(38.0, 100.0, vDepth);
    float alpha = (core * 0.7 + glow * 0.5 + flare * 0.18) * uOpacity * nearFade * farFade;

    if (alpha < 0.004) discard;

    gl_FragColor = vec4(color * (1.15 + core * 1.35), alpha);
  }
`
