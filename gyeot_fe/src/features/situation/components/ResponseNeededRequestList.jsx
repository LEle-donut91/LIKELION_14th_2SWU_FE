import styles from "@/features/situation/components/ResponseNeededRequestList.module.css";
import { formatDateWithTime } from "@/features/situation/utils/situationFormat";
import {
  HELP_TYPE_LABEL,
  REQUEST_STATUS_TAG,
} from "@/features/situation/constants/situationConstants";

/**
 * H-03-02 참여자뷰 - 응답이 필요한 요청 (도움 종류 · 상태 칩 · 일시 · 응답 기한 · 응답하기)
 * - requests       : [{ id, helpType, startDateTime, responseDeadline(없으면 null), status }]
 * - onRequestClick : 카드 클릭 시 요청 데이터 전달
 */
function ResponseNeededRequestList({ requests, onRequestClick }) {
  return (
    <ul className={styles.requestList}>
      {requests.map((request) => {
        const { id, helpType, startDateTime, responseDeadline, status } =
          request;
        const statusTag = REQUEST_STATUS_TAG[status];

        return (
          <li key={id}>
            <button
              type="button"
              className={styles.requestCard}
              onClick={() => onRequestClick(request)}
            >
              <span className={styles.titleRow}>
                <span className={`${styles.title} typoBodyStrong`}>
                  {HELP_TYPE_LABEL[helpType]}
                </span>
                {statusTag && (
                  <span className={`${styles.statusTag} typoCaptionMedium`}>
                    {statusTag.label}
                  </span>
                )}
              </span>
              <span className={`${styles.meta} typoCaptionMedium`}>
                {formatDateWithTime(startDateTime)}
                {/* 응답 기한은 응답에 있을 때만 표시 (상황 상세 조회 명세에 아직 없는 값) */}
                {responseDeadline && (
                  <>
                    {" · "}
                    <strong className={styles.deadline}>
                      응답 기한 {formatDateWithTime(responseDeadline)}
                    </strong>
                  </>
                )}
              </span>
              <span className={`${styles.responseLink} typoCaptionMedium`}>
                응답하기 &gt;
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default ResponseNeededRequestList;
