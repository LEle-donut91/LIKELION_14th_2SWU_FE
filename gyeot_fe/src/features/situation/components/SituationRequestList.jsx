import styles from "@/features/situation/components/SituationRequestList.module.css";
import {
  formatDateWithTime,
  formatRequestSchedule,
} from "@/features/situation/utils/situationFormat";
import {
  HELP_TYPE_LABEL,
  MY_REQUEST_ROLE,
  REQUEST_STATUS_TAG,
} from "@/features/situation/constants/situationConstants";

/**
 * H-03 상황 상세 - 요청 목록 (제목, 일정, 상태 칩)
 * - 정보 주인(H-03-01): "식사(서연)" / "9/30(화) 18:00 - 19:00"
 * - 참여자(H-03-02)  : "식사"       / "9/30(화) 18:00 · 내가 담당" (myRole이 있으면)
 * - 끝난 요청(완료·취소·만료)은 글자를 흐리게 표시
 *
 * - requests       : [{ id, helpType, targetName, startDateTime, endDateTime, status, myRole? }]
 * - onRequestClick : 요청 클릭 시 요청 데이터 전달
 */
function SituationRequestList({ requests, onRequestClick }) {
  return (
    <ul className={styles.requestList}>
      {requests.map((request) => {
        const {
          id,
          helpType,
          targetName,
          startDateTime,
          endDateTime,
          status,
          myRole,
        } = request;
        const statusTag = REQUEST_STATUS_TAG[status];
        const myRoleLabel = MY_REQUEST_ROLE[myRole]?.label;
        const helpTypeLabel = HELP_TYPE_LABEL[helpType];

        return (
          <li key={id}>
            <button
              type="button"
              className={`${styles.requestItem} ${
                statusTag?.isEnded ? styles.endedItem : ""
              }`}
              onClick={() => onRequestClick(request)}
            >
              <span className={styles.titleRow}>
                <span className={`${styles.title} typoBodyStrong`}>
                  {myRoleLabel || !targetName
                    ? helpTypeLabel
                    : `${helpTypeLabel}(${targetName})`}
                </span>
                {statusTag && (
                  <span
                    className={`${styles.statusTag} ${
                      styles[statusTag.variant]
                    } typoCaptionMedium`}
                  >
                    {statusTag.label}
                  </span>
                )}
              </span>
              <span className={`${styles.meta} typoCaptionMedium`}>
                {myRoleLabel
                  ? `${formatDateWithTime(startDateTime)} · ${myRoleLabel}`
                  : formatRequestSchedule(startDateTime, endDateTime)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default SituationRequestList;
