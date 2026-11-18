/**
 * =====================================================================
 * [C-01] 안심카드 - 기본 정보
 *  - 페이지 컴포넌트
 *  - 목록 화면 ↔ 편집 화면(생년월일/혈액형)을 라우트 분리 없이 상태(editingKey)로 전환
 *  - 조회·저장·삭제는 useBasicInfo(분류별 항목 조회 / 항목 작성·수정·삭제 API)로 처리
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/card/pages/CardBasic.module.css";

// 일반 라이브러리
import { useEffect, useState } from "react";

// Custom Hooks
import { useToast } from "@/shared/hooks/useToast";
import { useBasicInfo } from "@/features/card/hooks/useBasicInfo";

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
import { getErrorMessage } from "@/shared/utils/apiError";
import {
  formatShortDate,
  formatBirthDate,
  formatBloodType,
  toBirthDateInput,
  toBirthDateValue,
  isBirthDateLengthValid,
  isExistingDate,
  isFutureDate,
} from "@/features/card/utils/cardFormat";

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
  // 편집 중인 항목 키 (null이면 목록 화면, BASIC_INFO_KEY 값이면 해당 편집 화면)
  const [editingKey, setEditingKey] = useState(null);

  // 편집 화면 입력값 (생년월일: "YYYYMMDD", 혈액형: BLOOD_TYPE_OPTIONS 값)
  const [draftValue, setDraftValue] = useState("");

  // 삭제 확인 모달의 열림/닫힘 상태
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  // 기본 정보 조회·저장·삭제 (성공·실패 안내는 토스트로)
  // - basicInfo: { birthDate, bloodType } / 항목마다 { informationId, value, updatedAt } 또는 null
  const { basicInfo, isPending, error, isSaving, saveBasicInfo, deleteBasicInfo } =
    useBasicInfo({ onMessage: showToast });

  // 조회 실패 시 토스트 안내 (목록은 그리지 않음)
  useEffect(() => {
    if (!error) return;
    showToast(getErrorMessage(error));
  }, [error, showToast]);

  // 현재 편집 중인 항목 설정 (헤더/라벨 제목에 사용)
  const editingItem = BASIC_INFO_ITEM_LIST.find(
    (item) => item.key === editingKey,
  );

  // 등록된 값이 없는 항목을 편집 중인지 (오른쪽 버튼 [추가], [삭제]는 모달 없이 닫기)
  const isAddMode = Boolean(editingItem) && !basicInfo?.[editingKey];

  // 목록 카드의 '수정하기' 클릭 → 편집 화면으로 전환
  const handleEditOpen = (key) => {
    setDraftValue(getInitialDraft(key, basicInfo?.[key]?.value));
    setEditingKey(key);
  };

  // 편집 화면 닫기 (X 버튼 / 저장·삭제 성공) → 입력값 버리고 목록 화면으로
  const handleEditClose = () => {
    setEditingKey(null);
    setDraftValue("");
  };

  // [수정]/[추가] 버튼 클릭 → 검증 후 저장, 성공하면 목록 화면으로 (실패 시 토스트, 편집 화면 유지)
  const handleSaveClick = () => {
    if (isSaving) return;

    let value = draftValue;

    if (editingKey === BASIC_INFO_KEY.BIRTH_DATE) {
      const errorMessage = getBirthDateErrorMessage(draftValue);
      if (errorMessage) {
        showToast(errorMessage);
        return;
      }
      value = toBirthDateValue(draftValue);
    }

    if (editingKey === BASIC_INFO_KEY.BLOOD_TYPE && !draftValue) {
      showToast(BASIC_INFO_TOAST_MESSAGE.BLOOD_TYPE_REQUIRED);
      return;
    }

    saveBasicInfo({ key: editingKey, value }, { onSuccess: handleEditClose });
  };

  // [삭제] 버튼 클릭
  // - 등록된 값이 없으면 지울 값이 없으므로 모달 없이 바로 닫기
  // - 등록된 값이 있으면 삭제 확인 모달 열기
  const handleDeleteClick = () => {
    if (isAddMode) {
      handleEditClose();
      return;
    }
    setDeleteModalOpen(true);
  };

  // 모달의 [삭제] 클릭 → 삭제 요청, 성공하면 목록 화면으로 (성공·실패 모두 모달 닫기)
  const handleDeleteConfirm = () => {
    if (isSaving) return;

    deleteBasicInfo(editingKey, {
      onSuccess: handleEditClose,
      onSettled: () => setDeleteModalOpen(false),
    });
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
            rightTitle={
              isAddMode
                ? BASIC_INFO_FOOTER_TEXT.ADD
                : BASIC_INFO_FOOTER_TEXT.UPDATE
            }
            leftOnClick={handleDeleteClick}
            rightOnClick={handleSaveClick}
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
            {/* TODO: 로딩·에러 화면 디자인이 정해지면 추가 (지금은 헤더만 표시, C-03·C-06과 동일) */}
            {!isPending && !error && (
              <ul className={styles.infoList}>
                {BASIC_INFO_ITEM_LIST.map(({ key, title }) => (
                  <BasicInfoItem
                    key={key}
                    title={title}
                    description={getDescriptionText(key, basicInfo?.[key]?.value)}
                    updatedDateText={formatShortDate(basicInfo?.[key]?.updatedAt)}
                    onEditClick={() => handleEditOpen(key)}
                  />
                ))}
              </ul>
            )}
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