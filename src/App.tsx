import { useEffect, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { DRACOLoader, OrbitControls } from "three-stdlib";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import "./App.css";

const CanvasScene = () => {
  const { set, camera, gl, scene } = useThree();
  useEffect(() => {
    set({
      size: {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
    window.addEventListener("resize", () => {
      set({
        size: {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    });

    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 4;
    controls.maxDistance = 45;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = Math.PI / 2;

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
      window.removeEventListener("resize", () => {});
      controls.dispose();
    };
  }, []);

  return null;
};

function App() {
  const texturesMap:
    | {
        [key: string]: { day: string };
      }
    | Record<string, Record<string, string>> = {
    one: {
      day: "/textures/TextureOne.webp",
    },
    two: {
      day: "/textures/TextureTwo.webp",
    },
    three: {
      day: "/textures/TextureThree.webp",
    },
    four: {
      day: "/textures/TextureFour.webp",
    },
  };
  const [loadedTexture, setLoadedTexture] = useState<
    | {
        day: Record<string, THREE.Texture>;
      }
    | Record<string, Record<string, THREE.Texture>>
  >({ day: {} });

  const textureLoader = new THREE.TextureLoader();

  const portfolioGltf = useLoader(
    GLTFLoader,
    "/glb/my_portfolio.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  useEffect(() => {
    const _texture = {};
    Object.keys(texturesMap).forEach((key) => {
      const texture = textureLoader.load(texturesMap[key].day);
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      _texture[key] = texture;
    });
    setLoadedTexture({ day: _texture });
  }, []);

  useEffect(() => {
    if (
      portfolioGltf &&
      portfolioGltf.scene &&
      loadedTexture.day &&
      Object.keys(loadedTexture.day).length > 0
    ) {
      portfolioGltf.scene.traverse((child) => {
        if (child.isMesh) {
          Object.keys(loadedTexture.day).forEach((key) => {
            if (child.name.includes(key)) {
              const material = new THREE.MeshBasicMaterial({
                map: loadedTexture.day[key],
              });
              child.material = material;
              child.material.needsUpdate = true;
            }
          });
        }
      });
    }
  }, [portfolioGltf, loadedTexture]);

  return (
    <div id="canvas-container">
      <Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
        <CanvasScene />
        {portfolioGltf && <primitive object={portfolioGltf.scene} />}
      </Canvas>
    </div>
  );
}

export default App;
