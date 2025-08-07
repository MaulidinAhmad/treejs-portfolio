import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";
import textureLoader from "./TextureLoader";
// import textureLoader from "./TextureLoader";

const CanvasHandler = ({
  setShowWorksModal,
  setShowAboutModal,
}: {
  setShowWorksModal: (val: boolean) => void;
  setShowAboutModal: (val: boolean) => void;
}) => {
  const { portfolioGltf } = textureLoader();

  const { camera, gl, set } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const intersectedObjects = useRef<any>(null);
  const currentHoveredObject = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    set({
      size: {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    const controls = new OrbitControls(camera, gl.domElement);

    controls.minPolarAngle = 1.09; // radians
    controls.maxPolarAngle = 1.5;
    controls.minAzimuthAngle = -Math.PI / 20;
    controls.maxAzimuthAngle = Math.PI / 10;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.update();

    if (window.innerWidth <= 768) {
      controls.minDistance = Math.PI;
      controls.maxDistance = Math.PI + 5;
      camera.position.set(
        2.0784610415185423,
        2.0584996296959606,
        1.0273284073572544
      );
      camera.rotation.set(
        -0.07136751588242878,
        0.12649680859447793,
        0.009018778980842197,
        "XYZ"
      );
      controls.target.set(
        1.154636907421292,
        1.5405155025874016,
        -6.218326733070704
      );
    } else {
      controls.minDistance = Math.PI;
      controls.maxDistance = Math.PI + 3;
      camera.position.set(
        2.6893834211607963,
        2.0999519861217597,
        -0.08042393160201122
      );
      camera.rotation.set(
        -0.14331725209764046,
        0.08472296386709241,
        0.012210856348915571,
        "XYZ"
      );
      controls.target.set(
        2.163027482569661,
        1.214738025686542,
        -6.214681434248178
      );
    }

    window.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length > 1) {
          event.preventDefault(); // Disable controls on touch
        }
      },
      { passive: false }
    );

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

    return () => {
      window.removeEventListener("resize", handleResize);

      controls.dispose();
    };
  }, []);

  const handleHoverObject = (
    object: THREE.Object3D,
    type: "hover" | "unhover",
    hoverSize: number = 1.4,
    duration: number = 0.5
  ) => {
    const _material = object; // Change color to red on hover
    if (type === "hover") {
      if (_material !== currentHoveredObject.current) {
        currentHoveredObject.current = _material;
        if (currentHoveredObject.current) {
          gsap.killTweensOf(_material.position);
          gsap.to(_material.position, {
            x: _material.userData.initialPosition.x,
            y: _material.userData.initialPosition.y + 0.02,
            z: _material.userData.initialPosition.z,
            duration: duration,
            ease: "back.out(2)",
          });
          gsap.killTweensOf(_material.scale);
          gsap.to(_material.scale, {
            x: _material.userData.initialScale.x * hoverSize,
            y: _material.userData.initialScale.y * hoverSize,
            z: _material.userData.initialScale.z * hoverSize,
            duration: duration,
            ease: "back.out(2)",
          });
          window.document.body.style.cursor = "pointer";
        }
      }
    } else {
      if (_material) {
        gsap.killTweensOf(_material.position);
        gsap.killTweensOf(_material.scale);
        Promise.all([
          gsap.to(_material.position, {
            x: _material.userData.initialPosition.x,
            y: _material.userData.initialPosition.y,
            z: _material.userData.initialPosition.z,
            duration: duration,
            ease: "back.out(2)",
          }),
          gsap.to(_material.scale, {
            x: _material.userData.initialScale.x,
            y: _material.userData.initialScale.y,
            z: _material.userData.initialScale.z,
            duration: duration,
            delay: 0,
            ease: "back.out(2)",
          }),
        ]).then(() => {
          currentHoveredObject.current = null;
        });

        window.document.body.style.cursor = "default";
      }
    }
  };

  // event listeners for mouse over and click
  useEffect(() => {
    // Find the mesh named "my_works"
    const canvas = gl.domElement;

    function onMouseOver(event: MouseEvent) {
      if (!canvas) return;
      // console.log(mouse, "mouse");
      // Convert mouse position to normalized device coordinates
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (!camera) return;
      if (!portfolioGltf || !portfolioGltf.scene) return;
      raycaster.current.setFromCamera(mouse.current, camera);
      const targetMesh = portfolioGltf.scene.children.filter((child) => {
        if (child.name.includes("hover")) {
          return true;
        } else {
          return false;
        }
      });

      const intersects = raycaster.current.intersectObjects(targetMesh, true);
      intersectedObjects.current = intersects;
      if (intersects.length > 0) {
        const _object = intersects[0].object; // Change color to red on hover
        if (_object.name.includes("wine")) {
          handleHoverObject(_object, "hover", 1.1);
        } else {
          handleHoverObject(_object, "hover");
        }
      } else {
        handleHoverObject(currentHoveredObject.current, "unhover");
      }
    }

    function onClick() {
      if (intersectedObjects.current.length > 0) {
        const hitbox = intersectedObjects.current[0].object;

        handleHoverObject(hitbox, "unhover");

        if (hitbox.name.includes("myworks")) {
          setShowWorksModal(true);
        }
        if (hitbox.name.includes("aboutme")) {
          setShowAboutModal(true);
        }
      }
    }
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMouseOver);
    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", onMouseOver);
        canvas.removeEventListener("mousemove", onClick);
      }
    };
  }, [gl.domElement, portfolioGltf]);

  useEffect(() => {
    raycaster.current.setFromCamera(mouse.current, camera);
    const targetMesh = portfolioGltf.scene.children.filter((child) => {
      if (child.name.includes("pointer") || child.name.includes("hover")) {
        return true;
      } else {
        return false;
      }
    });

    const intersects = raycaster.current.intersectObjects(targetMesh, false);
    intersectedObjects.current = intersects;
    if (intersects.length > 0) {
      const _material = intersects[0].object; // Change color to red on hover
      if (_material.name.includes("myworks")) {
        setShowWorksModal(true);
      }
      if (_material.name.includes("aboutme")) {
        setShowAboutModal(true);
      }
    }
  }, []);

  return <primitive object={portfolioGltf.scene}></primitive>;
};

export default CanvasHandler;
