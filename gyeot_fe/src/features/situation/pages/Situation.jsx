// S-00 상황 목록 (진행 중 · 지난)
import { useNavigate } from "react-router-dom";
import styles from "@/features/situation/pages/Situation.module.css";
import MainHeader from "@/shared/components/main-header/MainHeader";
import BottomNav from "@/shared/components/BottomNav/BottomNav";
import SituationCard from "@/shared/components/SituationCard/SituationCard";
import MaskIcon from "@/shared/components/MaskIcon/MaskIcon";
import PastSituationList from "@/features/situation/components/PastSituationList";
import iconRight from "@/shared/assets/icons/iconRight.svg";
import { SITUATION_NAVIGATION_PATH } from "@/features/situation/constants/situationConstants";
import {
  ONGOING_SITUATION_MOCK,
  PAST_SITUATION_LIST_MOCK,
  UPCOMING_SCHEDULE_MOCK,
} from "@/features/situation/mocks/situationMockData";

function Situation() {
  const navigate = useNavigate();

  // TODO: API 연동 전까지 목업 데이터 사용
  const ongoingSituation = ONGOING_SITUATION_MOCK;
  const upcomingSchedule = UPCOMING_SCHEDULE_MOCK;
  const pastSituationList = PAST_SITUATION_LIST_MOCK;

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

  return (
    <div className={styles.page}>
      <MainHeader title="상황" />

      <main className={styles.content}>
        {/* 진행 중인 상황 */}
        <section className={styles.ongoingSection}>
          <SituationCard
            situation={ongoingSituation}
            upcomingSchedule={upcomingSchedule}
            onDetailClick={handleSituationDetailClick}
          />
          <button
            type="button"
            className={`${styles.createBtn} typoBodyStrong`}
            onClick={handleSituationCreateClick}
          >
            상황 생성하기
          </button>
        </section>

        {/* 지난 상황 */}
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
      </main>

      <BottomNav />
    </div>
  );
}

export default Situation;
