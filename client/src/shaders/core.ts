export const coreVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBuild;
  uniform float uDistortion;

  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  varying float vNoise;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  void main() {
    float n = noise(normal * 2.4 + vec3(0.0, uTime * 0.35, uTime * 0.2));
    float n2 = noise(normal * 6.0 - vec3(uTime * 0.22));
    float displacement = ((n - 0.5) * 0.42 + (n2 - 0.5) * 0.09) * uDistortion * uBuild;

    vec3 pos = position + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mvPosition.xyz);
    vPos = pos;
    vNoise = n;

    gl_Position = projectionMatrix * mvPosition;
  }
`

export const coreFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uBuild;
  uniform float uOpacity;
  uniform float uFresnel;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  varying float vNoise;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vView);
    float facing = clamp(dot(normal, viewDir), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, uFresnel);

    vec3 keyDir = normalize(vec3(0.45, 0.8, 0.7));
    vec3 fillDir = normalize(vec3(-0.7, -0.15, 0.55));
    vec3 rimDir = normalize(vec3(-0.2, 0.4, -0.9));

    float key = max(dot(normal, keyDir), 0.0);
    float fill = max(dot(normal, fillDir), 0.0);
    float rim = max(dot(normal, rimDir), 0.0);
    vec3 halfDir = normalize(keyDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 64.0);

    float noiseMix = smoothstep(0.15, 0.85, vNoise);
    vec3 deep = uColorB * 0.08 + vec3(0.003, 0.006, 0.012);
    vec3 mid = mix(uColorA * 0.42, uColorB * 0.5, noiseMix);
    vec3 color = mix(deep, mid, 0.35 + key * 0.55);

    color += uColorA * key * 0.18;
    color += uColorC * rim * 0.10;
    color += uColorC * fresnel * 0.38;
    color += uColorA * specular * 0.55;
    color *= 0.9 + fill * 0.1;

    float bands = smoothstep(0.86, 0.98, fract(vPos.y * 4.4 - uTime * 0.45));
    color += uColorA * bands * 0.08;

    float alpha = clamp((0.82 + fresnel * 0.18) * uOpacity, 0.0, 1.0);
    if (alpha < 0.002) discard;

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
