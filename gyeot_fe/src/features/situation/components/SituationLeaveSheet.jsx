import { Sheet } from "react-modal-sheet";
import styles from "@/features/situation/components/SituationLeaveSheet.module.css";
import iconCalendar from "@/shared/assets/icons/iconCalendar.svg";
import {
  HELP_TYPE_LABEL,
  REQUEST_STATUS_TAG,
} from "@/features/situation/constants/situationConstants";
import { formatMonthDayTime } from "@/features/situation/utils/situationFormat";

// 나가면 담당 요청이 어떻게 처리되는지 (F-04, F-08)
// - 수락됨(시작 전): 수락 철회처럼 처리 / 진행 중: 요청 취소
const LEAVE_RESULT_TAG = {
  ACCEPTED: "철회 처리",
  IN_PROGRESS: "요청 취소",
};

/**
 * N-09 상황 나가기 확인 바텀시트 (취소 / 나가기)
 * - assignedRequests : 내가 담당 중인 요청 [{ id, helpType, startDateTime, status }]
 *                      (0건이면 안내 박스와 요청 목록을 보여주지 않음)
 * - onConfirm        : '나가기' 클릭 시 동작
 */
function SituationLeaveSheet({ isOpen, onClose, assignedRequests, onConfirm }) {
  const acceptedCount = assignedRequests.filter(
    ({ status }) => status === "ACCEPTED",
  ).length;
  const inProgressCount = assignedRequests.filter(
    ({ status }) => status === "IN_PROGRESS",
  ).length;

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header />
        <Sheet.Content>
          <div className={styles.content}>
            <div className={styles.txtContainer}>
              <h2 className={`${styles.title} typoTitleMedium`}>
                상황에서 나갈까요?
              </h2>

              {assignedRequests.length > 0 && (
                <div className={`${styles.notice} typoBodySmall`}>
                  {acceptedCount > 0 && (
                    <p>
                      내가 담당 중인 요청 <strong>{acceptedCount}건</strong>은{" "}
                      <strong>수락 철회처럼 처리</strong>돼요.
                    </p>
                  )}
                  {inProgressCount > 0 && (
                    <p>
                      진행 중인 요청 <strong>{inProgressCount}건</strong>은{" "}
                      <strong>취소</strong>돼요.
                    </p>
                  )}
                  <p>
                    해당 요청에 대한 접근 권한이 사라지며, 요청자에게 변경
                    사항이 안내됩니다.
                  </p>
                </div>
              )}
            </div>

            {assignedRequests.length > 0 && (
              <ul className={styles.requestList}>
                {assignedRequests.map(
                  ({ id, helpType, startDateTime, status }) => (
                    <li key={id} className={styles.requestItem}>
                      <span className={styles.iconCircle}>
                        <img src={iconCalendar} alt="" />
                      </span>
                      <span className={styles.requestTxt}>
                        <span className={styles.requestTitle}>
                          {HELP_TYPE_LABEL[helpType]} ·{" "}
                          {formatMonthDayTime(startDateTime)}
                        </span>
                        <span className={`${styles.requestStatus} typoBodySmall`}>
                          {REQUEST_STATUS_TAG[status]?.label}
                        </span>
                      </span>
                      {LEAVE_RESULT_TAG[status] && (
                        <span className={styles.resultTag}>
                          {LEAVE_RESULT_TAG[status]}
                        </span>
                      )}
                    </li>
                  ),
                )}
              </ul>
            )}

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
                className={`${styles.sheetBtn} ${styles.leaveBtn}`}
                onClick={onConfirm}
              >
                나가기
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onClick={onClose} />
    </Sheet>
  );
}

export default SituationLeaveSheet;
