// R-02-01

import { useState } from "react";
import { useLocation } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import SharedInfoCard from "@/features/relation/components/SharedInfoCard";
import { MOCK_RELATION } from "@/features/relation/constants/relation";
import { MOCK_SHARED_INFO, SHARE_STATUS } from "@/features/relation/constants/sharedInfo";
import iconDocument from "@/shared/assets/icons/iconDocument.svg";
import styles from "./AcquaintanceShared.module.css";

// R-02에서 넘겨준 id로 이름 찾기 (TODO: API 연결 후 교체)
function findName(id) {
  const people = [...MOCK_RELATION.guardians, ...MOCK_RELATION.myPeople];
  return (people.find((p) => p.id === id) ?? MOCK_RELATION.myPeople[0]).name;
}

function AcquaintanceShared() {
  const { state } = useLocation(); // R-02에서 넘겨준 { id, userId, name }
  const name = state?.name ?? findName(state?.id); // R-02에서 받은 이름 우선 (주소로 바로 들어오면 임시 이름)

  const [sharing, setSharing] = useState(MOCK_SHARED_INFO.sharing); // 내가 공유 중인 정보
  const received = MOCK_SHARED_INFO.received; // 받은 정보 (조회만)

  const hasWithdrawn = sharing.some((info) => info.status === SHARE_STATUS.WITHDRAWN); // 철회한 게 있는지

  // 직접 철회 ↔ 다시 허용 (TODO: 철회 / 다시 허용 API 연결)
  const handleToggle = (id) => {
    setSharing((prev) =>
      prev.map((info) =>
        info.id === id
          ? {
              ...info,
              status: info.status === SHARE_STATUS.SHARING ? SHARE_STATUS.WITHDRAWN : SHARE_STATUS.SHARING,
            }
          : info
      )
    );
  };

  return (
    <div className={styles.page}>
      <SubpageHeader title={`${name} - 공유 중인 정보`} />

      <div className={styles.content}>
        {/* ===== 공유 중 정보 ===== */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>공유 중 정보</h2>
          <div className={styles.list}>
            {sharing.map((info) => (
              <SharedInfoCard key={info.id} info={info} variant="sharing" onToggle={handleToggle} />
            ))}
          </div>
          {hasWithdrawn && <p className={styles.notice}>철회는 즉시 반영돼요. 같은 요청 안에서는 다시 허용할 수 있어요</p>}
        </section>

        {/* ===== 받은 정보 ===== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>받은 정보</h2>
            <span className={styles.hint}>조회만</span>
          </div>

          {received.length === 0 ? (
            /* 받은 정보 없을 때 */
            <>
              <div className={styles.empty}>
                <img src={iconDocument} alt="" width={16} height={16} />
                <p className={styles.emptyText}>받은 정보 없음</p>
              </div>
              <p className={styles.emptyBar}>{name}님이 아직 공유한 정보가 없어요.</p>
            </>
          ) : (
            <div className={styles.list}>
              {received.map((info) => (
                <SharedInfoCard key={info.id} info={info} variant="received" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AcquaintanceShared;