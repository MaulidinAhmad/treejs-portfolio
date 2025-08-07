import { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import themeVertexShader from "../shaders/theme/vertex.glsl";
import themeFragmentShader from "../shaders/theme/fragment.glsl";
import { ThemeContext } from "../context/ThemeContext";
import { useGLTF, useTexture } from "@react-three/drei";

const textureLoader = () => {
  const isNightRef = useRef(false);
  const { dispatch } = useContext(ThemeContext);
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
  const themeToggleButton = document.getElementById("theme-toggle");

  const portfolioGltf = useGLTF("/glb/MyPortfolio.glb", true);

  const dayTextures = useTexture(
    Object.keys(texturesMap).map((key) => texturesMap[key]["day"])
  ).map((item) => {
    item.flipY = false;
    item.colorSpace = THREE.SRGBColorSpace;
    item.minFilter = THREE.LinearFilter;
    item.magFilter = THREE.LinearFilter;
    return item;
  });

  const createMaterialForTextureSet = (textureSet: number) => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uDayTexture1: { value: dayTextures[0] },
        uNightTexture1: { value: nightTextures[0] },
        uDayTexture2: { value: dayTextures[1] },
        uNightTexture2: { value: nightTextures[1] },
        uDayTexture3: { value: dayTextures[2] },
        uNightTexture3: { value: nightTextures[2] },
        uDayTexture4: { value: dayTextures[3] },
        uNightTexture4: { value: nightTextures[3] },
        uMixRatio: { value: 0 },
        uTextureSet: { value: textureSet },
      },
      vertexShader: themeVertexShader,
      fragmentShader: themeFragmentShader,
    });

    Object.values(material.uniforms).forEach((uniform) => {
      if (uniform.value instanceof THREE.Texture) {
        uniform.value.minFilter = THREE.LinearFilter;
        uniform.value.magFilter = THREE.LinearFilter;
      }
    });

    return material;
  };

  const nightTextures = useTexture(
    Object.keys(texturesMap).map((key) => texturesMap[key]["night"])
  ).map((item) => {
    item.flipY = false;
    item.colorSpace = THREE.SRGBColorSpace;
    item.minFilter = THREE.LinearFilter;
    item.magFilter = THREE.LinearFilter;
    return item;
  });

  const roomMaterials = useRef({
    one: createMaterialForTextureSet(1),
    two: createMaterialForTextureSet(2),
    three: createMaterialForTextureSet(3),
    four: createMaterialForTextureSet(4),
  });

  const handleThemeToggle = (e) => {
    e.preventDefault();

    Object.values(roomMaterials.current).forEach((material) => {
      gsap.to(material.uniforms.uMixRatio, {
        value: isNightRef.current ? 0 : 1,
        duration: 1.5,
        ease: "power2.inOut",
      });
    });

    dispatch({
      theme: isNightRef.current ? "light" : "dark",
    });

    isNightRef.current = !isNightRef.current;
  };

  useEffect(() => {
    if (themeToggleButton) {
      themeToggleButton.addEventListener("click", handleThemeToggle);
    }
    () => themeToggleButton.removeEventListener("click", handleThemeToggle);
  }, [themeToggleButton]);

  useEffect(() => {
    if (portfolioGltf && portfolioGltf.scene && dayTextures) {
      const environmentMap = new THREE.CubeTextureLoader()
        .setPath("textures/skybox/")
        .load([
          "px.webp",
          "nx.webp",
          "py.webp",
          "ny.webp",
          "pz.webp",
          "nz.webp",
        ]);

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

      portfolioGltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name.includes("one")) {
            child.material = roomMaterials.current.one;
          }
          if (child.name.includes("two")) {
            child.material = roomMaterials.current.two;
          }
          if (child.name.includes("three")) {
            child.material = roomMaterials.current.three;
          }
          if (child.name.includes("four")) {
            child.material = roomMaterials.current.four;
          }
          if (child.name.includes("glass") || child.name.includes("jar_body")) {
            child.material = glassMaterial;
            child.material.needsUpdate = true;
          }
          if (child.name.includes("hover")) {
            child.userData.initialScale = new THREE.Vector3().copy(child.scale);
            child.userData.initialPosition = new THREE.Vector3().copy(
              child.position
            );
            child.userData.initialRotation = new THREE.Euler().copy(
              child.rotation
            );
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [portfolioGltf, dayTextures]);

  return {
    dayTextures,
    nightTextures,
    portfolioGltf,
  };
};

export default textureLoader;
