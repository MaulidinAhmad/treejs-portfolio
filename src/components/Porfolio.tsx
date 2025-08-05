import MyWorksModal from "./MyWorksModal";
import AboutMeModal from "./AboutMeModal";
import CanvasHandler from "./CanvasHandler";
import { Canvas } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import textureLoader from "./TextureLoader";

function Portfolio() {
  const [showWorksModal, setShowWorksModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const { portfolioGltf: portfolioGltfFunction } = textureLoader();

  const portfolioGltf = useMemo(() => portfolioGltfFunction, []);

  const handleToggleModal = useCallback(
    (type: "works" | "about", val: boolean) => {
      if (type === "works") {
        setShowWorksModal(val);
      } else {
        setShowAboutModal(val);
      }
    },
    []
  );

  return (
    <>
      <div className="canvas-container">
        <Canvas dpr={Math.min(window.devicePixelRatio, 1.5)}>
          {portfolioGltf && (
            <>
              <primitive object={portfolioGltf.scene}></primitive>
              <CanvasHandler
                setShowWorksModal={(val: boolean) =>
                  handleToggleModal("works", val)
                }
                setShowAboutModal={(val: boolean) =>
                  handleToggleModal("about", val)
                }
                gltf={portfolioGltf}
              />
            </>
          )}
        </Canvas>
      </div>
      <MyWorksModal
        show={showWorksModal}
        onClose={() => setShowWorksModal(false)}
      />
      <AboutMeModal
        show={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
      <button id="theme-toggle" className="toggle-theme">
        Toggle Theme
      </button>
    </>
  );
}

export default Portfolio;
