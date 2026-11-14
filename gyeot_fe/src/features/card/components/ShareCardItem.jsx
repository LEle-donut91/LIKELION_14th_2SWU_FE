import styles from "@/features/card/components/ShareCardItem.module.css";
import Button from "@/shared/components/Button/Button";
import DotSeparatedText from "@/shared/components/DotSeparatedText/DotSeparatedText";
import {
  SHARE_BTN_TEXT,
  SHARE_REVOKED_BADGE_TEXT,
  SHARE_REVOKED_SUB_TEXT,
  SHARING_STATUS,
} from "@/features/card/constants/cardConstants";
import {
  formatAutoRevokeText,
  formatHelpType,
  formatShareDateTime,
  getUniqueSharedItems,
} from "@/features/card/utils/cardFormat";

/**
 * [C-06] 공유 카드 1장 (기본 / 철회됨 상태)
 * - 공유 중: "민재 · 병원 동행 · 10/2 14:00" / "~ 10/2 18:00 자동 회수" / [직접 철회]
 * - 철회됨: 회색 처리, "병원 동행 · 민재" / "10/2 14:00 · 내가 대상" / '철회됨' 뱃지
 *   / canReallow가 true일 때만 [다시 허용]
 * - 태그: 공유 항목 유형 이름(typeName), 같은 유형은 한 번만 표시
 *
 * @param {object}   item       공유 중 목록 조회 응답의 카드 1개
 * @param {boolean}  isPending  이 카드의 철회 / 다시 허용 요청이 처리 중인지
 * @param {boolean}  isDisabled 다른 카드가 처리 중이라 버튼을 막아야 하는지
 * @param {Function} onRevoke   [직접 철회] 클릭 시 동작
 * @param {Function} onReallow  [다시 허용] 클릭 시 동작
 */
function ShareCardItem({ item, isPending = false, isDisabled = false, onRevoke, onReallow }) {
  const { receiver, helpType, startsAt, accessUntil, status, canReallow, sharedItems } = item;

  const isRevoked = status === SHARING_STATUS.REVOKED;
  const helpTypeLabel = formatHelpType(helpType);
  const startsAtText = formatShareDateTime(startsAt);
  const tags = getUniqueSharedItems(sharedItems);

  const titleItems = isRevoked
    ? [helpTypeLabel, receiver?.name]
    : [receiver?.name, helpTypeLabel, startsAtText];

  return (
    <li className={`${styles.shareCardItem} ${isRevoked ? styles.revoked : ""}`}>
      {/* 제목 + (철회됨) 뱃지 */}
      <div className={styles.titleRow}>
        <DotSeparatedText
          items={titleItems}
          className={`${styles.title} typoBodyStrong`}
        />
        {isRevoked && (
          <span className={`${styles.revokedBadge} typoCaptionMedium`}>
            {SHARE_REVOKED_BADGE_TEXT}
          </span>
        )}
      </div>

      {/* 보조 문구 */}
      {isRevoked ? (
        <DotSeparatedText
          items={[startsAtText, SHARE_REVOKED_SUB_TEXT]}
          className={`${styles.sub} typoBodySmall`}
        />
      ) : (
        <p className={`${styles.sub} typoBodySmall`}>
          {formatAutoRevokeText(accessUntil)}
        </p>
      )}

      {/* 태그 + 버튼 */}
      <div className={styles.bottomRow}>
        <ul className={styles.tagList}>
          {tags.map(({ informationType, typeName }) => (
            <li key={informationType} className={`${styles.tag} typoCaptionMedium`}>
              {typeName}
            </li>
          ))}
        </ul>

        {!isRevoked && (
          <Button
            variant="tertiary"
            size="small"
            className={styles.revokeBtn}
            isDisabled={isPending || isDisabled}
            onClick={onRevoke}
          >
            {SHARE_BTN_TEXT.REVOKE}
          </Button>
        )}
        {isRevoked && canReallow && (
          <Button
            variant="secondary"
            size="small"
            className={styles.reallowBtn}
            isDisabled={isPending || isDisabled}
            onClick={onReallow}
          >
            {SHARE_BTN_TEXT.REALLOW}
          </Button>
        )}
      </div>
    </li>
  );
}

export default ShareCardItem;
