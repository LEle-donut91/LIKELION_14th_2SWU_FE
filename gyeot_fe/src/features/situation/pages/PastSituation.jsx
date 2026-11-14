// H-04 지난 상황
import { useState } from "react";
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
import {
  PAST_SITUATION_ALL_PERSON_TEXT,
  SITUATION_NAVIGATION_PATH,
} from "@/features/situation/constants/situationConstants";
import {
  PAST_SITUATION_LIST_MOCK,
  PAST_SITUATION_PERSON_LIST_MOCK,
} from "@/features/situation/mocks/situationMockData";

// 탭별로 보여줄 상황 (도와준: 내가 참여자, 도움받은: 내가 정보 주인)
const isMatchedTab = (situation, tabKey) => {
  if (tabKey === "HELPED") return !situation.isOwner;
  if (tabKey === "RECEIVED") return situation.isOwner;
  return true;
};

function PastSituation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // TODO: 지난 상황 목록 API 연동 전까지 목업 데이터 사용 (필터도 API 파라미터로 대체)
  // 화면 확인용: ?state=empty (종료된 상황이 없는 경우)
  const isEmptyPreview = searchParams.get("state") === "empty";
  const pastSituationList = isEmptyPreview ? [] : PAST_SITUATION_LIST_MOCK;
  const personList = PAST_SITUATION_PERSON_LIST_MOCK;

  const [selectedTabKey, setSelectedTabKey] = useState("ALL");
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [isPersonSheetOpen, setIsPersonSheetOpen] = useState(false);

  const selectedPerson = personList.find(({ id }) => id === selectedPersonId);
  const filteredSituationList = pastSituationList.filter(
    (situation) =>
      isMatchedTab(situation, selectedTabKey) &&
      (selectedPersonId === null ||
        situation.personIds.includes(selectedPersonId)),
  );

  const handleSituationClick = () => {
    // TODO: 상황 id를 담아 지난 상황 상세(N-04)로 이동
    navigate(SITUATION_NAVIGATION_PATH.PAST_SITUATION_DETAIL);
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
        {pastSituationList.length > 0 && (
          <SelectSection
            title="사람 별 보기"
            text={selectedPerson?.name ?? PAST_SITUATION_ALL_PERSON_TEXT}
            isSelected={Boolean(selectedPerson)}
            width="large"
            onClick={() => setIsPersonSheetOpen(true)}
          />
        )}

        {filteredSituationList.length > 0 ? (
          <ul className={styles.situationList}>
            {filteredSituationList.map((situation) => (
              <PastSituationCard
                key={situation.id}
                situation={situation}
                onClick={handleSituationClick}
              />
            ))}
          </ul>
        ) : (
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
    </div>
  );
}

export default PastSituation;
