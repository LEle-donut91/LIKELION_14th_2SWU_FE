import { axiosInstance } from "@/shared/api/axiosInstance";
import { AUTH_API_URLS } from "@/shared/constants/apiUrlConstants";

// 초대 API (API 명세서 F-01 나의 사람 초대 / F-26 서로의 보호자)
// - 나의 사람 초대와 보호자 요청은 같은 /api/invitations를 쓰고 invitationType으로 구분
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)
// - A 영역은 명세 확정 + 서버 배포 완료라 목업 없이 실제 서버로 요청

// 1. 초대 링크 생성 (POST /api/invitations)
// - invitationType: "MY_PERSON" 나의 사람 / "GUARDIAN" 보호자
// - personalLabel: 나의 사람 초대에서만 (선택, 1~50자)
// - message: 보호자 요청에서만 (선택 편지)
// - promiseConfirmed: 보호자 요청에서만 (필수, true만 허용)
// - 값이 없는 칸은 보내지 않음 (유형에 맞지 않는 칸을 보내면 400 INVALID_INPUT)
// → data: { invitationId, invitationUrl, expiresAt }
export const postInvitationApi = async ({ invitationType, personalLabel, message, promiseConfirmed }) => {
  const body = { invitationType };
  if (personalLabel) body.personalLabel = personalLabel;
  if (message) body.message = message;
  if (promiseConfirmed) body.promiseConfirmed = promiseConfirmed;

  const response = await axiosInstance.post(AUTH_API_URLS.invitations, body);
  return response.data;
};

// 2. 초대 링크 정보 조회 (GET /api/invitations/{token}) — 로그인 없이 조회 가능
// → data: { invitationType, inviter: { userId, name }, message, status, expiresAt }
export const getInvitationApi = async (token) => {
  const response = await axiosInstance.get(AUTH_API_URLS.invitation(token));
  return response.data;
};

// 3. 초대 수락 (POST /api/invitations/{token}/accept)
export const postAcceptInvitationApi = async (token) => {
  const response = await axiosInstance.post(AUTH_API_URLS.invitationAccept(token));
  return response.data;
};

// 4. 초대 거절 (POST /api/invitations/{token}/reject)
export const postRejectInvitationApi = async (token) => {
  const response = await axiosInstance.post(AUTH_API_URLS.invitationReject(token));
  return response.data;
};

// 5. 반대 방향 나의 사람 추가 (POST /api/invitations/{token}/reciprocal) — N-01
// - 초대를 수락한 사람만 호출 가능
// → data: null
export const postReciprocalApi = async (token) => {
  const response = await axiosInstance.post(AUTH_API_URLS.invitationReciprocal(token));
  return response.data;
};

// 6. 발신 초대 취소 (DELETE /api/invitations/{invitationId}) — R-01
// - 상대가 수락하기 전에만 취소 가능
export const deleteInvitationApi = async (invitationId) => {
  const response = await axiosInstance.delete(AUTH_API_URLS.invitationCancel(invitationId));
  return response.data;
};
