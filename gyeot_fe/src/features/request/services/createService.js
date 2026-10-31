/**
 * =====================================================================
 * [H-03-02] 요청 작성
 * - post/get/patch/delete + 요청 내용 + Api
 * - 조회 후 데이터 가공
 * - 폼 제출 전 데이터 가공
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 데이터 조회 후 가공
export const getReqFormService = (raw) => {
  if (!raw) return { situation: [], user: [] };

  return {
    // 상황 목록 매핑
    situation:
      raw.situation?.map((item) => ({
        id: item.id,
        title: item.title,
        startDate: item.startDate,
        endDate: item.endDate,
        joinCount: Number(item.joinCount),
      })) || [],

    // 사용자 목록 매핑
    user:
      raw.user?.map((user) => ({
        id: user.id,
        userName: user.userName,
        isGuardian: user.isGuardian,
      })) || [],
  };
};

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 폼 제출 전 데이터 가공
export const postReqFormService = (raw) => ({
  situationId: raw.situationId,
  targetUserId: raw.userId,
  helpType: raw.helpType,
  startAt: raw.startDateTime,
  endAt: raw.endDateTime,
  location: raw.location,
  content: raw.content,
  responseDue: raw.dueDate,
});

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 폼 제출 후 데이터 가공
export const postReqFormIdService = (raw) => ({
  reqId: raw.requestId,
  msg: raw.message,
});
