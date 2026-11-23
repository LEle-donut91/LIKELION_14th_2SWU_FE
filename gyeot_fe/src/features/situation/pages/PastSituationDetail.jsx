// N-04 지난 상황 상세 (요청자 / 담당자)
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/PastSituationDetail.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import PastSituationCard from "@/features/situation/components/PastSituationCard";
import PastRequestHistoryList from "@/features/situation/components/PastRequestHistoryList";
import ThanksMessageCard from "@/features/situation/components/ThanksMessageCard";
import Toast from "@/shared/components/Toast/Toast";
import { useToastStore } from "@/shared/stores/useToastStore";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import {
  SITUATION_NAVIGATION_PATH,
  SITUATION_NOT_FOUND_CODE,
} from "@/features/situation/constants/situationConstants";
import { usePastSituationDetailQuery } from "@/features/situation/hooks/queries/usePastSituationDetailQuery";

function PastSituationDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const showToast = useToastStore((state) => state.showToast);

  // 지난 상황 ID: H-04 · S-00에서 ?situationId= 로 전달 (이동 state의 situationId도 허용)
  // 목업 확인용: situationId=13 (정보 주인), situationId=11 (참여자)
  const situationId =
    searchParams.get("situationId") ?? location.state?.situationId ?? null;
  const pastSituationQuery = usePastSituationDetailQuery(situationId);
  // 주인 이름은 상세 응답에 아직 없어서, 목록에서 넘겨준 값으로 보완 ('OO님의 상황')
  const situation = pastSituationQuery.data && {
    ...pastSituationQuery.data,
    ownerName:
      pastSituationQuery.data.ownerName ?? location.state?.ownerName ?? null,
  };

  // 상황 ID가 없으면 지난 상황 목록(H-04)으로
  useEffect(() => {
    if (!situationId) {
      navigate(SITUATION_NAVIGATION_PATH.PAST_SITUATION, { replace: true });
    }
  }, [situationId, navigate]);

  // 조회 실패: 상황이 없거나 접근 불가(404)면 지난 상황 목록으로, 그 외는 토스트
  const queryError = pastSituationQuery.error;
  useEffect(() => {
    if (!queryError) return;
    if (getErrorCode(queryError) === SITUATION_NOT_FOUND_CODE) {
      navigate(SITUATION_NAVIGATION_PATH.PAST_SITUATION, { replace: true });
      return;
    }
    showToast(getErrorMessage(queryError));
  }, [queryError, navigate, showToast]);

  // 'X' : 들어온 화면(S-00 상황 목록 또는 H-04 지난 상황)으로 돌아감
  // - 주소로 바로 들어와 이전 화면이 없을 때(location.key === "default")만 H-04로 이동
  const handleCloseClick = () => {
    if (location.key === "default") {
      navigate(SITUATION_NAVIGATION_PATH.PAST_SITUATION, { replace: true });
      return;
    }
    navigate(-1);
  };

  const handleThanksMessageClick = () => {
    // TODO: 감사 메시지 쓰기 / 받은 감사 메시지 화면 경로 정해지면 이동 (F-21)
  };

  return (
    <div className={styles.page}>
      <SubpageHeader
        title="지난 상황 상세"
        hasBackButton={false}
        hasCloseButton
        onCloseClick={handleCloseClick}
      />

      {situation && (
        <main className={styles.content}>
          <PastSituationCard situation={situation} />

          {situation.requests.length > 0 && (
            <PastRequestHistoryList
              requests={situation.requests}
              isOwner={situation.isOwner}
            />
          )}

          {/* 감사 메시지 쓰기: 요청자이고 완료된 요청이 있을 때 (F-21, UI만) */}
          {situation.isOwner && situation.canWriteThanks && (
            <ThanksMessageCard
              title="감사 메시지 쓰기"
              description="요청마다 1통씩 작성할 수 있어요."
              onClick={handleThanksMessageClick}
            />
          )}
          {/* 받은 감사 메시지(담당자)는 보낸 사람 정보가 아직 응답에 없어 F-21 진행 시 연결 */}
        </main>
      )}

      <Toast />
    </div>
  );
}

export default PastSituationDetail;
