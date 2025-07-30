import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { TextGeometry } from "../lib/three/geometries/TextGeometry";
import { Font } from "three/examples/jsm/Addons.js";

interface initialsProps {
  darkMode: boolean;
  font: Font;
}

export function Initials({ darkMode, font }: initialsProps) {

  const containerRef = useRef(null);
  const initialsMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const fMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const fShapeRef = useRef<THREE.LineSegments>(null);
  const mShapeRef = useRef<THREE.LineSegments>(null);


  useEffect(() => {
    if (!font) return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const initialsMaterial = new THREE.LineBasicMaterial({
      color: darkMode ? 0xf6f3f0 : 0x0f0f0f,
    });
    const fMaterial = new THREE.LineBasicMaterial({
      color: darkMode ? 0xfdc700 : 0x0036fe,
    });
    initialsMaterialRef.current = initialsMaterial;
    fMaterialRef.current = fMaterial;

    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    let animationId: number;

    let cleanupRequested = false; // ✅ ADDED: Prevent async leakss

    if (cleanupRequested) return;

    const clock = new THREE.Clock();

    const fShape = new THREE.LineSegments(
      new THREE.EdgesGeometry(new TextGeometry("F", {
        font,
        size: 3,
        depth: 1,
        height: 0.2,
      })),
      fMaterial
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

    // Center geometry pivot
    fShape.geometry.computeBoundingBox();
    mShape.geometry.computeBoundingBox();
    const fCenter = new THREE.Vector3();
    const mCenter = new THREE.Vector3();
    fShape.geometry.boundingBox!.getCenter(fCenter);
    mShape.geometry.boundingBox!.getCenter(mCenter);
    fShape.geometry.translate(-fCenter.x, -fCenter.y, -fCenter.z);
    mShape.geometry.translate(-mCenter.x, -mCenter.y, -mCenter.z);

    fShape.position.set(-1.25, 0.5, 0);
    mShape.position.set(1.25, -0.5, 0);
    const width = container.clientWidth;
    
    if (width < 768) {
      fShape.position.set(-1.75, 0.5, 0);
      mShape.position.set(1, -0.5, 0);
    }

    fShapeRef.current = fShape;
    mShapeRef.current = mShape;

    scene.add(fShape);
    scene.add(mShape);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      fShape.position.y = 0.7 + Math.sin(t * 2) * 0.2;
      mShape.position.y = -0.7 - Math.sin(t * 2) * 0.2;
      fShape.rotation.y = -Math.sin(t * 2) * 0.2;
      mShape.rotation.y = Math.sin(t * 2) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    const cleanup = () => {
      cleanupRequested = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      if (fShape) {
        fShape.geometry.dispose();
        fShape.material.dispose();
      }

      if (mShape) {
        mShape.geometry.dispose();
        mShape.material.dispose();
      }

      initialsMaterial.dispose();

      if (renderer && container.contains(renderer.domElement)) {
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }
    };

    return cleanup;
  }, [font]);


  useEffect(() => {
    if (initialsMaterialRef.current) {
      initialsMaterialRef.current.color.set(darkMode ? 0xffffff : 0x0f0f0f);
      initialsMaterialRef.current.needsUpdate = true;
    }
    if (fMaterialRef.current) {
      fMaterialRef.current.color.set(darkMode ? 0xfdc700 : 0x0036fe);
      fMaterialRef.current.needsUpdate = true;
    }
  }, [darkMode]);


  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}
