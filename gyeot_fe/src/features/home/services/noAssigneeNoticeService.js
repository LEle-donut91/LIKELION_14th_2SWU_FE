import { formatShortDateTime } from "@/shared/utils/dateFormat";
import {
  HOME_HELP_TYPE_LABELS,
  NO_ASSIGNEE_FALLBACK_NAME,
  NO_ASSIGNEE_MODAL_CONFIG,
} from "@/features/home/constants/homeConstants";

// 담당자 없음 안내 API 응답 → M-01 모달용 데이터 변환 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }
// - 모달 컴포넌트(RequestModal)는 이 파일이 만든 값만 사용한다.
// - 닫기 API는 data가 null이라 service를 두지 않는다.

// 안내 1개 → RequestModal의 modalItem
// - state: 담당자 없음 사유 (서버 reason 그대로. 닫기 API에도 이 값을 그대로 보냄)
// - time: "9/30 20:00". 급한 요청은 startsAt이 null → null (모달에서 시간·점을 숨김)
// - userName: 서버 이름 그대로 (탈퇴 시 "탈퇴한 사용자"). null이면 같은 문구로 대체
const toModalItem = (item) => ({
  id: item.requestId,
  request: HOME_HELP_TYPE_LABELS[item.helpType] ?? "",
  state: item.reason,
  time: item.startsAt ? formatShortDateTime(item.startsAt) : null,
  location: item.place ?? "",
  userName: item.target?.name ?? NO_ASSIGNEE_FALLBACK_NAME,
});

// 1. 담당자 없음 안내 목록 → 모달 대기열 (서버 순서 그대로: 급한 요청 먼저, 시작 빠른 순)
// - 화면에 그릴 수 없는 사유(NO_ASSIGNEE_MODAL_CONFIG에 없음)는 제외
// - 빈 배열이면 모달을 띄우지 않음
export const getNoAssigneeNoticesService = (raw) =>
  (raw?.data?.items ?? [])
    .filter((item) => item.reason in NO_ASSIGNEE_MODAL_CONFIG)
    .map(toModalItem);
