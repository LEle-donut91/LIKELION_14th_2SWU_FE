import { WITHDRAWN_USER_NAME } from "@/features/situation/constants/situationConstants";

// N-04 지난 상황 상세: API 응답 → 화면 데이터 변환 (부수효과 없는 순수 함수)
// - raw: API 함수가 반환한 공통 응답 전체 { status, code, message, data }

// 요청 기록 1개 → PastRequestHistoryList 데이터
// - assigneeName: 탈퇴한 담당자는 '탈퇴한 사용자', 미배정이면 null(이름 숨김)
// - endDateTime: 요청 종료 시각 (명세에 아직 없는 값이라 없으면 null → 시작 시각만 표시)
const toPastRequest = (item) => ({
  id: item.requestId,
  helpType: item.helpType,
  assigneeName: item.assigneeWithdrawn
    ? WITHDRAWN_USER_NAME
    : item.assigneeName ?? null,
  startDateTime: item.startsAt,
  endDateTime: item.endsAt ?? null,
  status: item.status,
});

// 1. 지난 상황 상세 조회 → N-04 화면 데이터
// → { id, title, startDate, endDate, isOwner, participantCount, ownerName, requests, canWriteThanks }
// - ownerName: 응답에 아직 없는 값이라 없으면 null (참여자 카드에서 'OO님의 상황' 숨김)
// - canWriteThanks: 완료된 요청이 있으면 감사 메시지 쓰기 표시 (F-21, UI만 구현)
export const getPastSituationDetailService = (raw) => {
  const situation = raw?.data?.situation ?? {};
  const requests = raw?.data?.requests ?? [];

  return {
    id: situation.situationId,
    title: situation.name ?? "",
    startDate: situation.startAt,
    endDate: situation.endAt,
    isOwner: situation.isOwner ?? false,
    participantCount: situation.participantCount ?? null,
    ownerName: situation.ownerName ?? null,
    requests: requests.map(toPastRequest),
    canWriteThanks: requests.some(({ status }) => status === "COMPLETED"),
  };
};
