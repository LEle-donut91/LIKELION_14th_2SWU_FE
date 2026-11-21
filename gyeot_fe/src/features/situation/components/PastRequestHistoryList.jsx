import styles from "@/features/situation/components/PastRequestHistoryList.module.css";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import {
  formatMonthDay,
  formatMonthDayTime,
} from "@/features/situation/utils/situationFormat";
import {
  HELP_TYPE_LABEL,
  PAST_REQUEST_STATUS_TAG,
} from "@/features/situation/constants/situationConstants";

/**
 * N-04 지난 상황 상세 - 요청 기록 (도움 종류 · 담당자/일시 · 완료/취소 태그)
 * - 요청자 시점(isOwner): 프로필 + "민재 • 9/3" (미배정이면 날짜만)
 * - 담당자 시점         : "9/1 11:00 - 9/1 20:00" (종료 시각이 없으면 시작 시각만)
 * 민감정보는 보여주지 않고 도움 종류 · 담당자 · 날짜 · 상태만 표시 (F-22)
 *
 * - requests : [{ id, helpType, assigneeName(없으면 null), startDateTime, endDateTime(없으면 null), status }]
 */
function PastRequestHistoryList({ requests, isOwner }) {
  return (
    <ul className={styles.historyList}>
      {requests.map(
        ({
          id,
          helpType,
          assigneeName,
          startDateTime,
          endDateTime,
          status,
        }) => {
          const statusTag = PAST_REQUEST_STATUS_TAG[status];

          return (
            <li key={id} className={styles.historyItem}>
              {isOwner && (
                <span className={styles.profile} aria-hidden="true" />
              )}

              <span className={styles.textContainer}>
                <span className={`${styles.title} typoBodyStrong`}>
                  {HELP_TYPE_LABEL[helpType]}
                </span>
                {isOwner ? (
                  <DotSeparatedText
                    className={`${styles.meta} typoCaptionMedium`}
                    items={[assigneeName, formatMonthDay(startDateTime)]}
                  />
                ) : (
                  <span className={`${styles.meta} typoCaptionMedium`}>
                    {formatMonthDayTime(startDateTime)}
                    {endDateTime && ` - ${formatMonthDayTime(endDateTime)}`}
                  </span>
                )}
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
            </li>
          );
        },
      )}
    </ul>
  );
}

export default PastRequestHistoryList;
