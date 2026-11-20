import { SITUATION_TYPE } from "@/features/situation/constants/situationConstants";
import { toApiDateTime } from "@/features/situation/utils/situationDateTime";

// H-01 상황 만들기: API 응답 ↔ 화면 데이터 변환 (부수효과 없는 순수 함수)

const RELATIONSHIP_TYPE = {
  GUARDIAN: "GUARDIAN", // 서로의 보호자
  MY_PERSON: "MY_PERSON", // 내가 등록한 나의 사람
};

// 1. 활성 관계 목록 → '참여할 지인' 체크 목록 (ParticipantCheckList)
// - id: 상황 생성 participantIds에 보낼 사용자 ID(userId)
// - 보호자는 연락 순서대로 먼저, 그 다음 나의 사람
// → { people: [{ id, name, relation, isGuardian }] }
export const getParticipantCandidatesService = (raw) => {
  const items = raw?.data?.items ?? [];

  const toPerson = (item) => ({
    id: item.userId,
    name: item.name ?? "",
    relation: item.personalLabel ?? "", // 나만 보는 관계 형태 (없으면 표시 안 함)
    isGuardian: item.relationshipType === RELATIONSHIP_TYPE.GUARDIAN,
  });

  const guardians = items
    .filter((item) => item.relationshipType === RELATIONSHIP_TYPE.GUARDIAN)
    .sort((a, b) => (a.guardianPriority ?? 0) - (b.guardianPriority ?? 0))
    .map(toPerson);
  const myPeople = items
    .filter((item) => item.relationshipType === RELATIONSHIP_TYPE.MY_PERSON)
    .map(toPerson);

  return { people: [...guardians, ...myPeople] };
};

// 2. 화면 입력값 → 상황 생성 요청 body
// - form: { situationType: { type, etcText }, name, startDateTime, endDateTime, participantIds }
// - '기타'가 아니면 customSituationType은 보내지 않음(null)
export const toCreateSituationBody = (form) => {
  const isOther = form.situationType?.type === SITUATION_TYPE.OTHER;

  return {
    situationType: form.situationType?.type,
    customSituationType: isOther ? form.situationType.etcText.trim() : null,
    name: form.name.trim(),
    participantIds: form.participantIds,
    startAt: toApiDateTime(form.startDateTime),
    endAt: toApiDateTime(form.endDateTime),
  };
};
