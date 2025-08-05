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
  const { camera, gl, set } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const sizes = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let currentHoveredObject = useRef<THREE.Object3D | null>(null);

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

    // After loading your GLB and adding it to the scene:
    // const box = new THREE.Box3().setFromObject(gltf.scene);
    // const center = box.getCenter(new THREE.Vector3());
    // controls.target.copy({
    //   x: center.x,
    //   y: center.y - 4,
    //   z: center.z,
    // });

    // camera.updateProjectionMatrix();
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
    // {
    //     "x": 2.163027482569661,
    //     "y": 1.214738025686542,
    //     "z": -6.214681434248178
    // }

    // // pos
    // {
    //     "x": 2.6893834211607963,
    //     "y": 2.0999519861217597,
    //     "z": -0.08042393160201122
    // }

    // // rot{
    //     "isEuler": true,
    //     "_x": -0.14331725209764046,
    //     "_y": 0.08472296386709241,
    //     "_z": 0.012210856348915571,
    //     "_order": "XYZ"
    // }
    // controls.target.set(
    //   1.9538965372872157,
    //   -3.5364320692559827,
    //   -27.972568199944234
    // );
    // }

    window.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length > 1) {
          event.preventDefault(); // Disable controls on touch
        }
      },
      { passive: true }
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
    hoverSize: number = 1.4
  ) => {
    if (type === "hover") {
      const _material = object; // Change color to red on hover
      if (_material !== currentHoveredObject.current) {
        currentHoveredObject.current = _material;
        if (currentHoveredObject.current) {
          console.log("Hovered object:", _material.name);
          gsap.killTweensOf(_material.position);
          gsap.to(_material.position, {
            x: _material.userData.initialPosition.x,
            y: _material.userData.initialPosition.y + 0.02,
            z: _material.userData.initialPosition.z,
            duration: 0.5,
            ease: "back.out(2)",
          });
          gsap.killTweensOf(_material.scale);
          gsap.to(_material.scale, {
            x: _material.userData.initialScale.x * hoverSize,
            y: _material.userData.initialScale.y * hoverSize,
            z: _material.userData.initialScale.z * hoverSize,
            duration: 0.5,
            ease: "back.out(2)",
          });
          window.document.body.style.cursor = "pointer";
        }
      }
    } else {
      if (currentHoveredObject.current) {
        gsap.killTweensOf(currentHoveredObject.current.position);
        gsap.to(currentHoveredObject.current.position, {
          x: currentHoveredObject.current.userData.initialPosition.x,
          y: currentHoveredObject.current.userData.initialPosition.y,
          z: currentHoveredObject.current.userData.initialPosition.z,
          duration: 0.5,
          ease: "back.out(2)",
        });

        gsap.killTweensOf(currentHoveredObject.current.scale);
        gsap.to(currentHoveredObject.current.scale, {
          x: currentHoveredObject.current.userData.initialScale.x,
          y: currentHoveredObject.current.userData.initialScale.y,
          z: currentHoveredObject.current.userData.initialScale.z,
          duration: 0.5,
          ease: "back.out(2)",
        });
        currentHoveredObject.current = null;
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
        if (_material.name.includes("myworks")) {
          setShowWorksModal(true);
        }
        if (_material.name.includes("aboutme")) {
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
