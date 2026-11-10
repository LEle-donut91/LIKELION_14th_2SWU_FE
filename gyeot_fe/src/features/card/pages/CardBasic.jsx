/**
 * =====================================================================
 * [C-01] 안심카드 - 기본 정보
 *  - 페이지 컴포넌트
 *  - 목록 화면 ↔ 편집 화면(생년월일/혈액형)을 라우트 분리 없이 상태(editingKey)로 전환
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/card/pages/CardBasic.module.css";

// 일반 라이브러리
import { useState } from "react";

// Custom Hooks
import { useToast } from "@/shared/hooks/useToast";

// Constants
import {
  BASIC_INFO_KEY,
  BASIC_INFO_ITEM_LIST,
  BASIC_INFO_EMPTY_TEXT,
  BASIC_INFO_FOOTER_TEXT,
  BASIC_INFO_TOAST_MESSAGE,
  BASIC_INFO_DELETE_MODAL,
} from "@/features/card/constants/cardConstants";

// Utils
import {
  formatShortDate,
  formatBirthDate,
  formatBloodType,
  toBirthDateInput,
  toBirthDateValue,
  isBirthDateLengthValid,
  isExistingDate,
  isFutureDate,
  getTodayDateString,
} from "@/features/card/utils/cardFormat";

// Mocks
// TODO: API 연동 시 조회 결과로 교체
import { CARD_BASIC_MOCK } from "@/features/card/mocks/cardMockData";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import BasicInfoItem from "@/features/card/components/BasicInfoItem";
import BirthDateField from "@/features/card/components/BirthDateField";
import BloodTypeField from "@/features/card/components/BloodTypeField";

// 항목별 목록 카드에 보여줄 값 문구 (값이 없으면 안내 문구)
const getDescriptionText = (key, value) => {
  if (!value) return BASIC_INFO_EMPTY_TEXT;
  if (key === BASIC_INFO_KEY.BIRTH_DATE) return formatBirthDate(value);
  if (key === BASIC_INFO_KEY.BLOOD_TYPE) return formatBloodType(value);
  return "";
};

// 편집 화면 진입 시 입력란 초기값 (저장값 → 입력값)
const getInitialDraft = (key, value) => {
  if (key === BASIC_INFO_KEY.BIRTH_DATE) return toBirthDateInput(value);
  return value ?? "";
};

// 생년월일 입력값 검증 (통과하면 null, 실패하면 토스트 문구 반환)
const getBirthDateErrorMessage = (input) => {
  if (!isBirthDateLengthValid(input)) {
    return BASIC_INFO_TOAST_MESSAGE.BIRTH_DATE_LENGTH;
  }
  if (!isExistingDate(input)) {
    return BASIC_INFO_TOAST_MESSAGE.BIRTH_DATE_INVALID;
  }
  if (isFutureDate(input)) {
    return BASIC_INFO_TOAST_MESSAGE.BIRTH_DATE_FUTURE;
  }
  return null;
};

// 페이지 컴포넌트
function CardBasic() {
  // 기본 정보 데이터 (API 연동 전까지 mock으로 화면 안에서만 관리)
  const [basicInfo, setBasicInfo] = useState(CARD_BASIC_MOCK);

  // 편집 중인 항목 키 (null이면 목록 화면, BASIC_INFO_KEY 값이면 해당 편집 화면)
  const [editingKey, setEditingKey] = useState(null);

  // 편집 화면 입력값 (생년월일: "YYYYMMDD", 혈액형: BLOOD_TYPE_OPTIONS 값)
  const [draftValue, setDraftValue] = useState("");

  // 삭제 확인 모달의 열림/닫힘 상태
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  // 현재 편집 중인 항목 설정 (헤더/라벨 제목에 사용)
  const editingItem = BASIC_INFO_ITEM_LIST.find(
    (item) => item.key === editingKey,
  );

  // 항목 값 변경 + 갱신일을 오늘로 변경
  // TODO: API 연동 시 수정/삭제 요청 후 응답 기준으로 갱신
  const updateBasicInfo = (key, value) => {
    setBasicInfo((prev) => ({
      ...prev,
      [key]: { value, updatedDate: getTodayDateString() },
    }));
  };

  // 목록 카드의 '수정하기' 클릭 → 편집 화면으로 전환
  const handleEditOpen = (key) => {
    setDraftValue(getInitialDraft(key, basicInfo[key]?.value));
    setEditingKey(key);
  };

  // 편집 화면 닫기 (X 버튼) → 입력값 버리고 목록 화면으로
  const handleEditClose = () => {
    setEditingKey(null);
    setDraftValue("");
  };

  // [수정] 버튼 클릭 → 검증 후 저장하고 목록 화면으로 (실패 시 토스트)
  const handleUpdateClick = () => {
    if (editingKey === BASIC_INFO_KEY.BIRTH_DATE) {
      const errorMessage = getBirthDateErrorMessage(draftValue);
      if (errorMessage) {
        showToast(errorMessage);
        return;
      }
      updateBasicInfo(editingKey, toBirthDateValue(draftValue));
    }

    if (editingKey === BASIC_INFO_KEY.BLOOD_TYPE) {
      if (!draftValue) {
        showToast(BASIC_INFO_TOAST_MESSAGE.BLOOD_TYPE_REQUIRED);
        return;
      }
      updateBasicInfo(editingKey, draftValue);
    }

    handleEditClose();
  };

  // [삭제] 버튼 클릭 → 삭제 확인 모달 열기
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  // 모달의 [삭제] 클릭 → 값 삭제 후 목록 화면으로
  const handleDeleteConfirm = () => {
    updateBasicInfo(editingKey, null);
    setDeleteModalOpen(false);
    handleEditClose();
  };

  return (
    <div className={styles.page}>
      {editingItem ? (
        // ---------------- 편집 화면 ----------------
        <>
          <SubpageHeader
            title={editingItem.title}
            hasBackButton={false}
            hasCloseButton={true}
            onCloseClick={handleEditClose}
          />

          <main className={styles.editContent}>
            {editingKey === BASIC_INFO_KEY.BIRTH_DATE && (
              <BirthDateField
                title={editingItem.title}
                value={draftValue}
                onChange={setDraftValue}
              />
            )}
            {editingKey === BASIC_INFO_KEY.BLOOD_TYPE && (
              <BloodTypeField
                title={editingItem.title}
                value={draftValue}
                onChange={setDraftValue}
              />
            )}
          </main>

          <SmallFooter
            leftType="tertiary"
            rightType="primary"
            leftTitle={BASIC_INFO_FOOTER_TEXT.DELETE}
            rightTitle={BASIC_INFO_FOOTER_TEXT.UPDATE}
            leftOnClick={handleDeleteClick}
            rightOnClick={handleUpdateClick}
          />

          {/* 삭제 확인 모달 (안내문은 줄 단위로 <br /> 처리) */}
          <DefaultModal
            modalOpen={isDeleteModalOpen}
            setModalOpen={setDeleteModalOpen}
            title={BASIC_INFO_DELETE_MODAL.title}
            description={BASIC_INFO_DELETE_MODAL.descriptionLines.map(
              (line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ),
            )}
            cancelTxt={BASIC_INFO_DELETE_MODAL.cancelText}
            confirmTxt={BASIC_INFO_DELETE_MODAL.confirmText}
            onConfirmClick={handleDeleteConfirm}
          />
        </>
      ) : (
        // ---------------- 목록 화면 ----------------
        <>
          <SubpageHeader title="기본 정보" />

          <main className={styles.listContent}>
            <ul className={styles.infoList}>
              {BASIC_INFO_ITEM_LIST.map(({ key, title }) => (
                <BasicInfoItem
                  key={key}
                  title={title}
                  description={getDescriptionText(key, basicInfo[key]?.value)}
                  updatedDateText={formatShortDate(basicInfo[key]?.updatedDate)}
                  onEditClick={() => handleEditOpen(key)}
                />
              ))}
            </ul>
          </main>
        </>
      )}

      {/* 토스트 (DefaultToast는 absolute 배치라 하단 푸터와 겹치지 않도록 감싸서 위치 조정) */}
      {toast && (
        <div className={styles.toastArea}>
          <DefaultToast
            key={toast.id}
            message={toast.message}
            onHide={hideToast}
          />
        </div>
      )}
    </div>
  );
}

export default CardBasic;