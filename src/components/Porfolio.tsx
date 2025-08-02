import MyWorksModal from "./MyWorksModal";
import AboutMeModal from "./AboutMeModal";
import CanvasHandler from "./CanvasHandler";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import textureLoader from "./TextureLoader";

function Portfolio() {
  const [showWorksModal, setShowWorksModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const { portfolioGltf } = textureLoader();

  return (
    <div className="canvas-container">
      <Canvas dpr={Math.min(window.devicePixelRatio, 1.5)}>
        <CanvasHandler
          setShowWorksModal={(val: boolean) => setShowWorksModal(val)}
          setShowAboutModal={(val: boolean) => setShowAboutModal(val)}
          gltf={portfolioGltf}
        />
        {portfolioGltf && <primitive object={portfolioGltf.scene}></primitive>}
      </Canvas>
      <MyWorksModal
        show={showWorksModal}
        onClose={() => setShowWorksModal(false)}
      />
      <AboutMeModal
        show={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </div>
  );
}

export default Portfolio;
