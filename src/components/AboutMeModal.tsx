const AboutMeModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  return (
    <div className={"modal-container " + (show ? "modal-container--show" : "")}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <p>About Me Modal</p>
      </div>
    </div>
  );
};

export default AboutMeModal;
