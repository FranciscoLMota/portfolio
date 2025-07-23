import { useEffect, useRef } from "react";
import { TextGeometry } from "./lib/three/geometries/TextGeometry";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  LineBasicMaterial,
  LineSegments,
  EdgesGeometry,
} from "three";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import { Font } from "three/examples/jsm/Addons.js";

interface cubeProps {
  darkMode: boolean;
  font: Font;
}

export function FallingText({ darkMode, font }: cubeProps) {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const regMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const meshesRef = useRef<THREE.LineSegments[]>([]);

  useEffect(() => {
    if (!font) return;
    const container = containerRef.current;
    if (!container) return;

    const mouse = { x: 0, y: 0 };
    let animationId: number;
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.OrthographicCamera;
    let scene: THREE.Scene;
    let world: CANNON.World;
    const bodies: CANNON.Body[] = [];
    const meshes: LineSegments[] = [];

    let cleanupRequested = false;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const regMaterial = new LineBasicMaterial({
      color: darkMode ? 0xffffff : 0x0f0f0f,
    });
    regMaterialRef.current = regMaterial;
    if (cleanupRequested) return;

    // Set up scene and camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;
    const frustumSize = 15;
    const viewWidth = frustumSize * aspect;
    const viewHeight = frustumSize * 1.5;

    scene = new Scene();

    camera = new OrthographicCamera(
      -viewWidth / 2,
      viewWidth / 2,
      frustumSize / 2,
      -frustumSize / 2,
      1,
      1000
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    renderer = new WebGLRenderer({ antialias: false, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Physics world
    world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // Ground
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.position.set(0, -9, 0);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Walls
    const wallThickness = 1;
    const wallHeight = viewHeight;
    const wallDepth = 1;

    const leftWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(
        new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)
      ),
    });
    leftWall.position.set(-viewWidth / 2 - 2 - wallThickness / 2, 0, 0);
    world.addBody(leftWall);

    const rightWall = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(
        new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)
      ),
    });
    rightWall.position.set(viewWidth / 2 + wallThickness / 2, 0, 0);
    world.addBody(rightWall);

    // Mouse body
    const mouseRadius = 0.5;
    const mouseBody = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.KINEMATIC,
      shape: new CANNON.Sphere(mouseRadius),
    });
    world.addBody(mouseBody);

    // Generate letters
    const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .sort(() => 0.5 - Math.random());
    const maxLetters = 30;
    let letterIndex = 0;

    const tempGeo = new TextGeometry("O", {
      font,
      size: 3,
      height: 0.2,
    });
    tempGeo.computeBoundingBox();
    const tempSize = tempGeo.boundingBox!.getSize(new THREE.Vector3());
    const letterWidth = tempSize.x;
    const letterHeight = tempSize.y;
    const cols = Math.floor(viewWidth / letterWidth);

    for (let i = 0; i < maxLetters; i++) {
      const char = text[letterIndex++ % text.length];
      const textGeo = new TextGeometry(char, {
        font,
        size: 3,
        height: 0.2,
      });
      const edges = new EdgesGeometry(textGeo);
      const mesh = new LineSegments(edges, regMaterial);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = -viewWidth / 2 + col * letterWidth + letterWidth / 2;
      const y =
        viewHeight / 2 - row * letterHeight - letterHeight / 2 + Math.random() * 2;

      mesh.position.set(x, y, 0);
      scene.add(mesh);
      meshes.push(mesh);

      const shape = new CANNON.Box(
        new CANNON.Vec3(letterWidth / 2, letterHeight / 2, 0.1)
      );
      const body = new CANNON.Body({
        mass: 1,
        shape,
        position: new CANNON.Vec3(x, y, 0),
      });
      body.angularFactor.set(0, 0, 0);
      body.linearFactor.set(1, 1, 0);
      body.angularDamping = 1;

      world.addBody(body);
      bodies.push(body);
    }

    meshesRef.current = meshes;

    const animate = () => {
      if (cleanupRequested) return;

      animationId = requestAnimationFrame(animate);
      world.step(1 / 60);

      for (let i = 0; i < meshes.length; i++) {
        meshes[i].position.copy(
          bodies[i].position as unknown as THREE.Vector3
        );
        meshes[i].quaternion.copy(
          bodies[i].quaternion as unknown as THREE.Quaternion
        );
      }

      const xWorld = (mouse.x * viewWidth) / 2;
      const yWorld = (mouse.y * viewHeight) / 2;
      mouseBody.position.set(xWorld, yWorld, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.left = (-frustumSize * (newWidth / newHeight)) / 2;
      camera.right = (frustumSize * (newWidth / newHeight)) / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    const cleanup = () => {
      cleanupRequested = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);

      if (renderer && container.contains(renderer.domElement)) {
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      regMaterial.dispose();
    };

    // Return cleanup
    if (!cleanupRequested) {
      return cleanup;
    }


    // Cleanup fallback if font load is canceled
    return () => {
      cleanupRequested = true;
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [font]);

  useEffect(() => {
    if (regMaterialRef.current) {
      regMaterialRef.current.color.set(darkMode ? 0xffffff : 0x0f0f0f);
      regMaterialRef.current.needsUpdate = true;
    }
  }, [darkMode]);

  return (
    <section id="hero">
      <div className="text-midnight dark:text-eggshell">
        <div className="h-screen m-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center pt-0">
          <div
            ref={containerRef}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-display text-5xl font-medium tracking-tight text-midnight dark:text-eggshell sm:text-7xl">
              <span className="inline-block transition-colors duration-500 bg-midnight dark:bg-eggshell dark:text-midnight text-eggshell px-3 hover:bg-bee hover:text-midnight">
                <span className="relative">Francisco Mota</span>
              </span>
            </h1>
            <h3 className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-display text-5xl font-medium tracking-tight text-midnight dark:text-eggshell sm:text-5xl">
              <span className="inline-block transition-colors duration-500 bg-midnight dark:bg-eggshell dark:text-midnight text-eggshell px-3 hover:bg-bee hover:text-midnight">
                <span className="relative">Developer</span>
              </span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
