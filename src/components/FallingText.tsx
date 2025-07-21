import { useEffect, useRef } from "react";
import { FontLoader } from './lib/three/loaders/FontLoader';
import { TextGeometry } from './lib/three/geometries/TextGeometry';
import {
  Scene, OrthographicCamera, WebGLRenderer,
  LineBasicMaterial, LineSegments, EdgesGeometry
} from "three";
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { Font } from "three/examples/jsm/Addons.js";

interface cubeProps {
  darkMode: boolean;
}

export function FallingText({ darkMode }: cubeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const regMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const meshesRef = useRef<THREE.LineSegments[]>([]);

  useEffect(() => {
    if (regMaterialRef.current) {
      regMaterialRef.current.color.set(darkMode ? 0xffffff : 0x0f0f0f);
      regMaterialRef.current.needsUpdate = true;
    }
  }, [darkMode]);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const regMaterial = new LineBasicMaterial({
      color: darkMode ? 0xffffff : 0x0f0f0f,
    });
    regMaterialRef.current = regMaterial;

    const loader = new FontLoader();
    loader.load('/src/fonts/NippoVariable_Bold.json', (font: Font) => {

      //Setting the scene and container
      const container = containerRef.current!;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const scene = new Scene();
      const aspect = width / height;
      const frustumSize = 15;
      const viewWidth = frustumSize * aspect;
      const viewHeight = frustumSize * 1.5;
      const renderer = new WebGLRenderer({ antialias: false, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);


      //Setting up the "2D" camera
      const camera = new OrthographicCamera(
        (-viewWidth) / 2,
        (viewWidth) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        1,
        1000
      );
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);


      //Setting up the world to add Gravity
      const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0),
      });

      //Setting up the ground so the letters stop when falling
      const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });

      groundBody.position.set(0, -9, 0);
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

      world.addBody(groundBody);


      // Setting up the walls so the letters don't slide away from view
      const wallThickness = 1;
      const wallHeight = viewHeight;
      const wallDepth = 1;

      const leftWall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)),
      });
      leftWall.position.set(-viewWidth / 2 - 2 - wallThickness / 2, 0, 0);
      world.addBody(leftWall);

      const rightWall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)),
      });
      rightWall.position.set(viewWidth / 2 + wallThickness / 2, 0, 0);
      world.addBody(rightWall);


      //Mouse interaction to push the letters around
      const mouseRadius = .5;
      const mouseBody = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.KINEMATIC,
        shape: new CANNON.Sphere(mouseRadius),
      });
      world.addBody(mouseBody);

      //Setting up the letters, gets the whole alphabet and mix them around
      const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').sort(function () { return 0.5 - Math.random() });
      const meshes: LineSegments[] = [];
      const bodies: CANNON.Body[] = [];

      //Setting up the max number of letters
      //TODO: Add a condition for mobile to use less letters and avoid overflow of letters
      const maxLetters = 50;
      let letterIndex = 0;

      //Generating letters and calculating their collision
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
        text.sort(function () { return 0.5 - Math.random() })
        const char = text[letterIndex++ % text.length];
        const textGeo = new TextGeometry(char, {
          font,
          size: 3,
          height: 0.2,
        });
        const edges = new EdgesGeometry(textGeo);
        const mesh = new LineSegments(edges, regMaterialRef.current!);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = -viewWidth / 2 + col * letterWidth + letterWidth / 2;
        const y = viewHeight / 2 - row * letterHeight - letterHeight / 2 + Math.random() * 2;
        mesh.position.set(x, y, 0);
        scene.add(mesh);
        meshes.push(mesh);

        const shape = new CANNON.Box(new CANNON.Vec3(letterWidth / 2, letterHeight / 2, 0.1));
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
        requestAnimationFrame(animate);
        world.step(1 / 60);

        for (let i = 0; i < meshes.length; i++) {
          meshes[i].position.copy(bodies[i].position as unknown as THREE.Vector3);
          meshes[i].quaternion.copy(bodies[i].quaternion as unknown as THREE.Quaternion);
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

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", onMouseMove);
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    });

  }, []);

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
              <span className="inline-block transition-colors duration-500 bg-midnight dark:bg-eggshell dark:text-midnight text-eggshell px-3">
                <span className="relative">Francisco Mota</span>
              </span>
            </h1>
            <h3 className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-display text-5xl font-medium tracking-tight text-midnight dark:text-eggshell sm:text-5xl">
              <span className="inline-block transition-colors duration-500 bg-midnight dark:bg-eggshell dark:text-midnight text-eggshell px-3">
                <span className="relative">Developer</span>
              </span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
