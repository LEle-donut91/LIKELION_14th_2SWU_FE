import { MS_PER_MINUTE } from "@/features/request/constants/timeConstants";
import { formatMonthDay, formatShortDateTime } from "@/shared/utils/dateFormat";
import { toMinutes } from "@/features/request/utils/dueDateUtils";
import {
  getCategoryDescription,
  getSafetyCardInfoTitle,
  getSafetyCardInfoValue,
  getInformationSelectionFlags,
} from "@/features/request/utils/getSafetyCardInfo";

/**
 * 서버가 보낸 항목 하나를 체크박스가 사용할 모양으로 바꾼다.
 * 예: { informationId: 12, typeName: "복용약", selected: true, ... }
 *  → { id: 12, label: "복용약", isDefault: true, ... }
 * 서버 데이터 자체를 수정하지 않고 새로운 객체를 만든다.
 */
const toInformationItem = (item) => {
  // 수정된 항목에만 ", 9/20 갱신" 같은 글자를 붙인다.
  // updatedAt이 있어도 updated가 false라면 아무 글자도 붙이지 않는다.
  const updatedText =
    item.updated && item.updatedAt
      ? `, ${formatMonthDay(item.updatedAt)} 갱신`
      : "";
  return {
    id: item.informationId, // 선택·전송에 쓰는 고유 번호.
    label: item.typeName, // 분류 카드의 선택 요약에 쓰는 유형 이름. 예: "복용약"
    title: getSafetyCardInfoTitle(item), // 체크박스 옆 제목. 항목 유형에 맞춰 title과 typeName을 조합
    description: `${getSafetyCardInfoValue(item.informationValue)}${updatedText}`, // 내용+갱신 문구
    isSensitive: item.sensitive, // 민감정보인지
    isDefault: item.selected, // 서버가 정한 최초 선택 여부. 현재 사용자가 체크했는지와는 별개
  };
};

// 분류 상자 하나를 화면용으로 바꾼다. 예: HEALTH 상자 안에 복용약·알러지 항목.
const toCategory = (category) => ({
  key: category.category,
  title: category.categoryName,
  description: getCategoryDescription(category.items),
  items: category.items.map(toInformationItem),
});

/**
 * 화면에 필요한 데이터를 한 묶음으로 준비. API 호출이나 스토어 저장은 하지 않는다.
 * raw: 서버 응답 전체 { status, code, message, data: { categories: [...] } }
 * requestForm: 사용자가 작성 중인 폼. 선택 ID와 접근 기한 등을 가지고 있다.
 * 반환값: 분류 목록 + 기본/민감/현재 선택 ID + 확인용 boolean + 표시용 접근 기한.
 */
export const getInformationOptionsService = (raw, requestForm) => {
  // 1. category들을 화면용으로 변환
  const categories = (raw?.data?.categories ?? []).map(toCategory);

  // 2. 항목을 한 줄로 모은다. 분류 목록 자체는 그대로 유지
  // 예: [기본 정보의 [1, 2], 건강 정보의 [12, 14]] → [1, 2, 12, 14]
  const items = categories.flatMap((category) => category.items);
  const informationOptions = {
    categories,

    // 3. filter는 조건에 맞는 항목만 남기고, map은 그 항목의 번호만 꺼낸다.
    // selected=true인 12번·14번이 있다면 defaultIds는 [12, 14].
    defaultIds: items.filter((item) => item.isDefault).map((item) => item.id),

    // 민감정보 항목 번호도 따로 모은다. 선택 여부에 관계없이 전체 목록에서 찾는다.
    sensitiveIds: items
      .filter((item) => item.isSensitive)
      .map((item) => item.id),
  };
  // 4. 현재 선택은 서버 기본값이 아니라 폼에서 가져온다.
  // 기본값 [12, 14]에서 사용자가 12번을 해제했다면 selectedIds는 [14].
  // []는 "아무것도 선택하지 않음"이므로 기본값으로 바꾸면 안 된다.
  const selectedIds = requestForm.informationIds;

  return {
    ...informationOptions, // ...은 객체 안의 속성들을 여기로 펼쳐 넣는다.
    selectedIds,
    // 5. 현재 선택에 민감정보가 있는지(isSensitiveIncluded),
    // 서버 기본 선택과 같은지(isDefaultChecked)를 true/false로 구한다.
    // 응답이 아직 없으면 "기본값이 선택됨"으로 잘못 판단하지 않도록 undefined를 넘긴다.
    ...getInformationSelectionFlags(
      raw ? informationOptions : undefined,
      selectedIds,
    ),

    // 6. 접근 기한
    // toMinutes: 분으로 변환 → MS_PER_MINUTE를 곱해 밀리초로 변환
    // → 현재 시각에 더함 → Date 객체 생성 → 화면에 보여 줄 날짜 문자열로 변환.
    // 이 값은 서버 응답에 들어 있는 값이 아니라 프론트에서 계산하는 표시용 값이다.
    dueDate: formatShortDateTime(
      new Date(Date.now() + toMinutes(requestForm.dueDate) * MS_PER_MINUTE),
    ),
  };
};
