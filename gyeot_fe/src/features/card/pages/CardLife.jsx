/**
 * =====================================================================
 * [C-04] 안심카드 - 생활 정보
 *  - 페이지 컴포넌트
 *  - 목록 화면 ↔ 편집 화면(집 주소/출입 방법/반려동물)을 라우트 분리 없이 상태(editTarget)로 전환
 *  - 섹션·카드·입력 필드는 LIFE_SECTION_LIST 설정으로 그림
 *  - 편집 로직은 C-02(CardHealth)에서 복사 (공통화는 별도 이슈에서 진행)
 * =====================================================================
 */

// CSS 스타일
import styles from "@/features/card/pages/CardLife.module.css";

// 일반 라이브러리
import { useState } from "react";

// Custom Hooks
import { useToast } from "@/shared/hooks/useToast";

// Constants
import {
  LIFE_INFO_PAGE_TITLE,
  LIFE_SECTION_LIST,
  BASIC_INFO_EMPTY_TEXT,
  BASIC_INFO_FOOTER_TEXT,
  BASIC_INFO_DELETE_MODAL,
} from "@/features/card/constants/cardConstants";

// Utils
import {
  formatShortDate,
  getTodayDateString,
} from "@/features/card/utils/cardFormat";

// Mocks
// TODO: API 연동 시 조회 결과로 교체 (GET /api/safety-information?category=LIFE)
import { CARD_LIFE_MOCK } from "@/features/card/mocks/cardMockData";

// 일반 Components
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader";
import SmallFooter from "@/shared/components/SmallFooter/SmallFooter";
import DefaultModal from "@/shared/components/DefaultModal/DefaultModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import BasicInfoItem from "@/features/card/components/BasicInfoItem";
import HealthInfoSection from "@/features/card/components/HealthInfoSection";
import CardTextField from "@/features/card/components/CardTextField";

// 모든 섹션의 항목 유형을 한 배열로 (편집 중인 유형 찾기용)
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

// 새 항목 id (API 연동 전 화면 안에서만 쓰는 임시 id)
// TODO: API 연동 시 서버에서 받은 id(informationId)로 교체
const createLifeItemId = (typeKey) => `${typeKey}-${Date.now()}`;

// 페이지 컴포넌트
function CardLife() {
  // 생활 정보 데이터 (API 연동 전까지 mock으로 화면 안에서만 관리)
  // - { address: [항목], entranceMethod: [항목], pet: [항목...] }
  const [lifeInfo, setLifeInfo] = useState(CARD_LIFE_MOCK);

  // 편집 대상 (null이면 목록 화면)
  // - typeKey: 편집 중인 항목 유형 (LIFE_TYPE_KEY 값)
  // - itemId: 수정 중인 항목 id / null이면 새 항목 (반려동물 '추가하기', 비어 있는 집 정보 '수정하기')
  const [editTarget, setEditTarget] = useState(null);

  // 편집 화면 입력값 (필드 키별 문자열)
  const [draft, setDraft] = useState({});

  // 삭제 확인 모달의 열림/닫힘 상태
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  // 현재 편집 중인 유형 설정 (헤더 제목, 입력 필드 구성에 사용)
  const editingType = LIFE_TYPE_LIST.find(
    (type) => type.key === editTarget?.typeKey,
  );

  // 새 항목을 등록하는 상태인지 (저장된 값이 없는 상태)
  // TODO: API 연동 시 true면 작성(POST), false면 수정(PATCH)
  const isAddMode = editTarget !== null && editTarget.itemId === null;

  // 항목 추가/수정 + 갱신일을 오늘로 변경
  // TODO: API 연동 시 작성/수정 요청 후 '분류별 항목 조회'를 다시 불러와 갱신
  const saveLifeItem = (typeKey, itemId, values) => {
    const updatedDate = getTodayDateString();

    if (itemId === null) {
      const newItem = {
        id: createLifeItemId(typeKey),
        ...values,
        updatedDate,
      };
      setLifeInfo((prev) => ({
        ...prev,
        [typeKey]: [...(prev[typeKey] ?? []), newItem],
      }));
      return;
    }

    setLifeInfo((prev) => ({
      ...prev,
      [typeKey]: (prev[typeKey] ?? []).map((item) =>
        item.id === itemId ? { ...item, ...values, updatedDate } : item,
      ),
    }));
  };

  // 항목 삭제 (집 정보는 삭제하면 빈 카드로 돌아감)
  // TODO: API 연동 시 삭제 요청 후 '분류별 항목 조회'를 다시 불러와 갱신
  const removeLifeItem = (typeKey, itemId) => {
    setLifeInfo((prev) => ({
      ...prev,
      [typeKey]: (prev[typeKey] ?? []).filter((item) => item.id !== itemId),
    }));
  };

  // '추가하기' / '수정하기' 클릭 → 편집 화면으로 전환 (item이 없으면 새 항목)
  const handleEditOpen = (type, item = null) => {
    setDraft(getInitialDraft(type, item));
    setEditTarget({ typeKey: type.key, itemId: item?.id ?? null });
  };

  // 편집 화면 닫기 (X 버튼) → 입력값 버리고 목록 화면으로
  const handleEditClose = () => {
    setEditTarget(null);
    setDraft({});
  };

  // 입력 필드 값 변경
  const handleDraftChange = (fieldKey, value) => {
    setDraft((prev) => ({ ...prev, [fieldKey]: value }));
  };

  // [수정]/[추가] 버튼 클릭 → 필수값 검증 후 저장하고 목록 화면으로 (실패 시 토스트)
  const handleSaveClick = () => {
    const errorMessage = getRequiredErrorMessage(editingType, draft);
    if (errorMessage) {
      showToast(errorMessage);
      return;
    }

    saveLifeItem(editTarget.typeKey, editTarget.itemId, trimDraft(draft));
    handleEditClose();
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

  // 모달의 [삭제] 클릭 → 항목 삭제 후 목록 화면으로
  const handleDeleteConfirm = () => {
    removeLifeItem(editTarget.typeKey, editTarget.itemId);
    setDeleteModalOpen(false);
    handleEditClose();
  };

  // 유형 하나의 목록 카드들
  // - 1개만 등록하는 유형(isMultiple: false)이 비어 있으면 빈 카드 1개 ('수정하기' 시 새 항목 등록)
  const renderTypeItems = (type) => {
    const items = lifeInfo[type.key] ?? [];

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
        updatedDateText={formatShortDate(item.updatedDate)}
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
            {LIFE_SECTION_LIST.map((section) => {
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

export default CardLife;
