import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef } from "react";

export function Pomo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<THREE.Group | null>(null);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load("/portfolio/models/pomo2.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.set(2.5, 2.5, 2.5);


      const pivot = new THREE.Group();


      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      pivot.add(model);
      scene.add(pivot);

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);
      const directional = new THREE.DirectionalLight(0xffffff, 1);
      directional.position.set(5, 10, 7);
      scene.add(directional);

      pivotRef.current = pivot;

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          let color = 0xffffff;
          if (child.name === "greenPart") color = 0x00AE82;
          if (child.name === "redPart") color = 0xEE4848;

          // Create flat material mesh instead of wireframe
          const flatMesh = new THREE.Mesh(
            child.geometry,
            new THREE.MeshStandardMaterial({ color, flatShading: true })
          );

          flatMesh.position.copy(child.position);
          flatMesh.rotation.copy(child.rotation);
          flatMesh.scale.copy(child.scale);

          child.parent!.add(flatMesh);
          child.visible = false; // hide original mesh
        }
      });

    });

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (pivotRef.current) {
        pivotRef.current.rotation.y += 0.01;
        pivotRef.current.position.y = Math.sin(clockRef.current.getElapsedTime() * 2) * 0.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
    };


  }, []);

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
