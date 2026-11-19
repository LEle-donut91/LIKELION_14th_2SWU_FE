import { Sheet } from "react-modal-sheet";
import styles from "@/features/situation/components/SituationEndSheet.module.css";

/**
 * H-03-05 상황 종료 확인 바텀시트 (취소 / 종료하기)
 * - activeRequestCount : 진행 중인 요청 수 (0이면 안내 박스를 보여주지 않음)
 * - onConfirm          : '종료하기' 클릭 시 동작
 */
function SituationEndSheet({ isOpen, onClose, activeRequestCount, onConfirm }) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header />
        <Sheet.Content>
          <div className={styles.txtContainer}>
            <h2 className={`${styles.title} typoTitleMedium`}>
              상황을 종료할까요?
            </h2>

            {activeRequestCount > 0 && (
              <p className={`${styles.notice} typoBodySmall`}>
                진행 중인 요청 <strong>{activeRequestCount}건</strong>이
                있어요. 종료하면 <strong>남은 요청은 모두 취소</strong>되고
                관련 <strong>접근 권한이 모두 회수</strong>돼요.
              </p>
            )}
          </div>

          <div className={styles.btnContainer}>
            <button
              type="button"
              className={`${styles.sheetBtn} ${styles.cancelBtn}`}
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="button"
              className={`${styles.sheetBtn} ${styles.endBtn}`}
              onClick={onConfirm}
            >
              종료하기
            </button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onClick={onClose} />
    </Sheet>
  );
}

export default SituationEndSheet;
