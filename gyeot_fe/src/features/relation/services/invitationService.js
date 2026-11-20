// 초대 링크 정보 응답 → 화면에서 쓰기 좋은 모양으로 변환 (useInvitationQuery의 select에서 사용)

// 초대 유형
export const INVITATION_TYPE = {
  MY_PERSON: "MY_PERSON", // 나의 사람 초대 (R-03)
  GUARDIAN: "GUARDIAN", // 보호자 요청 (N-03)
};

// 수락할 수 없는 이유
export const UNAVAILABLE_REASON = {
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED", // 로그인 필요
  SELF_INVITATION: "SELF_INVITATION", // 내가 보낸 초대
  GUARDIAN_LIMIT_REACHED: "GUARDIAN_LIMIT_REACHED", // 내 보호자가 이미 3명
};

/**
 * 초대 링크 정보
 * → { type, inviterId, inviterName, defaultMessage, message, status, expiresAt, canAccept, unavailableReason }
 *   status: PENDING / ACCEPTED / REJECTED / EXPIRED / CANCELED
 *   unavailableReason: AUTHENTICATION_REQUIRED / SELF_INVITATION / GUARDIAN_LIMIT_REACHED (수락 가능하면 null)
 */
export const getInvitationService = (response) => {
  const data = response.data;

  return {
    type: data.invitationType,
    inviterId: data.inviter?.userId,
    inviterName: data.inviter?.name ?? "",
    defaultMessage: data.defaultMessage, // 화면에 표시할 기본 멘트
    message: data.message, // 보호자 요청 편지 (미작성·나의 사람 초대는 null)
    status: data.status,
    expiresAt: data.expiresAt,
    canAccept: data.canAccept, // 지금 로그인한 사람이 수락할 수 있는지
    unavailableReason: data.unavailableReason, // 수락할 수 없는 이유
  };
};
