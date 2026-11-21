// S-00 상황 목록 (진행 중 · 지난)
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/Situation.module.css";
import MainHeader from "@/shared/components/main-header/MainHeader";
import BottomNav from "@/shared/components/BottomNav/BottomNav";
import SituationCard from "@/shared/components/SituationCard/SituationCard";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import PastSituationList from "@/features/situation/components/PastSituationList";
import SituationListEmpty from "@/features/situation/components/SituationListEmpty";
import iconRight from "@/shared/assets/icons/iconRight.svg";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import { useToast } from "@/shared/hooks/useToast";
import { getErrorMessage } from "@/shared/utils/apiError";
import {
  PAST_SITUATION_PREVIEW_SIZE,
  SITUATION_NAVIGATION_PATH,
} from "@/features/situation/constants/situationConstants";
import { useMySituationsQuery } from "@/features/situation/hooks/queries/useMySituationsQuery";
import { usePastSituationsQuery } from "@/features/situation/hooks/queries/usePastSituationsQuery";
import { SITUATION_MOCK_SCENARIO } from "@/features/situation/api/situationApi";

function Situation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { toast, showToast, hideToast } = useToast();

  // 빈 상태(S-00-2) 확인용: /situation?state=empty (목업 사용 중일 때만 적용)
  const mockScenario =
    searchParams.get("state") === "empty" ? SITUATION_MOCK_SCENARIO.EMPTY : undefined;

  const mySituationsQuery = useMySituationsQuery({ mockScenario });
  const pastSituationsQuery = usePastSituationsQuery({
    page: 0,
    size: PAST_SITUATION_PREVIEW_SIZE,
    mockScenario,
  });

  const mySituations = mySituationsQuery.data?.mySituations ?? [];
  const pastSituationList = pastSituationsQuery.data?.pastSituations ?? [];

  // 조회 실패 시 안내 토스트
  const queryError = mySituationsQuery.error ?? pastSituationsQuery.error;
  useEffect(() => {
    if (queryError) showToast(getErrorMessage(queryError));
  }, [queryError, showToast]);

  const hasOngoingSituation = mySituations.length > 0;
  // 조회가 끝나고 진행 중인 상황이 없을 때만 빈 상태 표시 (로딩·실패 중에는 표시하지 않음)
  const isOngoingEmpty = mySituationsQuery.isSuccess && !hasOngoingSituation;
  const hasPastSituation = pastSituationList.length > 0;

  const handleSituationDetailClick = (situationId) => {
    navigate(
      `${SITUATION_NAVIGATION_PATH.SITUATION_DETAIL}?situationId=${situationId}`,
    );
  };

  const handleSituationCreateClick = () => {
    navigate(SITUATION_NAVIGATION_PATH.SITUATION_CREATE);
  };

  const handlePastSituationAllClick = () => {
    navigate(SITUATION_NAVIGATION_PATH.PAST_SITUATION);
  };

  // 지난 상황 상세(N-04)로 이동 — 상세 응답에 아직 없는 주인 이름은 state로 함께 전달
  const handlePastSituationClick = (situationId) => {
    const pastSituation = pastSituationList.find(({ id }) => id === situationId);
    navigate(
      `${SITUATION_NAVIGATION_PATH.PAST_SITUATION_DETAIL}?situationId=${situationId}`,
      { state: { ownerName: pastSituation?.ownerName ?? null } },
    );
  };

  const handleAlarmClick = () => {
    // TODO: 알림 화면 연결 (알림은 1차 추가 기능, F-11)
  };

  const handleSettingClick = () => {
    // TODO: 설정(프로필) 화면 연결
  };

  return (
    <div
      className={`${styles.page} ${
        isOngoingEmpty ? styles.pageEmpty : ""
      }`}
    >
      <MainHeader
        title="상황"
        hasAlarmButton
        hasSettingButton
        onAlarmClick={handleAlarmClick}
        onSettingClick={handleSettingClick}
      />

      <main className={styles.content}>
        {/* 진행 중인 상황 (없으면 S-00-2 빈 상태) */}
        <section
          className={
            isOngoingEmpty ? styles.emptySection : styles.ongoingSection
          }
        >
          {mySituations.map((situation) => (
            <SituationCard
              key={situation.id}
              situation={situation}
              upcomingSchedule={situation.upcomingSchedule}
              onDetailClick={() => handleSituationDetailClick(situation.id)}
            />
          ))}
          {isOngoingEmpty && <SituationListEmpty />}
          <button
            type="button"
            className={`${styles.createBtn} typoBodyStrong`}
            onClick={handleSituationCreateClick}
          >
            상황 생성하기
          </button>
        </section>

        {/* 지난 상황 (기록이 있을 때만) */}
        {hasPastSituation && (
          <section className={styles.pastSection}>
            <div className={styles.pastHeader}>
              <h2 className={`${styles.pastTitle} typoDisplayMedium`}>
                지난 상황
              </h2>
              <button
                type="button"
                className={`${styles.allBtn} typoDisplaySmall`}
                onClick={handlePastSituationAllClick}
              >
                전체 보기
                <MaskIcon src={iconRight} size={28} />
              </button>
            </div>

            <div className={styles.pastListWrapper}>
              <PastSituationList
                situations={pastSituationList}
                onItemClick={handlePastSituationClick}
              />
            </div>
          </section>
        )}
      </main>

      <BottomNav />

      {toast && (
        <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
      )}
    </div>
  );
}

export default Situation;
