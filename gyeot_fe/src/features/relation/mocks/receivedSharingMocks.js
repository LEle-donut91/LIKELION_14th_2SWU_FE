// 받은 정보 조회 테스트 데이터 (R-02-01) — 명세 예시 응답 그대로
// - 빈 상태를 보고 싶으면 items를 []로 바꿔서 확인
export const MOCK_RECEIVED_SHARINGS = {
  items: [
    {
      requestId: 45,
      helpType: "HOSPITAL",
      startsAt: "2026-10-08T10:00:00",
      accessUntil: "2026-10-08T20:00:00",
      sharedItems: [{ informationType: "ALLERGY", typeName: "알러지", title: "페니실린" }],
    },
  ],
};
