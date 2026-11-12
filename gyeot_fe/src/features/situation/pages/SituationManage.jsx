// H-03-05 참여자 · 상황 관리
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/situation/pages/SituationManage.module.css";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import DefaultSheet from "@/shared/components/DefaultSheet/DefaultSheet";
import ManageParticipantList from "@/features/situation/components/ManageParticipantList";
import JoinedSituationCard from "@/features/situation/components/JoinedSituationCard";
import InviteParticipantOption from "@/features/situation/components/InviteParticipantOption";
import SituationEndSheet from "@/features/situation/components/SituationEndSheet";
import SituationConfirmModal from "@/features/situation/components/SituationConfirmModal";
import { SITUATION_NAVIGATION_PATH } from "@/features/situation/constants/situationConstants";
import {
  ACTIVE_REQUEST_COUNT_MOCK,
  INVITE_CANDIDATE_LIST_MOCK,
  JOINED_SITUATION_MOCK,
  MANAGE_PARTICIPANT_LIST_MOCK,
} from "@/features/situation/mocks/situationMockData";

function SituationManage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // TODO: API 연동 전까지 목업 데이터 사용
  // 화면 확인용: ?role=participant (참여자 시점), ?state=empty (참여자가 모두 나간 경우)
  const isOwner = searchParams.get("role") !== "participant";
  const isEmptyPreview = searchParams.get("state") === "empty";

  const [participantList, setParticipantList] = useState(
    isEmptyPreview ? [] : MANAGE_PARTICIPANT_LIST_MOCK,
  );
  const inviteCandidateList = INVITE_CANDIDATE_LIST_MOCK;
  const joinedSituation = JOINED_SITUATION_MOCK;
  const activeRequestCount = ACTIVE_REQUEST_COUNT_MOCK;

  // 열려 있는 시트/모달 ("invite" | "end" | null), 제외할 참여자 id
  const [openSheet, setOpenSheet] = useState(null);
  const [excludeTargetId, setExcludeTargetId] = useState(null);

  const handleSheetClose = () => {
    setOpenSheet(null);
  };

  // 참여자 추가: 시트에서 체크한 지인들을 목록에 추가
  const handleParticipantInvite = (checkedIdList) => {
    // TODO: 참여자 추가 API 연동
    const joinedIdList = participantList.map(({ id }) => id);
    const newParticipantList = inviteCandidateList
      .filter(
        ({ id }) => checkedIdList.includes(id) && !joinedIdList.includes(id),
      )
      .map(({ id, name, isGuardian }) => ({
        id,
        name,
        relationLabel: isGuardian ? "보호자" : "",
        isGuardian,
      }));

    setParticipantList((prev) => [...prev, ...newParticipantList]);
  };

  // 참여자 제외: 확인 모달에서 '제외'를 누르면 목록에서 제거
  const handleParticipantExcludeConfirm = () => {
    // TODO: 참여자 제외 API 연동
    setParticipantList((prev) =>
      prev.filter(({ id }) => id !== excludeTargetId),
    );
    setExcludeTargetId(null);
  };

  const handleSituationEndConfirm = () => {
    // TODO: 상황 종료 API 연동 후 결과에 따라 이동
    setOpenSheet(null);
    navigate(SITUATION_NAVIGATION_PATH.SITUATION_LIST);
  };

  const handleSituationLeaveClick = () => {
    navigate(SITUATION_NAVIGATION_PATH.SITUATION_LEAVE);
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
              onClick={handleSituationLeaveClick}
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
            joinedIdList={participantList.map(({ id }) => id)}
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

      {/* 참여자 제외 확인 */}
      <SituationConfirmModal
        isOpen={excludeTargetId !== null}
        message={"제외하는 경우, 상황 및 요청에 대한\n정보가 모두 회수됩니다."}
        confirmText="제외"
        onConfirm={handleParticipantExcludeConfirm}
        onClose={() => setExcludeTargetId(null)}
      />
    </div>
  );
}

export default SituationManage;
