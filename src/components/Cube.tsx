import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

interface cubeProps {
  darkMode: boolean;
}


export function Cube({ darkMode }: cubeProps) {
  const containerRef = useRef(null);
  const cubeMaterialRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const clock = new THREE.Clock();
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setClearColor(0x000000, 0); // 0 alpha = fully transparent
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    const diamondShape = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.25, 0)),
      new THREE.LineBasicMaterial({ color: darkMode ? 0xfec800 : 0x0f0f0f, })
    );

    const cubeMaterial = new THREE.LineBasicMaterial({
      color: darkMode ? 0xf6f3f0 : 0x0f0f0f,
    });
    cubeMaterialRef.current = cubeMaterial;

    const cubeShape = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3, 3)),
      cubeMaterial
    );

    scene.add(diamondShape);
    scene.add(cubeShape);

    const animate = () => {
      const speedMultiplier = hovered ? 3 : 1; // ← change this multiplier to control spin speed
      diamondShape.rotation.y += 0.03 * speedMultiplier;
      cubeShape.rotation.y -= 0.01 * speedMultiplier;

      diamondShape.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.2;

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [darkMode, hovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: "100%",
        position: "relative", // optional, useful for absolute children
        overflow: "hidden",
      }}
    />
  );
}
