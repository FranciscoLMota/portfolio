import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

interface SphereProps {
  darkMode: boolean;
}

export function Sphere({ darkMode }: SphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const sphereRef = useRef<THREE.LineSegments | null>(null);
  const d20MaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const d20Ref = useRef<THREE.LineSegments | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const [hovered, setHovered] = useState(false);

  // 🧱 Initial setup: scene, camera, renderer, mesh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Materials
    const sphereMaterial = new THREE.LineBasicMaterial({ color: darkMode ? 0xf6f3f0 : 0x0f0f0f });
    sphereMaterialRef.current = sphereMaterial;
    const d20Material = new THREE.LineBasicMaterial({ color: darkMode ? 0xfec800 : 0x58c4dc });
    d20MaterialRef.current = d20Material;

    // Geometry
    const sphere = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.SphereGeometry(2, 8, 12)),
      sphereMaterial
    );
    sphereRef.current = sphere;
    scene.add(sphere);
    const d20 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3, 0)),
      d20Material
    );
    d20Ref.current = d20;
    scene.add(d20);

    const animate = () => {
      const speedMultiplier = hovered ? 3 : 1;

      if (sphereRef.current) {
        sphereRef.current.rotation.y -= 0.005 * speedMultiplier;
        if (d20Ref.current) {
          d20Ref.current.rotation.x -= 0.01 * speedMultiplier;
          d20Ref.current.rotation.y -= 0.01 * speedMultiplier; 4
        }
        sphereRef.current.scale.y = 0.5 + (3 * (Math.sin(clockRef.current.getElapsedTime()) * 0.1));
        sphereRef.current.scale.z = 0.5 + (3 * (Math.sin(clockRef.current.getElapsedTime()) * 0.1));
        sphereRef.current.scale.x = 0.5 + (3 * (Math.sin(clockRef.current.getElapsedTime()) * 0.1));
      }

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []); // ✅ Run once only

  // 🎨 Update material color on darkMode change
  useEffect(() => {
    if (sphereMaterialRef.current) {
      sphereMaterialRef.current.color.set(darkMode ? 0xf6f3f0 : 0x0f0f0f);
      sphereMaterialRef.current.needsUpdate = true;
    }
    if (d20MaterialRef.current) {
      d20MaterialRef.current.color.set(darkMode ? 0xfec800 : 0x0036fe);
      d20MaterialRef.current.needsUpdate = true;
    }
  }, [darkMode]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}
