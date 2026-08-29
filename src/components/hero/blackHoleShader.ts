/**
 * Stylized real-time black hole raymarcher — not a physically exact geodesic
 * solver, but the same shape of trick real ones use: bend the ray direction
 * every step by an acceleration pointing at the singularity that falls off
 * steeply with distance, so light passing close to the horizon visibly curves
 * and a photon ring emerges naturally from disk light bent back into view.
 */

export const BLACK_HOLE_VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

export const BLACK_HOLE_FRAG = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress; // 0..1, drives disk ignition + slow dolly-in
uniform float uIntensity; // overall brightness/animation dial, 0..1

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float starField(vec3 dir) {
  vec2 uv = dir.xy / (abs(dir.z) + 0.15) * 4.0;
  vec2 cell = floor(uv * 60.0);
  float h = hash21(cell);
  float star = smoothstep(0.986, 1.0, h);
  float tw = 0.6 + 0.4 * sin(uTime * 2.0 + h * 62.0);
  return star * tw;
}

vec3 diskColor(float radius, float innerR, float outerR, float ang, float time) {
  float t = clamp((radius - innerR) / (outerR - innerR), 0.0, 1.0);
  vec3 hot = vec3(1.0, 0.98, 0.9);
  vec3 mid = vec3(1.0, 0.55, 0.28);
  vec3 cool = vec3(0.75, 0.16, 0.09);
  vec3 col = mix(hot, mid, smoothstep(0.0, 0.35, t));
  col = mix(col, cool, smoothstep(0.35, 1.0, t));

  float turbulence = 0.75 + 0.25 * sin(ang * 5.0 - time * 1.4 + radius * 6.0);
  turbulence *= 0.85 + 0.15 * sin(ang * 13.0 + time * 0.6 - radius * 9.0);

  // Doppler-style beaming: the side rotating toward the camera reads brighter.
  float approach = 0.55 + 0.45 * sin(ang - time * 0.9);

  float edgeFade = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.82, 1.0, t));
  return col * turbulence * approach * (0.35 + 0.65 * edgeFade);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

  float ignite = smoothstep(0.0, 0.32, uProgress);
  float spin = uTime * mix(0.015, 0.07, ignite) * uIntensity;

  float az = spin + 0.6;
  float el = 0.2;
  float camDist = mix(9.4, 7.6, smoothstep(0.0, 1.0, uProgress));

  vec3 ro = camDist * vec3(cos(az) * cos(el), sin(el), sin(az) * cos(el));
  vec3 forward = normalize(-ro);
  vec3 worldUp = vec3(0.0, 1.0, 0.0);
  vec3 right = normalize(cross(forward, worldUp));
  vec3 up = cross(right, forward);

  float fov = 1.05;
  vec3 dir = normalize(forward + uv.x * fov * right + uv.y * fov * up);
  vec3 pos = ro;

  const float RS = 1.0;
  const float DISK_INNER = 1.9;
  const float DISK_OUTER = 6.2;
  const float ESCAPE = 40.0;
  const float BEND = 2.7;
  const int STEPS = 96;

  vec3 col = vec3(0.0);
  float transmittance = 1.0;
  float minR = camDist;

  for (int i = 0; i < STEPS; i++) {
    float r = length(pos);
    minR = min(minR, r);
    if (r < RS) {
      transmittance = 0.0;
      break;
    }

    float stepLen = clamp(r * 0.05, 0.02, 0.14);
    vec3 accel = -pos * (BEND / (r * r * r));
    vec3 newDir = normalize(dir + accel * stepLen * uIntensity);
    vec3 newPos = pos + newDir * stepLen;

    if (sign(pos.y) != sign(newPos.y) && pos.y != newPos.y) {
      float t = pos.y / (pos.y - newPos.y);
      vec3 hit = mix(pos, newPos, t);
      float rad = length(hit.xz);
      if (rad > DISK_INNER && rad < DISK_OUTER) {
        float ang = atan(hit.z, hit.x);
        vec3 dCol = diskColor(rad, DISK_INNER, DISK_OUTER, ang, uTime) * ignite;
        float density = 0.55;
        col += dCol * density * transmittance;
        transmittance *= (1.0 - density * 0.7);
      }
    }

    dir = newDir;
    pos = newPos;
    if (r > ESCAPE) break;
  }

  if (transmittance > 0.001) {
    col += starField(dir) * vec3(0.85, 0.9, 1.0) * transmittance * 0.7;
    // faint brand-coral nebula tint, kept subtle against the near-black base
    float nebula = smoothstep(0.3, -0.6, dir.y) * 0.05;
    col += vec3(1.0, 0.37, 0.3) * nebula * transmittance;
  }

  // Photon-ring rim: rays that grazed close to the horizon without falling in
  // carry bent light around the silhouette — nudge that edge a touch brighter.
  float rim = smoothstep(RS * 2.1, RS * 1.02, minR) * ignite;
  col += vec3(1.0, 0.82, 0.7) * rim * 0.5;

  col *= uIntensity;
  col = col / (1.0 + col);
  col = pow(max(col, 0.0), vec3(0.4545));

  fragColor = vec4(col, 1.0);
}`
