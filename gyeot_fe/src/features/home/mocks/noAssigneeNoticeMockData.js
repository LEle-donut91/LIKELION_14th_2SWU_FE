// 담당자 없음 안내(M-01) 테스트용 데이터 (담당자 없음 안내 목록 응답의 data.items와 같은 형태)
// - noAssigneeNoticeApi.js의 USE_MOCK 분기에서 공통 응답으로 감싸 사용한다.
// - 명세 확정(F-14) 기준. target.name은 11/17 변경 반영(이름 문자열, 탈퇴 시 "탈퇴한 사용자")
// - target.profileImageUrl은 명세 예시 JSON에 없고 내려오는지 미확정이라 넣지 않음
// - 날짜 형식은 "YYYY-MM-DDTHH:mm:ss" 로컬 시각 (API 공통 규칙 7)

/**
 * =====================================================================
 * 안내 항목
 * =====================================================================
 */

// 디자인 시안과 같은 기본 3건 (사유: 어려움 / 기한 초과 / 관계 해제)
const DEFAULT_NOTICE_LIST = [
  {
    requestId: 21,
    requestType: "GENERAL",
    helpType: "HOSPITAL",
    startsAt: "2026-09-30T20:00:00",
    place: "슈슈병원",
    target: { userId: 7, name: "민재" },
    reason: "UNAVAILABLE",
  },
  {
    requestId: 22,
    requestType: "GENERAL",
    helpType: "HOSPITAL",
    startsAt: "2026-10-01T14:00:00",
    place: "슈슈병원",
    target: { userId: 7, name: "민재" },
    reason: "DEADLINE_PASSED",
  },
  {
    requestId: 23,
    requestType: "GENERAL",
    helpType: "GROCERY",
    startsAt: "2026-10-02T18:00:00",
    place: "자택",
    target: { userId: 8, name: "하음" },
    reason: "RELATIONSHIP_ENDED",
  },
];

// 나머지 사유와 예외 확인용
const EXTRA_NOTICE_LIST = [
  // 급한 요청: startsAt이 null → 시간·점을 숨기고 장소만 표시 (서버는 급한 요청을 먼저 보냄)
  {
    requestId: 31,
    requestType: "URGENT",
    helpType: "MEAL",
    startsAt: null,
    place: "자택",
    target: { userId: 9, name: "서연" },
    reason: "ACCEPTANCE_WITHDRAWN",
  },
  {
    requestId: 32,
    requestType: "GENERAL",
    helpType: "PET_CARE",
    startsAt: "2026-10-03T10:00:00",
    place: "자택",
    target: { userId: 10, name: "지훈" },
    reason: "PARTICIPANT_LEFT",
  },
  // 탈퇴: 서버가 이름을 "탈퇴한 사용자"로 보냄 (11/17 변경)
  {
    requestId: 33,
    requestType: "GENERAL",
    helpType: "HOSPITAL",
    startsAt: "2026-10-04T09:30:00",
    place: "슈슈병원",
    target: { userId: 11, name: "탈퇴한 사용자" },
    reason: "USER_WITHDRAWN",
  },
  // 대비 확인용: 11/17 이후 name은 null로 오지 않지만 null이면 "탈퇴한 사용자"로 표시
  {
    requestId: 34,
    requestType: "GENERAL",
    helpType: "CHECK_IN",
    startsAt: "2026-10-05T19:00:00",
    place: "카페",
    target: { userId: 12, name: null },
    reason: "UNAVAILABLE",
  },
  // 대비 확인용: 명세에 없는 사유 → service에서 제외되어 모달에 나오지 않음
  {
    requestId: 35,
    requestType: "GENERAL",
    helpType: "OTHER",
    startsAt: "2026-10-06T19:00:00",
    place: "카페",
    target: { userId: 13, name: "나예" },
    reason: "UNKNOWN_REASON",
  },
];

/**
 * =====================================================================
 * 시나리오
 * =====================================================================
 */

// 테스트 시나리오를 지정하는 URL 쿼리 키 (홈 시나리오 ?mock=과 따로 사용)
// 예: /home?noticeMock=none, /home?noticeMock=all&noticeMockFail=true
export const NOTICE_MOCK_QUERY_KEY = "noticeMock";
export const NOTICE_MOCK_FAIL_QUERY_KEY = "noticeMockFail"; // true면 닫기 404 실패
export const DEFAULT_NOTICE_MOCK_SCENARIO = "multi";

// 시나리오 키 → 안내 목록 (응답의 data.items)
const NOTICE_MOCK_DATA = {
  none: [], // 안내 없음 → 모달 없음
  single: DEFAULT_NOTICE_LIST.slice(0, 1), // 1건 → 1/1
  multi: DEFAULT_NOTICE_LIST, // 여러 건 → 1/3 ~ 3/3
  all: [...EXTRA_NOTICE_LIST.slice(0, 1), ...DEFAULT_NOTICE_LIST, ...EXTRA_NOTICE_LIST.slice(1)], // 모든 사유·예외
};

/**
 * =====================================================================
 * 목업 저장소
 * - 닫기에 성공한 안내는 저장소에서 지워, 다시 조회하면 빠지도록 함 (명세: 닫은 사유는 다시 포함되지 않음)
 * - 새로고침하면 처음 상태로 돌아감
 * =====================================================================
 */

const noticeMockStore = {};

const getScenarioKey = (mockScenario) =>
  mockScenario in NOTICE_MOCK_DATA ? mockScenario : DEFAULT_NOTICE_MOCK_SCENARIO;

// 시나리오별 안내 목록 (처음 부를 때 테스트 데이터를 복사해 저장)
export const getNoAssigneeNoticeMockStore = (mockScenario) => {
  const scenarioKey = getScenarioKey(mockScenario);
  if (!noticeMockStore[scenarioKey]) {
    noticeMockStore[scenarioKey] = structuredClone(NOTICE_MOCK_DATA[scenarioKey]);
  }
  return noticeMockStore[scenarioKey];
};

// 닫은 안내를 저장소에서 제거 (요청 ID 기준)
export const removeNoAssigneeNoticeMockItem = (mockScenario, requestId) => {
  const scenarioKey = getScenarioKey(mockScenario);
  noticeMockStore[scenarioKey] = getNoAssigneeNoticeMockStore(scenarioKey).filter(
    (item) => item.requestId !== requestId,
  );
};
