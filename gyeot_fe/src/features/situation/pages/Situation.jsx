// S-00 상황 목록 (진행 중 · 지난)
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/Situation.module.css";
import MainHeader from "@/shared/components/main-header/MainHeader";
import BottomNav from "@/shared/components/BottomNav/BottomNav";
import SituationCard from "@/shared/components/SituationCard/SituationCard";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import PastSituationList from "@/features/situation/components/PastSituationList";
import SituationListEmpty from "@/features/situation/components/SituationListEmpty";
import iconRight from "@/shared/assets/icons/iconRight.svg";
import { SITUATION_NAVIGATION_PATH } from "@/features/situation/constants/situationConstants";
import {
  ONGOING_SITUATION_MOCK,
  PAST_SITUATION_LIST_MOCK,
  UPCOMING_SCHEDULE_MOCK,
} from "@/features/situation/mocks/situationMockData";

function Situation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // TODO: API 연동 전까지 목업 데이터 사용
  // 빈 상태(S-00-2) 확인용: /situation?state=empty
  const isEmptyPreview = searchParams.get("state") === "empty";
  const ongoingSituation = isEmptyPreview ? null : ONGOING_SITUATION_MOCK;
  const upcomingSchedule = UPCOMING_SCHEDULE_MOCK;
  const pastSituationList = isEmptyPreview ? [] : PAST_SITUATION_LIST_MOCK;

  const hasOngoingSituation = Boolean(ongoingSituation);
  const hasPastSituation = pastSituationList.length > 0;

  const handleSituationDetailClick = () => {
    navigate(SITUATION_NAVIGATION_PATH.SITUATION_DETAIL);
  };

  const handleSituationCreateClick = () => {
    navigate(SITUATION_NAVIGATION_PATH.SITUATION_CREATE);
  };

  const handlePastSituationAllClick = () => {
    navigate(SITUATION_NAVIGATION_PATH.PAST_SITUATION);
  };

  const handlePastSituationClick = () => {
    navigate(SITUATION_NAVIGATION_PATH.PAST_SITUATION_DETAIL);
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
        hasOngoingSituation ? "" : styles.pageEmpty
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
            hasOngoingSituation ? styles.ongoingSection : styles.emptySection
          }
        >
          {hasOngoingSituation ? (
            <SituationCard
              situation={ongoingSituation}
              upcomingSchedule={upcomingSchedule}
              onDetailClick={handleSituationDetailClick}
            />
          ) : (
            <SituationListEmpty />
          )}
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
    </div>
  );
}

export default Situation;
