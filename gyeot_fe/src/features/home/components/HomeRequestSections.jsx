import styles from "@/features/home/components/HomeRequestSections.module.css";
import HomeSection from "@/features/home/components/HomeSection";
import ReceivedRequestItem from "@/features/home/components/ReceivedRequestItem";
import SentRequestItem from "@/features/home/components/SentRequestItem";
import ScheduleItem from "@/features/home/components/ScheduleItem";
import { MAX_UPCOMING_SCHEDULE_COUNT } from "@/features/home/constants/homeConstants";

// 탭 밖 공통 영역: 응답이 필요한 요청 → 보낸 요청 → 다가오는 일정
// - 나의 상황 / 참여 상황 탭과 관계없이 같은 목록을 표시 (홈 통합 조회의 최상위 목록)
// - 기존 SituationTabContent 안에 있던 섹션을 그대로 옮김 (섹션 사이 간격 48 유지)
function HomeRequestSections({
  receivedRequests = [],
  sentRequests = [],
  upcomingSchedules = [],
  onReceivedRequestClick,
  onSentRequestClick,
}) {
  return (
    <div className={styles.homeRequestSections}>
      {receivedRequests.length > 0 && (
        <HomeSection title="응답이 필요한 요청">
          {receivedRequests.map((request) => (
            <ReceivedRequestItem
              key={request.id}
              request={request}
              onClick={() => onReceivedRequestClick?.(request.id)}
            />
          ))}
        </HomeSection>
      )}

      {sentRequests.length > 0 && (
        <HomeSection title="보낸 요청">
          {sentRequests.map((request) => (
            <SentRequestItem
              key={request.id}
              request={request}
              onClick={() => onSentRequestClick?.(request.id)}
            />
          ))}
        </HomeSection>
      )}

      <HomeSection
        title="다가오는 일정"
        isEmpty={upcomingSchedules.length === 0}
        emptyText="다가오는 일정이 없어요."
      >
        {upcomingSchedules
          .slice(0, MAX_UPCOMING_SCHEDULE_COUNT)
          .map((schedule) => (
            <ScheduleItem key={schedule.id} schedule={schedule} />
          ))}
      </HomeSection>
    </div>
  );
}

export default HomeRequestSections;