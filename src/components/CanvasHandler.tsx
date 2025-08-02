import { useThree, type ObjectMap } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls, type GLTF } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";

const CanvasHandler = ({
  gltf,
  setShowWorksModal,
  setShowAboutModal,
}: {
  gltf?: GLTF & ObjectMap;
  setShowWorksModal: (val: boolean) => void;
  setShowAboutModal: (val: boolean) => void;
}) => {
  const { camera, gl, scene, set } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const sizes = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let currentHoveredObject = null;

  useEffect(() => {
    set({
      size: {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    const handleResize = () => {
      set({
        size: {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });

      // camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener("resize", handleResize);

    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = Math.PI + 19;
    controls.maxDistance = Math.PI + 20;
    controls.minPolarAngle = Math.PI / 3 + 0.2;
    controls.maxPolarAngle = Math.PI / 2 - 0.15;
    controls.minAzimuthAngle = Math.PI / 7;
    controls.maxAzimuthAngle = Math.PI / 5;

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.update();

    camera.position.set(
      25.587597974495075,
      1.6644862949830812,
      -6.410675709302318
    );

    camera.rotation.set(
      -0.19159648511184946,
      0.5323918433727937,
      0.0981449587342626,
      "XYZ"
    );

    controls.target.set(
      14.341353646759412,
      -1.970646197214585,
      -25.150801863656138
    );

    scene.background = new THREE.Color("#D9CAD1");

    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
    };
  }, []);

  useEffect(() => {
    // Find the mesh named "my_works"
    const canvas = gl.domElement;

    function onMouseOver(event: MouseEvent) {
      if (!canvas) return;
      // console.log(mouse, "mouse");
      // Convert mouse position to normalized device coordinates
      mouse.current.x = (event.clientX / sizes.current.width) * 2 - 1;
      mouse.current.y = -(event.clientY / sizes.current.height) * 2 + 1;

      if (!camera) return;
      if (!gltf || !gltf.scene) return;
      raycaster.current.setFromCamera(mouse.current, camera);
      const targetMesh = gltf.scene.children.filter((child) => {
        if (child.name.includes("hover")) {
          return true;
        } else {
          return false;
        }
      });

      const intersects = raycaster.current.intersectObjects(targetMesh, true);

      if (intersects.length > 0) {
        const _material = intersects[0].object; // Change color to red on hover
        if (_material !== currentHoveredObject) {
          currentHoveredObject = _material;
          if (currentHoveredObject) {
            console.log("Hovered object:", _material.name);
            gsap.killTweensOf(_material.position);
            gsap.to(_material.position, {
              x: _material.userData.initialPosition.x,
              y: _material.userData.initialPosition.y + 0.02,
              z: _material.userData.initialPosition.z,
              duration: 0.5,
              ease: "back.out(2)",
            });
            window.document.body.style.cursor = "pointer";
          }
        }
      } else {
        if (currentHoveredObject) {
          gsap.killTweensOf(currentHoveredObject.position);

          gsap.to(currentHoveredObject.position, {
            x: currentHoveredObject.userData.initialPosition.x,
            y: currentHoveredObject.userData.initialPosition.y,
            z: currentHoveredObject.userData.initialPosition.z,
            duration: 0.5,
            ease: "back.out(2)",
          });
          currentHoveredObject = null;
          window.document.body.style.cursor = "default";
        }
      }
    }

    function onClick(event: MouseEvent) {
      if (!canvas) return;
      mouse.current.x = (event.clientX / sizes.current.width) * 2 - 1;
      mouse.current.y = -(event.clientY / sizes.current.height) * 2 + 1;
      if (!camera) return;
      if (!gltf || !gltf.scene) return;
      raycaster.current.setFromCamera(mouse.current, camera);
      const targetMesh = gltf.scene.children.filter((child) => {
        if (child.name.includes("pointer")) {
          return true;
        } else {
          return false;
        }
      });

      const intersects = raycaster.current.intersectObjects(targetMesh, true);
      if (intersects.length > 0) {
        const _material = intersects[0].object; // Change color to red on hover
        if (_material.name.includes("my_works")) {
          setShowWorksModal(true);
        }
        if (_material.name.includes("about_me")) {
          setShowAboutModal(true);
        }
      }
    }

    if (canvas) {
      canvas.addEventListener("mousemove", onMouseOver);
      canvas.addEventListener("click", onClick);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", onMouseOver);
        canvas.removeEventListener("mousemove", onClick);
      }
    };
  }, [gl.domElement]);

  return null;
};

export default CanvasHandler;
