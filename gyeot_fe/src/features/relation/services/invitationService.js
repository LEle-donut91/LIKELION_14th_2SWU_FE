// 초대 링크 정보 응답 → 화면에서 쓰기 좋은 모양으로 변환 (useInvitationQuery의 select에서 사용)

// 초대 유형
export const INVITATION_TYPE = {
  MY_PERSON: "MY_PERSON", // 나의 사람 초대 (R-03)
  GUARDIAN: "GUARDIAN", // 보호자 요청 (N-03)
};

/**
 * 초대 링크 정보
 * → { type, inviterId, inviterName, message, status, expiresAt }
 *   status: PENDING / ACCEPTED / REJECTED / EXPIRED / CANCELED
 */
export const getInvitationService = (response) => {
  const data = response.data;

  return {
    type: data.invitationType,
    inviterId: data.inviter?.userId,
    inviterName: data.inviter?.name ?? "",
    message: data.message, // 보호자 요청 편지 (나의 사람 초대는 null)
    status: data.status,
    expiresAt: data.expiresAt,
  };
};
