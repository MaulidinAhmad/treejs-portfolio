const MyWorksModal = ({
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
        <p>My Works Modal</p>
      </div>
    </div>
  );
};

export default MyWorksModal;
