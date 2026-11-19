// 초대 링크 진입 (/invitations/:token)
// - 화면은 없고, 초대 유형과 로그인 여부를 확인해서 알맞은 화면으로 보내기만 함
//   · 로그인 O + 나의 사람 초대 → R-03 받은 초대
//   · 로그인 O + 보호자 요청   → N-03 받은 보호자 요청
//   · 로그인 X                → A-01 시작 화면 (?invite=토큰, 로그인 후 다시 초대 화면으로)
//   · 없는 링크               → A-01 시작 화면

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInvitationQuery } from "@/features/relation/hooks/queries/useInvitationQuery";
import { INVITATION_TYPE } from "@/features/relation/services/invitationService";
import { getAccessToken } from "@/shared/api/accessToken";
import { refreshAccessToken } from "@/shared/api/axiosInstance";

// 로그인 상태인지 확인 (메모리에 토큰이 없으면 Refresh Token 쿠키로 재발급 시도)
const checkLoggedIn = async () => {
  if (getAccessToken()) return true;
  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false; // 쿠키 없음·만료 → 로그인 안 한 상태
  }
};

function InvitationEntry() {
  const navigate = useNavigate();
  const { token } = useParams(); // 주소의 초대 토큰
  const { data: invitation, isError } = useInvitationQuery(token); // 초대 유형 확인용

  useEffect(() => {
    // 사용할 수 없는 링크면 시작 화면으로
    if (isError) {
      navigate("/", { replace: true });
      return;
    }
    if (!invitation) return; // 아직 불러오는 중

    let ignore = false; // 화면을 벗어난 뒤 이동하지 않도록

    checkLoggedIn().then((isLoggedIn) => {
      if (ignore) return;

      // 로그인 안 했으면 시작 화면에서 가입·로그인 후 돌아오게
      if (!isLoggedIn) {
        navigate(`/?invite=${token}`, { replace: true });
        return;
      }

      const invitePage =
        invitation.type === INVITATION_TYPE.GUARDIAN ? "/relation/received-guardian" : "/relation/received-invite";
      navigate(`${invitePage}?token=${token}`, { replace: true });
    });

    return () => {
      ignore = true;
    };
  }, [invitation, isError, token, navigate]);

  return null; // 이동만 하므로 그릴 화면 없음
}

export default InvitationEntry;
