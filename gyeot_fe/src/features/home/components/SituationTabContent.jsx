import styles from "@/features/home/components/SituationTabContent.module.css";
import SituationCard from "@/shared/components/SituationCard/SituationCard";
import SituationEmpty from "@/features/home/components/SituationEmpty";
import { SITUATION_TAB } from "@/features/home/constants/homeConstants";

// 탭(나의 상황 / 참여 상황) 하단 콘텐츠: 상황 카드 목록
// - 응답이 필요한 요청 · 보낸 요청 · 다가오는 일정은 탭과 관계없는 공통 영역이라
//   HomeRequestSections에서 탭 밖에 그림 (홈 통합 조회에서 탭별로 나뉘지 않음)
function SituationTabContent({
  tabKey,
  situations = [],
  onSituationDetailClick,
  onSituationCreateClick,
}) {
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
    </div>
  );
}

export default SituationTabContent;