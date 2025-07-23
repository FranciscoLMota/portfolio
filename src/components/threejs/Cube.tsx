import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

interface CubeProps {
  darkMode: boolean;
}

export function Cube({ darkMode }: CubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cubeMaterialRef = useRef<THREE.LineBasicMaterial>();
  const diamondMaterialRef = useRef<THREE.LineBasicMaterial>();
  const cubeRef = useRef<THREE.LineSegments>();
  const diamondRef = useRef<THREE.LineSegments>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
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
    const cubeMaterial = new THREE.LineBasicMaterial({ color: darkMode ? 0xf6f3f0 : 0x0f0f0f });
    const diamondMaterial = new THREE.LineBasicMaterial({ color: darkMode ? 0xfec800 : 0x0f0f0f });
    cubeMaterialRef.current = cubeMaterial;
    diamondMaterialRef.current = diamondMaterial;

    // Geometry
    const cube = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3, 3)),
      cubeMaterial
    );
    const diamond = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.25, 0)),
      diamondMaterial
    );
    cubeRef.current = cube;
    diamondRef.current = diamond;

    scene.add(cube);
    scene.add(diamond);

    const animate = () => {
      const speedMultiplier = hovered ? 3 : 1;

      if (diamondRef.current) {
        diamondRef.current.rotation.y += 0.03 * speedMultiplier;
        diamondRef.current.position.y = Math.sin(clockRef.current.getElapsedTime() * 2) * 0.2;
      }

      if (cubeRef.current) {
        cubeRef.current.rotation.y -= 0.01 * speedMultiplier;
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
    if (cubeMaterialRef.current) {
      cubeMaterialRef.current.color.set(darkMode ? 0xf6f3f0 : 0x0f0f0f);
      cubeMaterialRef.current.needsUpdate = true;
    }

    if (diamondMaterialRef.current) {
      diamondMaterialRef.current.color.set(darkMode ? 0xfec800 : 0x0f0f0f);
      diamondMaterialRef.current.needsUpdate = true;
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
