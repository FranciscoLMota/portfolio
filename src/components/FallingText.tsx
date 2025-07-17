import { useEffect, useRef, useState } from "react";
import { FontLoader } from './lib/three/loaders/FontLoader'
import { TextGeometry } from './lib/three/geometries/TextGeometry'
import { Scene, OrthographicCamera, WebGLRenderer, LineBasicMaterial, LineSegments, EdgesGeometry, BoxGeometry, Mesh, MeshPhongMaterial } from "three";
import { Font } from "three/examples/jsm/Addons.js";
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

interface cubeProps {
  darkMode: boolean;
}


export function FallingText({ darkMode }: cubeProps) {
  const containerRef = useRef(null);
  const regMaterialRef = useRef(null);


  useEffect(() => {
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);


    const loader = new FontLoader();

    loader.load('/src/fonts/NippoVariable_Bold.json', function (font: Font) {


      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new Scene();
      const aspect = width / height;
      const frustumSize = 15; // You can adjust this to zoom in/out

      const camera = new OrthographicCamera(
        (-frustumSize * aspect) / 2,  // left
        (frustumSize * aspect) / 2,   // right
        frustumSize / 2,              // top
        -frustumSize / 2,             // bottom
        1,                            // near
        1000                          // far
      );


      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);

      const renderer = new WebGLRenderer({ antialias: false, alpha: true });
      renderer.setClearColor(0x000000, 0); // 0 alpha = fully transparent
      renderer.setSize(width, height);

      container.appendChild(renderer.domElement);
      const regMaterial = new LineBasicMaterial({
        color: darkMode ? 0xffffff : 0x0f0f0f,
      });
      regMaterialRef.current = regMaterial;

      // Physics world setup
      const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0),
      });

      // Invisible ground plane
      const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });

      world.addBody(groundBody);

      // Align ground to be horizontal at y = -5
      groundBody.position.set(0, -9, 0);
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

      const mouseRadius = 1.5;
      const mouseBody = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.KINEMATIC, // moves, but isn't affected by forces
        shape: new CANNON.Sphere(mouseRadius),
      });
      world.addBody(mouseBody);

      const viewWidth = frustumSize * aspect;
      const viewHeight = frustumSize * 1.5;

      const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
      const meshes: LineSegments[] = [];
      const bodies: CANNON.Body[] = [];

      const maxLetters = Math.floor(Math.random() * (90 - 50 + 1)) + 50;
      let letterIndex = 0;

      // Precompute bounding box for layout (using a single character)
      const tempGeo = new TextGeometry("H", {
        font,
        size: 3,
        height: 0.2,
      });
      tempGeo.computeBoundingBox();
      const tempSize = tempGeo.boundingBox!.getSize(new THREE.Vector3());
      const letterWidth = tempSize.x;
      const letterHeight = tempSize.y;

      // Determine how many columns fit in the view
      const cols = Math.floor(viewWidth / letterWidth);

      // Create left and right wall shapes
      const wallThickness = 1;
      const wallHeight = viewHeight;
      const wallDepth = 1;

      // LEFT WALL
      const leftWall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)),
      });

      leftWall.position.set(-viewWidth / 2 - 2 - wallThickness / 2, 0, 0);

      world.addBody(leftWall);

      // RIGHT WALL
      const rightWall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)),
      });

      rightWall.position.set(viewWidth / 2 + wallThickness / 2, 0, 0);

      world.addBody(rightWall);

      for (let i = 0; i < maxLetters; i++) {
        const char = text[letterIndex % text.length];
        letterIndex++;

        // Reuse geometry creation but skip computing bounding box every time
        const textGeo = new TextGeometry(char, {
          font,
          size: 3,
          height: 0.2,
        });
        const edges = new EdgesGeometry(textGeo);
        const mesh = new LineSegments(edges, regMaterial);

        // Spread letters in a grid pattern
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = -viewWidth / 2 + col * letterWidth + letterWidth / 2;
        const y = viewHeight / 2 - row * letterHeight - letterHeight / 2 + Math.random() * 2;

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

      const animate = () => {
        requestAnimationFrame(animate);

        world.step(1 / 60);

        // Sync mesh positions with physics bodies
        for (let i = 0; i < meshes.length; i++) {
          meshes[i].position.copy(bodies[i].position as unknown as Vector3);
          meshes[i].quaternion.copy(bodies[i].quaternion as unknown as THREE.Quaternion);
        }

        // Convert NDC mouse.x/y to world coords
        const xWorld = (mouse.x * viewWidth) / 2;
        const yWorld = (mouse.y * viewHeight) / 2;

        // Move the mouseBody to that world position
        mouseBody.position.set(xWorld, yWorld, 0);
        renderer.render(scene, camera);
      };

      animate();

      // Optional: handle window resize
      // Handle resize
      const handleResize = () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.left = (-frustumSize * (newWidth / newHeight)) / 2;
        camera.right = (frustumSize * (newWidth / newHeight)) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    })

  }, [darkMode]);


  return (
    <>
      <section id="hero">
        <div className="text-midnight dark:text-eggshell">
          <div className="h-screen m-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
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
                <span className="inline-block transition-colors duration-500 bg-midnight dark:bg-eggshell dark:text-midnight text-eggshell px-3">
                  <span className="relative">Lorem Ipsum</span>
                </span>
              </h1>
            </div>
          </div>
        </div>
      </section>
    </>
  );

}
