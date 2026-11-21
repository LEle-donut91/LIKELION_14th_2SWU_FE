import { REQUEST_DISPLAY_STATUS } from "@/features/situation/constants/situationConstants";
import { getParticipantCandidatesService } from "@/features/situation/services/situationCreateService";

// H-03-05 상황 관리: API 응답 → 화면 데이터 변환 (부수효과 없는 순수 함수)

// 관계 종류별 안내 문구 (참여자 추가 시트)
const RELATION_TEXT = {
  GUARDIAN: "서로의 보호자",
  MY_PERSON: "나의 사람",
};

// 1. 활성 관계 목록 → 참여자 추가 시트 지인 목록 (InviteParticipantOption)
// - id: 참여자 추가 API에 보낼 사용자 ID(userId)
// - 이미 참여 중인 사람은 화면에서 joinedIdList로 회색 처리 (명세: 후보 필터링은 FE)
// → { people: [{ id, name, relationText, isGuardian }] }
export const getInviteCandidatesService = (raw) => ({
  people: getParticipantCandidatesService(raw).people.map(
    ({ id, name, isGuardian }) => ({
      id,
      name,
      relationText: isGuardian ? RELATION_TEXT.GUARDIAN : RELATION_TEXT.MY_PERSON,
      isGuardian,
    }),
  ),
});

// 2. 상황 상세의 '수락한 요청' 중 나가면 영향을 받는 요청 (N-09 상황 나가기 시트)
// - 수락됨(시작 전) · 진행 중인 요청만
// → [{ id, helpType, startDateTime, status }]
export const getLeaveAffectedRequests = (assignedRequests = []) =>
  assignedRequests.filter(({ status }) =>
    [REQUEST_DISPLAY_STATUS.ACCEPTED, REQUEST_DISPLAY_STATUS.IN_PROGRESS].includes(
      status,
    ),
  );
