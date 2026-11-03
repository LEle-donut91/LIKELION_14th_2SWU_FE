// R-00

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RelationSection, { EmptyBox, Card } from "@/features/relation/components/RelationSection";
import PersonItem from "@/features/relation/components/PersonItem";
import SentInviteItem from "@/features/relation/components/SentInviteItem";
import { MAX_GUARDIANS, MOCK_RELATION } from "@/features/relation/constants/relation";
import MainHeader from "@/shared/components/main-header/MainHeader"; // 팀 공통 헤더
import BottomNav from "@/shared/components/BottomNav/BottomNav"; // 팀 공통 바텀 내비
import styles from "./Relation.module.css";

function Relation() {
  const navigate = useNavigate();
  const [data, setData] = useState(MOCK_RELATION); // TODO: API 연결 후 교체
  const { guardians, myPeople, registeredMe, sentInvites } = data;

  const isGuardianFull = guardians.length >= MAX_GUARDIANS; // 보호자 3명이면 요청 버튼 비활성화

  // 보낸 초대 취소 (목록에서 제거)
  const handleCancel = (id) => {
    setData((prev) => ({ ...prev, sentInvites: prev.sentInvites.filter((v) => v.id !== id) }));
  };

  // 다시 초대 (TODO: API 연결)
  const handleResend = (id) => {
    console.log("다시 초대", id);
  };

  // 지인 상세(R-02)로 이동 (선택한 사람 id를 state로 전달)
  const goDetail = (id) => navigate("/relation/acquaintance-detail", { state: { id } });

  return (
    <div className={styles.page}>
      {/* 상단 헤더 (공통 MainHeader) */}
      <MainHeader
        title="관계"
        hasAlarmButton
        hasSettingButton
        onAlarmClick={() => console.log("알림")} // TODO: 알림 화면 연결
        onSettingClick={() => console.log("설정")} // TODO: 설정 화면 연결
      />

      {/* 서로의 보호자 */}
      <RelationSection title="서로의 보호자" hint={`최대 ${MAX_GUARDIANS}명`}>
        {guardians.length === 0 ? (
          <EmptyBox text="아직 보호자가 없어요">
            <button type="button" className={styles.primaryBtn} onClick={() => navigate("/relation/guardian-request")}>
              보호자 요청 보내기
            </button>
          </EmptyBox>
        ) : (
          <>
            <ul className={styles.list}>
              {guardians.map((g) => (
                <li key={g.id}>
                  <Card>
                    <PersonItem
                      name={g.name}
                      sub={`연락 순서 ${g.priority}순위`}
                      badge={<span className={styles.guardianBadge}>보호자</span>}
                      showArrow
                      onClick={() => goDetail(g.id)}
                    />
                  </Card>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={styles.primaryBtn}
              disabled={isGuardianFull} // 3명이면 회색 비활성
              onClick={() => navigate("/relation/guardian-request")}
            >
              보호자 요청 보내기
            </button>
            {isGuardianFull && (
              <p className={styles.notice}>보호자가 있어서 새 요청을 보낼 수 없어요 · 바꾸려면 기존 관계를 해제해요</p>
            )}
          </>
        )}
      </RelationSection>

      {/* 내가 등록한 사람 (빈 상태 시안은 "나의 사람") */}
      <RelationSection title={myPeople.length ? "내가 등록한 사람" : "나의 사람"}>
        {myPeople.length === 0 ? (
          <EmptyBox text="등록한 사람이 없어요" />
        ) : (
          <ul className={styles.list}>
            {myPeople.map((p) => (
              <li key={p.id}>
                <Card>
                  <PersonItem name={p.name} sub={p.relation} color="olive" showArrow onClick={() => goDetail(p.id)} />
                </Card>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className={styles.outlineBtn} onClick={() => navigate("/relation/acquaintance-invite")}>
          + 나의 사람 초대
        </button>
      </RelationSection>

      {/* 나를 나의 사람으로 등록한 사람 (조회만) */}
      <RelationSection title="나를 나의 사람으로 등록한 사람" hint="조회만 가능">
        {registeredMe.length === 0 ? (
          <EmptyBox text="아직 없어요" />
        ) : (
          <Card className={styles.divided}>
            {registeredMe.map((p) => (
              <PersonItem key={p.id} name={p.name} color="gray" />
            ))}
          </Card>
        )}
      </RelationSection>

      {/* 보낸 초대 (있을 때만 노출) */}
      {sentInvites.length > 0 && (
        <RelationSection title="보낸 초대">
          <Card>
            {sentInvites.map((invite) => (
              <SentInviteItem key={invite.id} invite={invite} onCancel={handleCancel} onResend={handleResend} />
            ))}
          </Card>
        </RelationSection>
      )}

      <BottomNav /> {/* 하단 탭 */}
    </div>
  );
}

export default Relation;