// H-04 지난 상황
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/PastSituation.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import SelectSection from "@/shared/components/SelectSection/SelectSection";
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import IllustrationMessage from "@/shared/components/IllustrationMessage/IllustrationMessage";
import PastSituationFilterTabs from "@/features/situation/components/PastSituationFilterTabs";
import PastSituationCard from "@/features/situation/components/PastSituationCard";
import PersonRadioOption from "@/features/situation/components/PersonRadioOption";
import resImgNew from "@/shared/assets/images/resImgNew.png";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import { useToast } from "@/shared/hooks/useToast";
import { getErrorMessage } from "@/shared/utils/apiError";
import {
  PAST_SITUATION_ALL_PERSON_TEXT,
  PAST_SITUATION_DEFAULT_FILTER,
  SITUATION_NAVIGATION_PATH,
} from "@/features/situation/constants/situationConstants";
import { SITUATION_MOCK_SCENARIO } from "@/features/situation/api/situationApi";
import { useAllPastSituationsQuery } from "@/features/situation/hooks/queries/useAllPastSituationsQuery";
import { usePastSituationsQuery } from "@/features/situation/hooks/queries/usePastSituationsQuery";
import { usePastSituationPeopleQuery } from "@/features/situation/hooks/queries/usePastSituationPeopleQuery";

function PastSituation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { toast, showToast, hideToast } = useToast();

  // 빈 상태 확인용: ?state=empty (종료된 상황이 없는 경우, 목업 사용 중일 때만 적용)
  const mockScenario =
    searchParams.get("state") === "empty" ? SITUATION_MOCK_SCENARIO.EMPTY : undefined;

  const [selectedTabKey, setSelectedTabKey] = useState(PAST_SITUATION_DEFAULT_FILTER);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [isPersonSheetOpen, setIsPersonSheetOpen] = useState(false);

  // 탭(filter) · 사람(personId) 조건은 서버에서 걸러서 받음
  const pastSituationsQuery = useAllPastSituationsQuery({
    filter: selectedTabKey,
    personId: selectedPersonId,
    mockScenario,
  });
  const peopleQuery = usePastSituationPeopleQuery();
  // 종료된 상황이 하나라도 있는지 (탭 · 사람 조건과 상관없이 1건만 확인)
  const anyPastSituationQuery = usePastSituationsQuery({
    page: 0,
    size: 1,
    mockScenario,
  });

  const pastSituationList = pastSituationsQuery.data?.pastSituations ?? [];
  const personList = peopleQuery.data?.people ?? [];
  const selectedPerson = personList.find(({ id }) => id === selectedPersonId);

  // 조회 실패 시 안내 토스트
  const queryError = pastSituationsQuery.error ?? peopleQuery.error;
  useEffect(() => {
    if (queryError) showToast(getErrorMessage(queryError));
  }, [queryError, showToast]);

  // 조회가 끝나고 결과가 없을 때만 빈 상태 (로딩 중에는 표시하지 않음)
  const isListEmpty = pastSituationsQuery.isSuccess && pastSituationList.length === 0;
  // 종료된 상황이 하나도 없으면 어느 탭에서든 사람 별 보기 없이 안내만 (H-04 빈상태)
  const hasNoPastSituation =
    anyPastSituationQuery.isSuccess &&
    anyPastSituationQuery.data.pastSituations.length === 0;

  const handleSituationClick = (situationId) => {
    navigate(
      `${SITUATION_NAVIGATION_PATH.PAST_SITUATION_DETAIL}?situationId=${situationId}`,
    );
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title="지난 상황" />

      <main className={styles.content}>
        <PastSituationFilterTabs
          selectedKey={selectedTabKey}
          onChange={setSelectedTabKey}
        />

        {/* 종료된 상황이 하나도 없으면 사람 별 보기 없이 안내만 (H-04 빈상태) */}
        {!hasNoPastSituation && (
          <SelectSection
            title="사람 별 보기"
            text={selectedPerson?.name ?? PAST_SITUATION_ALL_PERSON_TEXT}
            isSelected={Boolean(selectedPerson)}
            width="large"
            onClick={() => setIsPersonSheetOpen(true)}
          />
        )}

        {pastSituationList.length > 0 && (
          <ul className={styles.situationList}>
            {pastSituationList.map((situation) => (
              <li key={situation.id}>
                <PastSituationCard
                  situation={situation}
                  onClick={() => handleSituationClick(situation.id)}
                />
              </li>
            ))}
          </ul>
        )}
        {isListEmpty && (
          <div className={styles.emptyState}>
            <IllustrationMessage
              imageSrc={resImgNew}
              message="종료된 상황이 없어요."
            />
          </div>
        )}
      </main>

      {/* 사람 선택 */}
      <DefaultSheet
        isOpen={isPersonSheetOpen}
        onClose={() => setIsPersonSheetOpen(false)}
        title="사람 선택"
        value={selectedPersonId}
        onConfirm={setSelectedPersonId}
      >
        {(tempValue, setTempValue) => (
          <PersonRadioOption
            people={personList}
            value={tempValue}
            onChange={setTempValue}
          />
        )}
      </DefaultSheet>

      {toast && (
        <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
      )}
    </div>
  );
}

export default PastSituation;
