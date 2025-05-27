import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function AnimatedShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sidebarWidth = 250; // Ajusta este valor si tu sidebar es más ancho
    const clock = new THREE.Clock();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() },
      u_progress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_number: { value: 0 },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        gl_Position = vec4(position, 1.0);
        vUv = uv;
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_number;
      varying vec2 vUv;
      uniform vec2 uMouse;
      uniform float u_progress;

      const float PI = 3.1415926535897932384626433832795;
      const float TAU = PI * 2.;

      void main() {
        vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.yy + 0.5;
        float t2 = (u_time * 0.4) + length(uv - 0.5);

        vec3 color = vec3(uv.y, 1., 0.5);
        vec3 color2 = vec3(uv.x, 1., 0.5);
        vec3 color3 = vec3(1., uv.x, 0.5);
        vec3 color4 = vec3(1., 0.5, uv.y);

        color = mix(color, color2, step(length(uv - 0.5), 0.5));
        color = mix(color, color3, step(length(uv - 0.5), 0.4));
        color = mix(color, color4, step(length(uv - 0.5), 0.3));

        color.r += sin(t2);
        color.g += cos(t2);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const resize = () => {
      const width = window.innerWidth - sidebarWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);

      Object.assign(renderer.domElement.style, {
        position: 'absolute',
        top: '0px',
        left: `${sidebarWidth}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: '-1',
        pointerEvents: 'none',
      });
    };

    resize();
    window.addEventListener('resize', resize);

    let running = false;
    window.addEventListener('click', (event) => {
      if (!running) {
        uniforms.uMouse.value.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );

        running = true;
        gsap.to(uniforms.u_progress, {
          duration: 6.5,
          value: uniforms.u_progress.value + 10,
          onComplete: () => {
            running = false;
          },
        });
      }
    });

    const render = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    const animate = () => {
      render();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
        ref={containerRef}
        style={{
            position: 'absolute',
            bottom: '50px',
            right: '190px', // <- ajustado
            height: '100vh',
            width: 'calc(100vw - 220px)',
            zIndex: 0,
            pointerEvents: 'none',
        }}
    />
  );
}