// 공유 상태 (R-02-01)
export const SHARE_STATUS = {
  SHARING: "SHARING", // 공유 중
  WITHDRAWN: "WITHDRAWN", // 철회됨
};

// 공유 중인 정보 임시 데이터 (R-02-01) — TODO: API 연결 후 교체
// received를 []로 바꾸면 '받은 정보 없음' 화면 확인 가능
export const MOCK_SHARED_INFO = {
  // 내가 이 사람에게 공유 중인 정보
  sharing: [
    {
      id: 1,
      title: "병원 동행",
      startAt: "10/2 14:00",
      endAt: "10/2 18:00",
      items: ["복용약", "알레르기"],
      status: SHARE_STATUS.SHARING,
    },
    {
      id: 2,
      title: "반려동물 돌봄",
      startAt: "10/5",
      endAt: "10/6 12:00",
      items: ["주소", "출입 방법", "반려동물"],
      status: SHARE_STATUS.SHARING,
    },
  ],
  // 이 사람에게서 받은 정보 (조회만 가능)
  received: [
    {
      id: 11,
      title: "병원 동행",
      startAt: "10/8",
      endAt: "10/8 20:00",
      items: ["병원"],
    },
  ],
};