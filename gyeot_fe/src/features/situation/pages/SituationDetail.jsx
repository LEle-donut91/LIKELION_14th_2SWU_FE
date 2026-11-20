// H-03 상황 상세 (H-03-01 정보 주인 뷰 / H-03-02 참여자 뷰)
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/SituationDetail.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import LargeFooter from "@/shared/components/LargeFooter/LargeFooter";
import SituationDetailCard from "@/features/situation/components/SituationDetailCard";
import ParticipantTagList from "@/features/situation/components/ParticipantTagList";
import SituationRequestList from "@/features/situation/components/SituationRequestList";
import ResponseNeededRequestList from "@/features/situation/components/ResponseNeededRequestList";
import RequestListEmpty from "@/features/situation/components/RequestListEmpty";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import { useToast } from "@/shared/hooks/useToast";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import {
  MY_REQUEST_ROLE,
  SITUATION_NAVIGATION_PATH,
  SITUATION_NOT_FOUND_CODE,
} from "@/features/situation/constants/situationConstants";
import { SITUATION_MOCK_SCENARIO } from "@/features/situation/api/situationApi";
import { useSituationDetailQuery } from "@/features/situation/hooks/queries/useSituationDetailQuery";
import { useSituationParticipantsQuery } from "@/features/situation/hooks/queries/useSituationParticipantsQuery";

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

  const { toast, showToast, hideToast } = useToast();

  // 상황 ID: S-00 등에서 /situation/detail?situationId= 로 전달
  // 목업 확인용: situationId=1 (정보 주인), situationId=21 (참여자)
  // - &state=empty       : 요청이 하나도 없는 경우
  // - &state=no-accepted : 응답 대기 요청만 있는 경우 (참여자 뷰 '수락한 요청' 빈 상태)
  const situationId = searchParams.get("situationId");
  const mockScenario = Object.values(SITUATION_MOCK_SCENARIO).includes(
    searchParams.get("state"),
  )
    ? searchParams.get("state")
    : undefined;

  const detailQuery = useSituationDetailQuery(situationId, { mockScenario });
  const participantsQuery = useSituationParticipantsQuery(situationId);

  // 상황 ID가 없으면 상황 목록으로
  useEffect(() => {
    if (!situationId) {
      navigate(SITUATION_NAVIGATION_PATH.SITUATION_LIST, { replace: true });
    }
  }, [situationId, navigate]);

  // 조회 실패: 상황이 없거나 접근 불가(404)면 상황 목록으로, 그 외는 토스트
  const queryError = detailQuery.error ?? participantsQuery.error;
  useEffect(() => {
    if (!queryError) return;
    if (getErrorCode(queryError) === SITUATION_NOT_FOUND_CODE) {
      navigate(SITUATION_NAVIGATION_PATH.SITUATION_LIST, { replace: true });
      return;
    }
    showToast(getErrorMessage(queryError));
  }, [queryError, navigate, showToast]);

  const situation = detailQuery.data;
  const participantData = participantsQuery.data;

  // 두 조회가 모두 끝나기 전에는 빈 화면 (참여자 수 0명 등이 잠깐 보이지 않도록)
  if (!situation || !participantData) {
    return (
      <div className={styles.page}>
        {toast && (
          <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
        )}
      </div>
    );
  }

  const { isOwner, viewerId } = situation;
  // 참여자 태그: 정보 주인과 나를 뺀 현재 참여자
  const participantList = participantData.participants.filter(
    ({ userId }) => userId !== viewerId,
  );
  const situationCardData = { ...situation, ownerName: participantData.ownerName };
  const requestList = isOwner ? situation.requests : situation.assignedRequests;
  // 참여자: 응답이 필요한 요청 (정보 주인은 없음)
  const responseNeededRequestList = situation.responseNeededRequests;
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
    ? `${SITUATION_NAVIGATION_PATH.SITUATION_MANAGE}?situationId=${situation.id}`
    : `${SITUATION_NAVIGATION_PATH.SITUATION_MANAGE}?situationId=${situation.id}&role=participant`;

  return (
    <div className={styles.page}>
      <SubpageHeader title={situation.title} hasMoreButton morePath={managePath} />

      <main
        className={`${styles.content} ${isOwner ? styles.hasFooter : ""}`}
      >
        <section className={styles.situationSection}>
          <SituationDetailCard
            situation={situationCardData}
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

      {toast && (
        <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
      )}
    </div>
  );
}

export default SituationDetail;
