import { formatLocalDateTime, toDateFromInput } from "@/features/request/utils/dateTimeFormat";
import { toUniqueNumberIds } from "@/features/request/utils/getSafetyCardInfo";

// form: 현재 입력값, before: 수정 전 비교 기준값.
// 바뀐 필드만 API 요청 형태로 반환한다. 아무것도 바꾸지 않았으면 {}를 반환한다.
// 이 결과를 유효성 검사와 실제 PATCH 요청에서 함께 사용한다.
export const getEditChanges = (form, before) => {
  const payload = {};
  // 시작 일시 입력 객체를 Date로 바꿔 실제 시각을 비교한다.
  const start = toDateFromInput(form.startDateTime);
  const originalStart = toDateFromInput(before.startDateTime);
  if (start && start.getTime() !== originalStart?.getTime()) {
    // 변경된 시작 일시만 API가 받는 날짜 문자열로 담는다.
    payload.startsAt = formatLocalDateTime(start);
  }

  // 종료 일시도 기준 시각과 달라졌을 때만 포함한다.
  const end = toDateFromInput(form.endDateTime);
  const originalEnd = toDateFromInput(before.endDateTime);
  if (end && end.getTime() !== originalEnd?.getTime()) {
    payload.endsAt = formatLocalDateTime(end);
  }
  // 장소도 기준값과 달라졌을 때만 포함한다.
  if (form.location !== before.location) payload.place = form.location;
  // ID를 숫자로 통일하고 중복을 제거한다. 비교 기준은 Set으로 만들어 포함 여부를 확인한다.
  const ids = toUniqueNumberIds(form.informationIds);
  const originalIds = new Set(toUniqueNumberIds(before.informationIds));
  // 개수가 다르거나 기존에 없던 ID가 있으면 선택이 변경된 것이다. 순서 차이는 무시한다.
  if (ids.length !== originalIds.size || ids.some((id) => !originalIds.has(id))) {
    // 변경된 경우 현재 선택 전체를 보낸다. 모두 해제했다면 []가 들어간다.
    payload.informationIds = ids;
  }
  return payload;
};
