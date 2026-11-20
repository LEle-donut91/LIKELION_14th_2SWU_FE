// N-04 지난 상황 상세 (요청자 / 담당자)
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/PastSituationDetail.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import PastSituationCard from "@/features/situation/components/PastSituationCard";
import PastRequestHistoryList from "@/features/situation/components/PastRequestHistoryList";
import ThanksMessageCard from "@/features/situation/components/ThanksMessageCard";
import { SITUATION_NAVIGATION_PATH } from "@/features/situation/constants/situationConstants";
import {
  JOINED_PAST_SITUATION_DETAIL_MOCK,
  PAST_SITUATION_DETAIL_MOCK,
} from "@/features/situation/mocks/situationMockData";

function PastSituationDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // TODO: 지난 상황 상세 API 연동 전까지 목업 데이터 사용
  // 화면 확인용: ?role=participant (담당자 시점)
  const isOwner = searchParams.get("role") !== "participant";
  const situation = isOwner
    ? PAST_SITUATION_DETAIL_MOCK
    : JOINED_PAST_SITUATION_DETAIL_MOCK;

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

      <main className={styles.content}>
        <PastSituationCard situation={situation} />

        {situation.requests.length > 0 && (
          <PastRequestHistoryList
            requests={situation.requests}
            isOwner={isOwner}
          />
        )}

        {/* 감사 메시지: 요청자는 쓰기, 담당자는 받은 메시지가 있을 때만 (F-21) */}
        {isOwner && situation.canWriteThanks && (
          <ThanksMessageCard
            title="감사 메시지 쓰기"
            description="요청마다 1통씩 작성할 수 있어요."
            onClick={handleThanksMessageClick}
          />
        )}
        {!isOwner && situation.thanksFromName && (
          <ThanksMessageCard
            title="받은 감사 메시지"
            description={`${situation.thanksFromName}님이 보낸 편지`}
            onClick={handleThanksMessageClick}
          />
        )}
      </main>
    </div>
  );
}

export default PastSituationDetail;
