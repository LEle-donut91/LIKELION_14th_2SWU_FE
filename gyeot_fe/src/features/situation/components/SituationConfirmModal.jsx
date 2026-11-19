import Modal from "react-modal";
import styles from "@/features/situation/components/SituationConfirmModal.module.css";

/**
 * 상황 화면 확인 모달 (취소 / 위험 동작 버튼)
 * - 요청 화면 DefaultModal과 같은 구조이고, 확인 버튼이 red-700(위험 동작)인 점만 다름
 * - message     : 안내 문구 (줄바꿈은 \n)
 * - confirmText : 오른쪽 버튼 문구
 * - onConfirm   : 오른쪽 버튼 클릭 시 동작
 * - onClose     : 취소 / 바깥 클릭 시 동작
 */
function SituationConfirmModal({
  isOpen,
  message,
  cancelText = "취소",
  confirmText,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}
      ariaHideApp={false}
    >
      <p className={`${styles.message} typoBodyStrong`}>{message}</p>

      <div className={styles.btnContainer}>
        <button
          type="button"
          className={`${styles.modalBtn} ${styles.cancelBtn} typoBodySmall`}
          onClick={onClose}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`${styles.modalBtn} ${styles.confirmBtn} typoBodySmall`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default SituationConfirmModal;
