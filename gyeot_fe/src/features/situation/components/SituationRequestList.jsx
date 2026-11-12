import styles from "@/features/situation/components/SituationRequestList.module.css";
import { formatDateTime } from "@/shared/utils/dateFormat";
import { formatRequestPeriod } from "@/features/situation/utils/situationFormat";
import {
  HELP_TYPE_LABEL,
  MY_REQUEST_ROLE,
  REQUEST_STATUS_TAG,
} from "@/features/situation/constants/situationConstants";

/**
 * H-03 상황 상세 - 요청 목록 (도움 종류 · 대상, 일정, 상태 태그)
 * - requests       : [{ id, helpType, targetName, startDateTime, endDateTime, status, myRole? }]
 *   (myRole이 있으면 참여자뷰: "10/2(일) 14:00 · 내가 대상")
 *   (기간은 날짜만 표시: 9/28(일) - 10/12(일), 하루 안이면 9/28(일))
 * - onRequestClick : 요청 클릭 시 요청 데이터 전달
 */
function SituationRequestList({ requests, onRequestClick }) {
  return (
    <ul className={styles.requestList}>
      {requests.map(
        (request) => {
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

          return (
            <li key={id}>
              <button
                type="button"
                className={styles.requestItem}
                onClick={() => onRequestClick(request)}
              >
                <span className={styles.titleRow}>
                  <span className={`${styles.title} typoBodyStrong`}>
                    {[HELP_TYPE_LABEL[helpType], targetName]
                      .filter(Boolean)
                      .join(" · ")}
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
                    ? `${formatDateTime(startDateTime)} · ${myRoleLabel}`
                    : formatRequestPeriod(startDateTime, endDateTime)}
                </span>
              </button>
            </li>
          );
        },
      )}
    </ul>
  );
}

export default SituationRequestList;
