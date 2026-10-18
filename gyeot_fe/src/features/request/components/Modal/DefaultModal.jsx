import Modal from "react-modal";
import styles from "@/features/request/components/Modal/DefaultModal.module.css";

function DefaultModal({
  modalOpen,
  setModalOpen,
  title,
  description,
  cancelTxt,
  confirmTxt,
  onConfirmClick,
}) {
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      overlayClassName={styles.overlayContent}
      className={styles.modalContent}
      ariaHideApp={false}
    >
      <div className={styles.txtContainer}>
        <span className={`${styles.title} typoBodyStrong`}>{title}</span>
        <span className={`${styles.information} typoBodySmall`}>
          {description}
        </span>
      </div>
      <div className={styles.btnContainer}>
        <button
          onClick={() => setModalOpen(false)}
          className={`${styles.modalBtn} ${styles.cancelBtn}`}
        >
          <span className="typoBodySmall">{cancelTxt}</span>
        </button>
        <button
          onClick={onConfirmClick}
          className={`${styles.modalBtn} ${styles.confirmBtn}`}
        >
          <span className="typoBodySmall">{confirmTxt}</span>
        </button>
      </div>
    </Modal>
  );
}

export default DefaultModal;
