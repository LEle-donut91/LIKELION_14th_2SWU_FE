// C-03 연락 순서

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/features/card/pages/CardContact.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import { useToast } from "@/shared/hooks/useToast";
import ContactOrderList from "@/features/card/components/ContactOrderList";
import ContactOrderEmpty from "@/features/card/components/ContactOrderEmpty";
import CardAddButton from "@/features/card/components/CardAddButton";
import { useContactOrder } from "@/features/card/hooks/useContactOrder";
import { MAX_GUARDIANS } from "@/features/relation/constants/relation";
import {
  CONTACT_ORDER_NAVIGATION_PATH,
  CONTACT_ORDER_NOTICE,
  CONTACT_ORDER_TITLE,
  CONTACT_ORDER_TOAST_MESSAGE,
  CONTACT_RELATIONSHIP_LABELS,
  CONTACT_RELATIONSHIP_TYPE,
} from "@/features/card/constants/cardConstants";

const { GUARDIAN, MY_PERSON } = CONTACT_RELATIONSHIP_TYPE;

function CardContact() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  // 저장 성공 시 토스트
  const handleSaveSuccess = useCallback(() => {
    showToast(CONTACT_ORDER_TOAST_MESSAGE.SAVE_SUCCESS);
  }, [showToast]);

  const {
    guardians,
    myPeople,
    isLoading,
    hasError,
    isSaving,
    handleReorder,
    handleReorderEnd,
  } = useContactOrder({ onSaveSuccess: handleSaveSuccess });

  const hasGuardian = guardians.length > 0;
  const isEmpty = !hasGuardian && myPeople.length === 0;

  const handleInviteClick = () => {
    navigate(CONTACT_ORDER_NAVIGATION_PATH.MY_PERSON_INVITE);
  };

  const handleGuardianRequestClick = () => {
    navigate(CONTACT_ORDER_NAVIGATION_PATH.GUARDIAN_REQUEST);
  };

  // 본문: 조회 중 / 실패 / 빈 상태 / 목록
  const renderContent = () => {
    // TODO: 로딩·에러 화면 디자인이 정해지면 추가 (지금은 헤더만 표시)
    if (isLoading || hasError) return null;

    if (isEmpty) {
      return (
        <ContactOrderEmpty
          onInviteClick={handleInviteClick}
          onGuardianRequestClick={handleGuardianRequestClick}
        />
      );
    }

    return (
      <div className={styles.mainContent}>
        {hasGuardian && (
          <>
            {/* 서로의 보호자 */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={`${styles.sectionTitle} typoTitleMedium`}>
                  {CONTACT_RELATIONSHIP_LABELS.GUARDIAN}
                </h2>
                <span className={`${styles.sectionLimit} typoCaptionMedium`}>
                  최대 {MAX_GUARDIANS}명
                </span>
              </div>
              <ContactOrderList
                contacts={guardians}
                startRank={1}
                isSubVisible
                isDragDisabled={isSaving}
                onReorder={(next) => handleReorder(GUARDIAN, next)}
                onReorderEnd={() => handleReorderEnd(GUARDIAN)}
              />
            </section>

            <hr className={styles.divider} />
          </>
        )}

        {/* 나의 사람 (보호자가 없으면 섹션 제목 없이 목록만 표시) */}
        <section className={styles.section}>
          {hasGuardian && (
            <h2 className={`${styles.sectionTitle} typoTitleMedium`}>
              {CONTACT_RELATIONSHIP_LABELS.MY_PERSON}
            </h2>
          )}
          <ContactOrderList
            contacts={myPeople}
            startRank={guardians.length + 1}
            isSubVisible={hasGuardian}
            isDragDisabled={isSaving}
            onReorder={(next) => handleReorder(MY_PERSON, next)}
            onReorderEnd={() => handleReorderEnd(MY_PERSON)}
            // 보호자만 있고 나의 사람이 없을 때: 나의 사람 초대로 이동
            emptyContent={<CardAddButton onClick={handleInviteClick} />}
          />
        </section>

        {/* 하단 안내 */}
        <div className={styles.notice}>
          {(hasGuardian
            ? CONTACT_ORDER_NOTICE.WITH_GUARDIAN
            : CONTACT_ORDER_NOTICE.WITHOUT_GUARDIAN
          ).map((lines) => (
            <p key={lines.join()} className={`${styles.noticeText} typoBodySmall`}>
              {lines.map((line) => (
                <span key={line} className={styles.noticeLine}>
                  {line}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title={CONTACT_ORDER_TITLE} />

      <main className={styles.main}>{renderContent()}</main>

      {/* 토스트 (DefaultToast 기본 위치: 페이지 하단 기준) */}
      {toast && (
        <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
      )}
    </div>
  );
}

export default CardContact;
