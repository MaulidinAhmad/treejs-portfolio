import { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { DRACOLoader } from "three-stdlib";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";

const textureLoader = () => {
  const environmentMap = new THREE.CubeTextureLoader()
    .setPath("textures/skybox/")
    .load(["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"]);

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    opacity: 1,
    color: 0xfbfbfb,
    metalness: 0,
    roughness: 0,
    ior: 3,
    thickness: 0.01,
    specularIntensity: 1,
    envMap: environmentMap,
    envMapIntensity: 1,
    depthWrite: false,
    specularColor: 0xfbfbfb,
  });

  const texturesMap:
    | {
        [key: string]: { day: string };
      }
    | Record<string, Record<string, string>> = {
    one: {
      day: "/textures/TextureOne.webp",
      night: "/textures/TextureOne_Night.webp",
    },
    two: {
      day: "/textures/TextureTwo.webp",
      night: "/textures/TextureTwo_Night.webp",
    },
    three: {
      day: "/textures/TextureThree.webp",
      night: "/textures/TextureThree_Night.webp",
    },
    four: {
      day: "/textures/TextureFour.webp",
      night: "/textures/TextureFour_Night.webp",
    },
  };
  const [loadedTexture, setLoadedTexture] = useState<
    | {
        day: Record<string, THREE.Texture>;
        night: Record<string, THREE.Texture>;
      }
    | Record<string, Record<string, THREE.Texture>>
  >({ day: {}, night: {} });

  const textureLoader = new THREE.TextureLoader();

  const portfolioGltf = useLoader(
    GLTFLoader,
    "/glb/MyPortfolio.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  useEffect(() => {
    const _texture = {};
    const _nightTexture = {};
    Object.keys(texturesMap).forEach((key) => {
      // Load day texture
      const dayTexture = textureLoader.load(texturesMap[key].day);
      dayTexture.flipY = false;
      dayTexture.colorSpace = THREE.SRGBColorSpace;
      dayTexture.minFilter = THREE.LinearFilter;
      dayTexture.magFilter = THREE.LinearFilter;
      _texture[key] = dayTexture;

      // Load night texture
      const nightTexture = textureLoader.load(texturesMap[key].night);
      nightTexture.flipY = false;
      nightTexture.colorSpace = THREE.SRGBColorSpace;
      nightTexture.minFilter = THREE.LinearFilter;
      nightTexture.magFilter = THREE.LinearFilter;
      _nightTexture[key] = nightTexture;
    });
    setLoadedTexture({ day: _texture, night: _nightTexture });
  }, []);

  useEffect(() => {
    if (
      portfolioGltf &&
      portfolioGltf.scene &&
      loadedTexture.day &&
      Object.keys(loadedTexture.day).length > 0
    ) {
      portfolioGltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          Object.keys(loadedTexture.day).forEach((key) => {
            if (child.name.includes(key)) {
              const material = new THREE.MeshBasicMaterial({
                map: loadedTexture.day[key],
              });
              child.material = material;
              child.material.needsUpdate = true;
            }
            if (
              child.name.includes("glass") ||
              child.name.includes("jar_body")
            ) {
              child.material = glassMaterial;
              child.material.needsUpdate = true;
            }
            if (child.name.includes("hover")) {
              child.userData.initialScale = new THREE.Vector3().copy(
                child.scale
              );
              child.userData.initialPosition = new THREE.Vector3().copy(
                child.position
              );
              child.userData.initialRotation = new THREE.Euler().copy(
                child.rotation
              );
              child.material.needsUpdate = true;
            }
          });
        }
      });
    }
  }, [portfolioGltf, loadedTexture]);

  return {
    portfolioGltf,
  };
};

export default textureLoader;
