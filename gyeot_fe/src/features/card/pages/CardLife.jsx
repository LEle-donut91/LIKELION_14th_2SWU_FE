/**
 * =====================================================================
 * [C-04] 안심카드 - 생활 정보
 *  - 페이지 컴포넌트
 *  - 목록 화면 ↔ 편집 화면(집 주소/출입 방법/반려동물)을 라우트 분리 없이 상태(editTarget)로 전환
 *  - 섹션·카드·입력 필드는 LIFE_SECTION_LIST 설정으로 그림
 *  - 편집 로직은 C-02(CardHealth)에서 복사 (공통화는 별도 이슈에서 진행)
 *  - 조회·저장·삭제는 useSafetyInfoItems(분류별 항목 조회 / 항목 작성·수정·삭제 API)로 처리
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/card/pages/CardLife.module.css";

// 일반 라이브러리
import { useCallback, useEffect, useState } from "react";

// Custom Hooks
import { useToastStore } from "@/shared/stores/useToastStore";
import { useSafetyInfoItems } from "@/features/card/hooks/useSafetyInfoItems";

// Constants
import {
  SAFETY_INFO_CATEGORY,
  LIFE_INFO_PAGE_TITLE,
  LIFE_SECTION_LIST,
  BASIC_INFO_EMPTY_TEXT,
  BASIC_INFO_FOOTER_TEXT,
  BASIC_INFO_DELETE_MODAL,
} from "@/features/card/constants/cardConstants";

// Utils
import { getErrorMessage } from "@/shared/utils/apiError";
import {
  formatShortDate,
  formatToastMessage,
} from "@/features/card/utils/cardFormat";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import Toast from "@/shared/components/Toast/Toast";
import BasicInfoItem from "@/features/card/components/BasicInfoItem";
import HealthInfoSection from "@/features/card/components/HealthInfoSection";
import CardTextField from "@/features/card/components/CardTextField";

// 모든 섹션의 항목 유형을 한 배열로 (편집 중인 유형 찾기용, 조회 응답 매핑용)
const LIFE_TYPE_LIST = LIFE_SECTION_LIST.flatMap((section) => section.types);

// 편집 화면 진입 시 입력값 초기화: 유형 필드 키마다 항목 값 (새로 추가하면 모두 "")
// 예: 반려동물 수정 → { name: "나롱이", care: "하루에 3번 끼니 제공" }
const getInitialDraft = (type, item) =>
  type.fields.reduce(
    (draft, field) => ({ ...draft, [field.key]: item?.[field.key] ?? "" }),
    {},
  );

// 필수 필드 검증 (통과하면 null, 실패하면 위에서부터 첫 번째 빈 필드의 토스트 문구 반환)
const getRequiredErrorMessage = (type, draft) => {
  const emptyField = type.fields.find(
    (field) => field.isRequired && !draft[field.key]?.trim(),
  );
  return emptyField ? emptyField.requiredMessage : null;
};

// 저장 전 입력값 앞뒤 공백 제거
const trimDraft = (draft) =>
  Object.fromEntries(
    Object.entries(draft).map(([key, value]) => [key, value.trim()]),
  );

// 페이지 컴포넌트
function CardLife() {
  // 편집 대상 (null이면 목록 화면)
  // - typeKey: 편집 중인 항목 유형 (LIFE_TYPE_KEY 값)
  // - itemId: 수정 중인 항목 id(informationId) / null이면 새 항목 (반려동물 '추가하기', 비어 있는 집 정보 '수정하기')
  const [editTarget, setEditTarget] = useState(null);

  // 편집 화면 입력값 (필드 키별 문자열)
  const [draft, setDraft] = useState({});

  // 삭제 확인 모달의 열림/닫힘 상태
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // 토스트 (공통 스토어: 페이지를 이동해도 3초 동안 유지)
  // - Toast는 props가 없어 문장 줄바꿈(formatToastMessage)은 띄울 때 적용 (useCallback으로 참조 유지)
  const showStoreToast = useToastStore((state) => state.showToast);
  const showToast = useCallback(
    (message) => showStoreToast(formatToastMessage(message)),
    [showStoreToast],
  );

  // 생활 정보 조회·저장·삭제 (성공·실패 안내는 토스트로)
  // - lifeInfo: { address: [항목], entranceMethod: [항목], pet: [항목...] }
  const {
    infoByKey: lifeInfo,
    isPending,
    error,
    isSaving,
    saveItem,
    deleteItem,
  } = useSafetyInfoItems({
    category: SAFETY_INFO_CATEGORY.LIFE,
    typeConfigList: LIFE_TYPE_LIST,
    onMessage: showToast,
  });

  // 조회 실패 시 토스트 안내 (목록은 그리지 않음)
  useEffect(() => {
    if (!error) return;
    showToast(getErrorMessage(error));
  }, [error, showToast]);

  // 현재 편집 중인 유형 설정 (헤더 제목, 입력 필드 구성에 사용)
  const editingType = LIFE_TYPE_LIST.find(
    (type) => type.key === editTarget?.typeKey,
  );

  // 수정 중인 항목 (최신 조회 결과 기준)
  // - id로 찾고, 1개만 등록하는 유형(집 주소·출입 방법)은 새 항목으로 들어왔어도 이미 등록된 항목이 있으면 그 항목
  //   (다른 곳에서 먼저 등록해 409가 난 뒤 다시 불러오면 [수정]으로 바뀜)
  // - 다른 곳에서 삭제되어 없어지면 undefined → 새 항목으로 저장
  const typeItems = lifeInfo?.[editTarget?.typeKey] ?? [];
  const editingItem =
    editTarget?.itemId != null
      ? typeItems.find((item) => item.id === editTarget.itemId)
      : editingType && !editingType.isMultiple
        ? typeItems[0]
        : undefined;

  // 새 항목을 등록하는 상태인지 (저장된 값이 없는 상태)
  const isAddMode = Boolean(editingType) && !editingItem;

  // '추가하기' / '수정하기' 클릭 → 편집 화면으로 전환 (item이 없으면 새 항목)
  const handleEditOpen = (type, item = null) => {
    setDraft(getInitialDraft(type, item));
    setEditTarget({ typeKey: type.key, itemId: item?.id ?? null });
  };

  // 편집 화면 닫기 (X 버튼 / 저장·삭제 성공) → 입력값 버리고 목록 화면으로
  const handleEditClose = () => {
    setEditTarget(null);
    setDraft({});
  };

  // 입력 필드 값 변경
  const handleDraftChange = (fieldKey, value) => {
    setDraft((prev) => ({ ...prev, [fieldKey]: value }));
  };

  // [수정]/[추가] 버튼 클릭 → 필수값 검증 후 저장, 성공하면 목록 화면으로 (실패 시 토스트, 편집 화면 유지)
  const handleSaveClick = () => {
    if (isSaving) return;

    const errorMessage = getRequiredErrorMessage(editingType, draft);
    if (errorMessage) {
      showToast(errorMessage);
      return;
    }

    saveItem(
      { config: editingType, item: editingItem, draft: trimDraft(draft) },
      { onSuccess: handleEditClose },
    );
  };

  // [삭제] 버튼 클릭
  // - 새 항목을 등록하는 중이면 지울 값이 없으므로 모달 없이 바로 닫기
  // - 기존 항목 수정 중이면 삭제 확인 모달 열기
  const handleDeleteClick = () => {
    if (isAddMode) {
      handleEditClose();
      return;
    }
    setDeleteModalOpen(true);
  };

  // 모달의 [삭제] 클릭 → 삭제 요청, 성공하면 목록 화면으로 (성공·실패 모두 모달 닫기)
  // (집 정보는 삭제하면 빈 카드로 돌아감)
  const handleDeleteConfirm = () => {
    if (isSaving) return;

    deleteItem(editingItem, {
      onSuccess: handleEditClose,
      onSettled: () => setDeleteModalOpen(false),
    });
  };

  // 유형 하나의 목록 카드들
  // - 1개만 등록하는 유형(isMultiple: false)이 비어 있으면 빈 카드 1개 ('수정하기' 시 새 항목 등록)
  const renderTypeItems = (type) => {
    const items = lifeInfo?.[type.key] ?? [];

    if (!type.isMultiple && items.length === 0) {
      return (
        <BasicInfoItem
          key={`${type.key}-empty`}
          title={type.title}
          isSensitive={type.isSensitive}
          description={BASIC_INFO_EMPTY_TEXT}
          onEditClick={() => handleEditOpen(type)}
        />
      );
    }

    return items.map((item) => (
      <BasicInfoItem
        key={item.id}
        title={type.titleKey ? item[type.titleKey] : type.title}
        isSensitive={type.isSensitive}
        description={item[type.descriptionKey] ?? ""}
        isSingleLine={type.isSingleLine}
        updatedDateText={formatShortDate(item.updatedAt)}
        onEditClick={() => handleEditOpen(type, item)}
      />
    ));
  };

  return (
    <div className={styles.page}>
      {editingType ? (
        // ---------------- 편집 화면 ----------------
        <>
          <SubpageHeader
            title={editingType.title}
            hasBackButton={false}
            hasCloseButton={true}
            onCloseClick={handleEditClose}
          />

          <main className={styles.editContent}>
            {editingType.fields.map((field) => (
              <CardTextField
                key={field.key}
                id={`${editingType.key}-${field.key}`}
                label={field.label}
                placeholder={field.placeholder}
                value={draft[field.key] ?? ""}
                onChange={(value) => handleDraftChange(field.key, value)}
                maxLength={field.maxLength}
              />
            ))}
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
          <SubpageHeader title={LIFE_INFO_PAGE_TITLE} />

          <main className={styles.listContent}>
            {/* TODO: 로딩·에러 화면 디자인이 정해지면 추가 (지금은 헤더만 표시, C-03·C-06과 동일) */}
            {!isPending &&
              !error &&
              LIFE_SECTION_LIST.map((section) => {
                // 여러 개 등록 가능한 유형이 있으면 섹션 아래 '추가하기' 표시 (반려동물)
                const addableType = section.types.find((type) => type.isMultiple);

                return (
                  <HealthInfoSection
                    key={section.key}
                    title={section.title}
                    hasAddButton={Boolean(addableType)}
                    onAddClick={() => handleEditOpen(addableType)}
                  >
                    {section.types.flatMap((type) => renderTypeItems(type))}
                  </HealthInfoSection>
                );
              })}
          </main>
        </>
      )}

      {/* 토스트 (Toast는 absolute 배치라 하단 푸터와 겹치지 않도록 감싸서 위치 조정)
          - 문장이 여러 개면 문장마다 줄바꿈 (toastArea의 white-space: pre-line으로 표시) */}
      <div className={styles.toastArea}>
        <Toast />
      </div>
    </div>
  );
}

export default CardLife;