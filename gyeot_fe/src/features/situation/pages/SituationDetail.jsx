// H-03 상황 상세 (정보 주인 뷰)
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/SituationDetail.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import SituationDetailCard from "@/features/situation/components/SituationDetailCard";
import ParticipantTagList from "@/features/situation/components/ParticipantTagList";
import SituationRequestList from "@/features/situation/components/SituationRequestList";
import RequestListEmpty from "@/features/situation/components/RequestListEmpty";
import { SITUATION_NAVIGATION_PATH } from "@/features/situation/constants/situationConstants";
import { SITUATION_DETAIL_MOCK } from "@/features/situation/mocks/situationMockData";

function SituationDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // TODO: 상황 상세 API 연동 전까지 목업 데이터 사용
  // 화면 확인용: ?state=empty (요청이 없는 경우)
  const isEmptyPreview = searchParams.get("state") === "empty";
  const situation = SITUATION_DETAIL_MOCK;
  const participantList = situation.participants;
  const requestList = isEmptyPreview ? [] : situation.requests;

  const handleRequestClick = (requestId) => {
    navigate(`${SITUATION_NAVIGATION_PATH.REQUEST_REQUESTER_DETAIL}/${requestId}`);
  };

  const handleRequestCreateClick = () => {
    navigate(`${SITUATION_NAVIGATION_PATH.REQUEST_CREATE}/${situation.id}`);
  };

  return (
    <div className={styles.page}>
      <SubpageHeader
        title={situation.title}
        hasMoreButton
        morePath={SITUATION_NAVIGATION_PATH.SITUATION_MANAGE}
      />

      <main className={styles.content}>
        <section className={styles.situationSection}>
          <SituationDetailCard
            situation={situation}
            participantCount={participantList.length}
          />
          <ParticipantTagList participants={participantList} />
        </section>

        <section className={styles.requestSection}>
          <h2 className={`${styles.sectionTitle} typoTitleMedium`}>요청</h2>
          {requestList.length > 0 ? (
            <SituationRequestList
              requests={requestList}
              onRequestClick={handleRequestClick}
            />
          ) : (
            <RequestListEmpty />
          )}
        </section>
      </main>

      <LargeFooter
        title="+ 요청 작성"
        type="primary"
        onClick={handleRequestCreateClick}
      />
    </div>
  );
}

export default SituationDetail;
