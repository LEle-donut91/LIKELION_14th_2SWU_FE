import styles from "@/features/home/components/SituationTabContent.module.css";
import SituationCard from "@/features/home/components/SituationCard";
import SituationEmpty from "@/features/home/components/SituationEmpty";
import HomeSection from "@/features/home/components/HomeSection";
import ReceivedRequestItem from "@/features/home/components/ReceivedRequestItem";
import SentRequestItem from "@/features/home/components/SentRequestItem";
import ScheduleItem from "@/features/home/components/ScheduleItem";
import {
  MAX_UPCOMING_SCHEDULE_COUNT,
  SITUATION_TAB,
} from "@/features/home/constants/homeConstants";

// 탭(나의 상황 / 참여 상황) 하단 콘텐츠
// 상황 카드 목록 → 응답이 필요한 요청 → 보낸 요청 → 다가오는 일정
function SituationTabContent({
  tabKey,
  content,
  onSituationDetailClick,
  onSituationCreateClick,
  onReceivedRequestClick,
  onSentRequestClick,
}) {
  const {
    situations = [],
    receivedRequests = [],
    sentRequests = [],
    upcomingSchedules = [],
  } = content ?? {};

  const isMyTab = tabKey === SITUATION_TAB.MY;

  return (
    <div className={styles.situationTabContent}>
      {situations.length > 0 ? (
        <div className={styles.situationList}>
          {situations.map((situation) => (
            <SituationCard
              key={situation.id}
              situation={situation}
              onDetailClick={() => onSituationDetailClick?.(situation.id)}
            />
          ))}
        </div>
      ) : (
        <SituationEmpty
          message={
            isMyTab
              ? "진행 중인 상황이 없어요.\n필요하다면 상황을 생성해 주세요."
              : "참여 중인 상황이 없어요."
          }
          onCreateClick={isMyTab ? onSituationCreateClick : undefined}
        />
      )}

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

export default SituationTabContent;
