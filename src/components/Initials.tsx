import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { FontLoader } from './lib/three/loaders/FontLoader';
import { TextGeometry } from './lib/three/geometries/TextGeometry';
import { Font } from "three/examples/jsm/Addons.js";

interface initialsProps {
  darkMode: boolean;
}


export function Initials({ darkMode }: initialsProps) {
  const containerRef = useRef(null);
  const initialsMaterialRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const fShapeRef = useRef<THREE.LineSegments>(null);
  const mShapeRef = useRef<THREE.LineSegments>(null);

  // useEffect(() => {
  //   if (fShape) {
  //     console.log(fShape)
  //   }
  // }, [darkMode]);



  useEffect(() => {
    const initialsMaterial = new THREE.LineBasicMaterial({
      color: darkMode ? 0xf6f3f0 : 0x0f0f0f,
    });

    const loader = new FontLoader();
    loader.load('/src/fonts/NippoVariable_Bold.json', (font: Font) => {
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

      const fShape = new THREE.LineSegments(
        new THREE.EdgesGeometry(new TextGeometry("F", {
          font,
          size: 3,
          depth: 1,
          height: 0.2,
        })),
        initialsMaterial
      );


      const mShape = new THREE.LineSegments(
        new THREE.EdgesGeometry(new TextGeometry("M", {
          font,
          size: 3,
          depth: 1,
          height: 0.2,
        })),
        initialsMaterial
      );

      scene.add(fShape);
      scene.add(mShape);
      fShapeRef.current = fShape;
      mShapeRef.current = mShape;


      // Center geometry itself, so pivot is in the middle
      fShape.geometry.computeBoundingBox();
      mShape.geometry.computeBoundingBox();

      const fCenter = new THREE.Vector3();
      const mCenter = new THREE.Vector3();
      fShape.geometry.boundingBox!.getCenter(fCenter);
      mShape.geometry.boundingBox!.getCenter(mCenter);

      // Shift geometry so that pivot is at its center
      fShape.geometry.translate(-fCenter.x, -fCenter.y, -fCenter.z);
      mShape.geometry.translate(-mCenter.x, -mCenter.y, -mCenter.z);

      // Now position the meshes wherever you want in the scene
      fShape.position.set(-1.25, 0.5, 0); // no need to compensate for bounding box
      mShape.position.set(1.25, -0.5, 0);

      const animate = () => {
        // Update y positions for animation, keeping x centered
        fShape.position.y = 0.7 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
        mShape.position.y = -0.7 + (Math.sin(clock.getElapsedTime() * 2) * 0.2) * -1;
        fShape.rotation.y = -(Math.sin(clock.getElapsedTime() * 2) * 0.2);
        mShape.rotation.y = -(Math.sin(clock.getElapsedTime() * 2) * 0.2) * -1;

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

    });


  }, [darkMode]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative", // optional, useful for absolute children
        overflow: "hidden",
      }}
    />
  );
}
