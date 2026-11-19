// H-03 상황 상세 (H-03-01 정보 주인 뷰 / H-03-02 참여자 뷰)
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/SituationDetail.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import SituationDetailCard from "@/features/situation/components/SituationDetailCard";
import ParticipantTagList from "@/features/situation/components/ParticipantTagList";
import SituationRequestList from "@/features/situation/components/SituationRequestList";
import ResponseNeededRequestList from "@/features/situation/components/ResponseNeededRequestList";
import RequestListEmpty from "@/features/situation/components/RequestListEmpty";
import {
  MY_REQUEST_ROLE,
  SITUATION_NAVIGATION_PATH,
} from "@/features/situation/constants/situationConstants";
import {
  JOINED_SITUATION_DETAIL_MOCK,
  SITUATION_DETAIL_MOCK,
} from "@/features/situation/mocks/situationMockData";

// 시점별 요청 영역 문구
const REQUEST_SECTION_TEXT = {
  owner: {
    title: "요청",
    emptyTitle: "요청사항이 없어요.",
    emptyMessage: "필요한 도움이 생기면\n아래 버튼으로 요청을 작성해 주세요.",
  },
  participant: {
    title: "수락한 요청",
    emptyTitle: "아직 받은 요청이 없어요.",
    emptyMessage: "나에게 온 도움 요청이 여기에 표시돼요.",
  },
};

function SituationDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // TODO: 상황 상세 API 연동 전까지 목업 데이터 사용
  // 화면 확인용: ?role=participant (참여자 시점), ?state=empty (요청이 없는 경우)
  const isOwner = searchParams.get("role") !== "participant";
  const isEmptyPreview = searchParams.get("state") === "empty";
  const situation = isOwner ? SITUATION_DETAIL_MOCK : JOINED_SITUATION_DETAIL_MOCK;
  const participantList = situation.participants;
  const requestList = isEmptyPreview ? [] : situation.requests;
  // 참여자: 응답이 필요한 요청 (정보 주인은 없음)
  const responseNeededRequestList =
    isEmptyPreview || isOwner ? [] : situation.responseNeededRequests;
  const sectionText = REQUEST_SECTION_TEXT[isOwner ? "owner" : "participant"];

  // 정보 주인은 요청자 상세, 참여자는 내 역할(대상/담당)에 맞는 상세로 이동
  const handleRequestClick = ({ id, myRole }) => {
    const detailPath = isOwner
      ? SITUATION_NAVIGATION_PATH.REQUEST_REQUESTER_DETAIL
      : MY_REQUEST_ROLE[myRole]?.path;
    if (!detailPath) return;
    navigate(`${detailPath}/${id}`);
  };

  const handleRequestCreateClick = () => {
    navigate(`${SITUATION_NAVIGATION_PATH.REQUEST_CREATE}/${situation.id}`);
  };

  // '...' : H-03-05 상황 관리 (참여자는 참여자 시점으로)
  const managePath = isOwner
    ? SITUATION_NAVIGATION_PATH.SITUATION_MANAGE
    : `${SITUATION_NAVIGATION_PATH.SITUATION_MANAGE}?role=participant`;

  return (
    <div className={styles.page}>
      <SubpageHeader title={situation.title} hasMoreButton morePath={managePath} />

      <main
        className={`${styles.content} ${isOwner ? styles.hasFooter : ""}`}
      >
        <section className={styles.situationSection}>
          <SituationDetailCard
            situation={situation}
            isOwner={isOwner}
            participantCount={participantList.length}
          />
          <ParticipantTagList participants={participantList} />
        </section>

        <div className={styles.requestSectionContainer}>
          {/* 참여자: 응답이 필요한 요청 (있을 때만) */}
          {responseNeededRequestList.length > 0 && (
            <section className={styles.requestSection}>
              <h2 className={`${styles.sectionTitle} typoTitleMedium`}>
                응답이 필요한 요청
              </h2>
              <ResponseNeededRequestList
                requests={responseNeededRequestList}
                onRequestClick={handleRequestClick}
              />
            </section>
          )}

          <section className={styles.requestSection}>
            <h2 className={`${styles.sectionTitle} typoTitleMedium`}>
              {sectionText.title}
            </h2>
            {requestList.length > 0 ? (
              <SituationRequestList
                requests={requestList}
                onRequestClick={handleRequestClick}
              />
            ) : (
              <RequestListEmpty
                title={sectionText.emptyTitle}
                message={sectionText.emptyMessage}
              />
            )}
          </section>
        </div>
      </main>

      {/* 요청 작성은 정보 주인만 (F-05: 요청자는 항상 정보 주인) */}
      {isOwner && (
        <LargeFooter
          title="+ 요청 작성"
          type="primary"
          onClick={handleRequestCreateClick}
        />
      )}
    </div>
  );
}

export default SituationDetail;
