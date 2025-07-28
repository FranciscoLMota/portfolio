import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";

interface BoxesProps {
  darkMode: boolean;
}

export function Boxes({ darkMode }: BoxesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let cleanupRequested = false;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const aspect = width / height;
    const frustumSize = 35;
    const viewHeight = frustumSize;
    const viewWidth = frustumSize * aspect;

    const camera = new THREE.OrthographicCamera(
      -viewWidth / 2,
      viewWidth / 2,
      viewHeight / 2,
      -viewHeight / 2,
      1,
      1000
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // Physics world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.set(0, -15, 0);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Material
    const material = new THREE.MeshBasicMaterial({
      color: darkMode ? 0xffffff : 0x111111,
      wireframe: true,
    });
    materialRef.current = material;

    // Boxes
    const meshes: THREE.Mesh[] = [];
    const bodies: CANNON.Body[] = [];

    const boxSize = 10;
    const spacing = 4;
    const boxGeo = new THREE.BoxGeometry(boxSize * 2, boxSize, boxSize);

    
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // scroll up = negative delta → pull boxes up
      // scroll down = positive delta → pull boxes down
      const direction = delta > 0 ? 1 : -1;

      for (const body of bodies) {
        body.velocity.y = 8 * direction; // adjust "pull" strength
      }

      lastScrollY = currentScrollY;
    };



    window.addEventListener("scroll", handleScroll);


    for (let i = 0; i < 3; i++) {
      // Three.js mesh
      const mesh = new THREE.Mesh(boxGeo, material);
      const posi = [0, -2, 2]
      scene.add(mesh);
      meshes.push(mesh);

      // Cannon.js body
      const halfSize = boxSize / 2;
      const shape = new CANNON.Box(new CANNON.Vec3(halfSize * 2, halfSize, halfSize));
      const body = new CANNON.Body({
        mass: 1,
        shape,
        position: new CANNON.Vec3(posi[i], i * (spacing + boxSize), 0),
      });
      body.angularDamping = 0.9;
      world.addBody(body);
      bodies.push(body);
    }

    // Animation loop
    const animate = () => {
      if (cleanupRequested) return;
      animationId = requestAnimationFrame(animate);

      world.step(1 / 60);

      // Sync Three.js mesh positions with Cannon bodies
      for (let i = 0; i < meshes.length; i++) {
        meshes[i].position.copy(bodies[i].position as unknown as THREE.Vector3);
        meshes[i].quaternion.copy(bodies[i].quaternion as unknown as THREE.Quaternion);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      const newAspect = newWidth / newHeight;
      camera.left = (-frustumSize * newAspect) / 2;
      camera.right = (frustumSize * newAspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cleanupRequested = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update material color on darkMode change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(darkMode ? 0xffffff : 0x111111);
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
