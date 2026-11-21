// H-03-05 참여자 · 상황 관리
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/SituationManage.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import ManageParticipantList from "@/features/situation/components/ManageParticipantList";
import JoinedSituationCard from "@/features/situation/components/JoinedSituationCard";
import InviteParticipantOption from "@/features/situation/components/InviteParticipantOption";
import SituationEndSheet from "@/features/situation/components/SituationEndSheet";
import SituationLeaveSheet from "@/features/situation/components/SituationLeaveSheet";
import SituationConfirmModal from "@/features/situation/components/SituationConfirmModal";
import DefaultToast from "@/shared/components/Toast/DefaultToast";
import { useToast } from "@/shared/hooks/useToast";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import {
  SITUATION_NAVIGATION_PATH,
  SITUATION_NOT_FOUND_CODE,
} from "@/features/situation/constants/situationConstants";
import { SITUATION_MOCK_SCENARIO } from "@/features/situation/api/situationApi";
import { useSituationDetailQuery } from "@/features/situation/hooks/queries/useSituationDetailQuery";
import { useSituationParticipantsQuery } from "@/features/situation/hooks/queries/useSituationParticipantsQuery";
import { useInviteCandidatesQuery } from "@/features/situation/hooks/queries/useInviteCandidatesQuery";
import { useSituationManageMutations } from "@/features/situation/hooks/mutations/useSituationManageMutations";
import { getLeaveAffectedRequests } from "@/features/situation/services/situationManageService";

function SituationManage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { toast, showToast, hideToast } = useToast();

  // 상황 ID: H-03 상황 상세의 '…'에서 ?situationId= 로 전달
  // 목업 확인용: situationId=1 (정보 주인), situationId=21 (참여자),
  //              &state=empty (정보 주인 말고 참여자가 모두 나간 경우)
  const situationId = searchParams.get("situationId");
  const mockScenario =
    searchParams.get("state") === SITUATION_MOCK_SCENARIO.EMPTY
      ? SITUATION_MOCK_SCENARIO.EMPTY
      : undefined;

  const detailQuery = useSituationDetailQuery(situationId);
  const participantsQuery = useSituationParticipantsQuery(situationId, {
    mockScenario,
  });
  const isOwner = detailQuery.data?.isOwner ?? false;
  // 참여자 추가 시트 지인 목록은 정보 주인만 필요
  const inviteCandidatesQuery = useInviteCandidatesQuery({
    enabled: detailQuery.isSuccess && isOwner,
  });

  const { addParticipants, removeParticipant, endSituation, leaveSituation } =
    useSituationManageMutations({ situationId, showToast });

  // 열려 있는 시트/모달 ("invite" | "end" | "leave" | null), 제외할 참여자 id(participantId)
  const [openSheet, setOpenSheet] = useState(null);
  const [excludeTargetId, setExcludeTargetId] = useState(null);

  // 상황 ID가 없으면 상황 목록으로
  useEffect(() => {
    if (!situationId) {
      navigate(SITUATION_NAVIGATION_PATH.SITUATION_LIST, { replace: true });
    }
  }, [situationId, navigate]);

  // 조회 실패: 상황이 없거나 접근 불가(404)면 상황 목록으로, 그 외는 토스트
  const queryError =
    detailQuery.error ?? participantsQuery.error ?? inviteCandidatesQuery.error;
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

  // 상황·참여자 조회가 끝나기 전에는 헤더만 표시
  if (!situation || !participantData) {
    return (
      <div className={styles.page}>
        <SubpageHeader title="" />
        {toast && (
          <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
        )}
      </div>
    );
  }

  const participantList = participantData.participants;
  const inviteCandidateList = inviteCandidatesQuery.data?.people ?? [];
  // 참여자 시점 상황 카드
  const joinedSituation = { ...situation, ownerName: participantData.ownerName };
  // 종료 시트: 상황 전체의 미종료 요청 수 / 나가기 시트: 내가 수락·진행 중인 요청
  const activeRequestCount = situation.activeRequestCount;
  const myAssignedRequestList = getLeaveAffectedRequests(situation.assignedRequests);

  const handleSheetClose = () => {
    setOpenSheet(null);
  };

  // 참여자 추가: 시트에서 체크한 지인(userId)들을 추가
  const handleParticipantInvite = (checkedIdList) => {
    addParticipants(checkedIdList);
  };

  // 참여자 제외: 확인 모달에서 '제외'를 누르면 제외 요청
  const handleParticipantExcludeConfirm = () => {
    removeParticipant(excludeTargetId);
    setExcludeTargetId(null);
  };

  // 상황 종료 · 나가기: 성공하면 상황 목록으로 (뒤로가기로 돌아오지 않도록 replace)
  const moveToSituationList = () => {
    setOpenSheet(null);
    navigate(SITUATION_NAVIGATION_PATH.SITUATION_LIST, { replace: true });
  };

  const handleSituationEndConfirm = () => {
    endSituation({ onSuccess: moveToSituationList });
  };

  // 상황 나가기(N-09)
  const handleSituationLeaveConfirm = () => {
    leaveSituation({ onSuccess: moveToSituationList });
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title={isOwner ? "참여자 · 상황 관리" : "상황 관리"} />

      <h2 className={`${styles.sectionTitle} typoTitleMedium`}>참여자</h2>

      <main className={styles.content}>
        {isOwner ? (
          <>
            {participantList.length > 0 ? (
              <ManageParticipantList
                participants={participantList}
                onExcludeClick={setExcludeTargetId}
              />
            ) : (
              <div className={styles.emptyNotice}>
                <p className={styles.emptyNoticeTitle}>
                  참여자가 모두 나갔어요
                </p>
                <p className={`${styles.emptyNoticeDescription} typoBodySmall`}>
                  상황은 자동 종료되지 않아요. 계속하거나 직접 종료할 수 있어요.
                </p>
              </div>
            )}

            <button
              type="button"
              className={styles.addParticipantBtn}
              onClick={() => setOpenSheet("invite")}
            >
              + 참여자 추가
            </button>
          </>
        ) : (
          <JoinedSituationCard situation={joinedSituation} />
        )}
      </main>

      {/* 하단: 정보 주인은 상황 종료, 참여자는 상황 나가기 */}
      <footer className={styles.footer}>
        {isOwner ? (
          <button
            type="button"
            className={styles.dangerTextBtn}
            onClick={() => setOpenSheet("end")}
          >
            상황 종료
          </button>
        ) : (
          <>
            <button
              type="button"
              className={styles.dangerTextBtn}
              onClick={() => setOpenSheet("leave")}
            >
              상황 나가기
            </button>
            <p className={`${styles.leaveCaption} typoCaptionMedium`}>
              상황 나가기는 회원 탈퇴와 달라요 (탈퇴는 설정)
            </p>
          </>
        )}
      </footer>

      {/* 참여자 추가 */}
      <DefaultSheet
        isOpen={openSheet === "invite"}
        onClose={handleSheetClose}
        title="참여자 추가"
        value={[]}
        onConfirm={handleParticipantInvite}
        confirmText="추가하기"
        getIsConfirmDisabled={(checkedIdList) => checkedIdList.length === 0}
      >
        {(tempValue, setTempValue) => (
          <InviteParticipantOption
            people={inviteCandidateList}
            joinedIdList={participantList.map(({ userId }) => userId)}
            checkedIdList={tempValue}
            onChange={setTempValue}
          />
        )}
      </DefaultSheet>

      {/* 상황 종료 확인 */}
      <SituationEndSheet
        isOpen={openSheet === "end"}
        onClose={handleSheetClose}
        activeRequestCount={activeRequestCount}
        onConfirm={handleSituationEndConfirm}
      />

      {/* 상황 나가기 확인 (N-09) */}
      <SituationLeaveSheet
        isOpen={openSheet === "leave"}
        onClose={handleSheetClose}
        assignedRequests={myAssignedRequestList}
        onConfirm={handleSituationLeaveConfirm}
      />

      {/* 참여자 제외 확인 */}
      <SituationConfirmModal
        isOpen={excludeTargetId !== null}
        message={"제외하는 경우, 상황 및 요청에 대한\n정보가 모두 회수됩니다."}
        confirmText="제외"
        onConfirm={handleParticipantExcludeConfirm}
        onClose={() => setExcludeTargetId(null)}
      />

      {toast && (
        <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />
      )}
    </div>
  );
}

export default SituationManage;
