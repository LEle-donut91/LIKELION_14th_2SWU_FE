import styles from "@/features/situation/components/SituationRequestList.module.css";
import { formatRequestPeriod } from "@/features/situation/utils/situationFormat";
import {
  HELP_TYPE_LABEL,
  REQUEST_STATUS_TAG,
} from "@/features/situation/constants/situationConstants";

/**
 * H-03 상황 상세 - 요청 목록 (도움 종류 · 대상, 일정, 상태 태그)
 * - requests       : [{ id, helpType, targetName, startDateTime, endDateTime, status }]
 *   (기간은 날짜만 표시: 9/28(일) - 10/12(일), 하루 안이면 9/28(일))
 * - onRequestClick : 요청 클릭 시 요청 id 전달
 */
function SituationRequestList({ requests, onRequestClick }) {
  return (
    <ul className={styles.requestList}>
      {requests.map(
        ({ id, helpType, targetName, startDateTime, endDateTime, status }) => {
          const statusTag = REQUEST_STATUS_TAG[status];

          return (
            <li key={id}>
              <button
                type="button"
                className={styles.requestItem}
                onClick={() => onRequestClick(id)}
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
                  {formatRequestPeriod(startDateTime, endDateTime)}
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
