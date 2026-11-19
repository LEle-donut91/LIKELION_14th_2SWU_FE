// R-02

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import DefaultToast from "@/shared/components/Toast/DefaultToast"; // 팀 공통 토스트
import { useToast } from "@/shared/hooks/useToast";
import ReleaseSheet from "@/features/relation/components/ReleaseSheet"; // N-08 관계 해제 확인
import { useRelationshipsQuery } from "@/features/relation/hooks/queries/useRelationshipsQuery";
import { useReleaseRelationshipMutation } from "@/features/relation/hooks/mutations/useReleaseRelationshipMutation";
import iconEdit from "@/shared/assets/icons/iconEdit.svg";
import iconDocument from "@/shared/assets/icons/iconDocument.svg";
import iconRight from "@/shared/assets/icons/iconRight.svg";
import styles from "./AcquaintanceDetail.module.css";

function AcquaintanceDetail() {
  const navigate = useNavigate();
  const { state } = useLocation(); // R-00에서 넘겨준 { id: relationshipId }
  const { data, isLoading } = useRelationshipsQuery(); // R-00과 같은 목록 (캐시 재사용)

  // 관계 목록에서 선택한 사람 찾기
  const person = [...(data?.guardians ?? []), ...(data?.myPeople ?? [])].find((p) => p.id === state?.id);

  // 목록을 다 불러왔는데 없는 관계면 (해제됨·주소로 바로 들어옴) 관계 화면으로 돌려보냄
  useEffect(() => {
    if (!isLoading && !person) {
      navigate("/relation", { replace: true });
    }
  }, [isLoading, person, navigate]);

  return (
    <div className={styles.page}>
      {/* 상단 헤더 (제목은 디자인 확인 후 수정) */}
      <SubpageHeader title="" />

      {person && <DetailContent person={person} />}
    </div>
  );
}

// 지인 상세 내용 (person을 받은 뒤에 그려서 라벨 입력 칸이 실제 값으로 시작하도록 분리)
function DetailContent({ person }) {
  const navigate = useNavigate();
  const isGuardian = person.type === "GUARDIAN"; // 서로의 보호자인지

  const [label, setLabel] = useState(person.label); // 관계 형태 (나만 보이는 라벨)
  const labelInputRef = useRef(null);
  const [isReleaseOpen, setReleaseOpen] = useState(false); // 관계 해제 확인 시트(N-08) 열림 여부
  const { toast, showToast, hideToast } = useToast(); // 실패 안내 토스트

  // 관계 해제 (DELETE /api/relationships/{relationshipId}) → 성공하면 관계 화면으로
  const { release, isReleasing } = useReleaseRelationshipMutation({
    showToast,
    onSuccess: () => navigate("/relation", { replace: true }),
  });

  // 라벨 저장 (TODO: 라벨 수정 API 생기면 연결 — 현재 명세서에 없음)
  const handleLabelSave = () => {
    console.log("라벨 저장", person.id, label.trim());
  };

  // 관계 해제 확정
  const handleRelease = () => {
    if (isReleasing) return;
    setReleaseOpen(false);
    release(person.id);
  };

  return (
    <>
      <div className={styles.content}>
        {/* 프로필 */}
        <div className={styles.profile}>
          <span className={styles.avatar}>{person.name[0]}</span>
          <h2 className={styles.name}>{person.name}</h2>

          {/* 관계 배지 */}
          <div className={styles.badges}>
            {isGuardian ? (
              <>
                <span className={styles.guardianBadge}>서로의 보호자</span>
                <span className={styles.priorityBadge}>연락 순서 {person.priority}순위</span>
              </>
            ) : (
              <span className={styles.myPersonBadge}>내가 등록한 사람</span>
            )}
          </div>
        </div>

        {/* 관계 형태 (라벨 수정) */}
        <div className={styles.card}>
          <label htmlFor="relationLabel" className={styles.label}>
            관계 형태
          </label>
          <div className={styles.inputBox}>
            <input
              id="relationLabel"
              ref={labelInputRef}
              className={styles.input}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelSave} // 입력 칸에서 벗어나면 저장
              placeholder="친구 · 연인 · 이웃 등"
              maxLength={20}
            />
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => labelInputRef.current?.focus()} // 연필 누르면 입력 칸으로 이동
              aria-label="관계 형태 수정"
            >
              <img src={iconEdit} alt="" width={16} height={16} />
            </button>
          </div>
          <p className={styles.helper}>나만 보이는 라벨 · 탭하여 수정</p>
        </div>

        {/* 이 사람과 공유 중인 정보 (R-02-01로 이동, 헤더 제목용 이름도 함께 전달) */}
        <button
          type="button"
          className={styles.sharedCard}
          onClick={() =>
            navigate("/relation/acquaintance-shared", {
              state: { id: person.id, userId: person.userId, name: person.name },
            })
          }
        >
          <span className={styles.docIcon}>
            <img src={iconDocument} alt="" width={16} height={16} />
          </span>
          <span className={styles.sharedText}>
            <span className={styles.sharedTitle}>이 사람과 공유 중인 정보</span>
            {!isGuardian && <span className={styles.sharedSub}>누구에게 · 어떤 정보를 · 언제까지</span>}
          </span>
          <img src={iconRight} alt="" width={16} height={16} />
        </button>

        {/* 관계 해제 (N-08 확인 시트 열기) */}
        <button
          type="button"
          className={styles.releaseBtn}
          onClick={() => setReleaseOpen(true)}
          disabled={isReleasing}
        >
          관계 해제
        </button>
      </div>

      {/* N-08 관계 해제 확인 시트 */}
      <ReleaseSheet
        isOpen={isReleaseOpen}
        type={person.type}
        name={person.name}
        onCancel={() => setReleaseOpen(false)}
        onConfirm={handleRelease}
      />

      {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
    </>
  );
}

export default AcquaintanceDetail;