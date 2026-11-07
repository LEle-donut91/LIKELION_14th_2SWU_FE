import styles from "./ConfirmModal.module.css";

/**
 * 버튼 2개짜리 확인 모달
 * @param {boolean}  isOpen       모달 열림 여부
 * @param {string}   title        제목
 * @param {string}   description  본문 (줄바꿈은 \n)
 * @param {string}   cancelText   왼쪽 버튼 글자
 * @param {string}   confirmText  오른쪽 버튼 글자
 * @param {Function} onCancel     왼쪽 버튼 / 바깥 클릭 시 동작
 * @param {Function} onConfirm    오른쪽 버튼 클릭 시 동작
 */
function ConfirmModal({
  isOpen,
  title,
  description,
  cancelText = "돌아가기",
  confirmText = "확인",
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null; // 닫혀 있으면 아무것도 그리지 않음

  return (
    // 어두운 배경 (바깥 클릭 시 닫기)
    <div className={styles.overlay} onClick={onCancel}>
      {/* 모달 박스 (안쪽 클릭은 닫히지 않게 막기) */}
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;