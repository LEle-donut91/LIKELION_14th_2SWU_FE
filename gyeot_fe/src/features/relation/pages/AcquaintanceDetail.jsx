// R-02

import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubpageHeader from "@/shared/components/subpage-header/SubpageHeader"; // 팀 공통 서브 헤더
import { MOCK_RELATION } from "@/features/relation/constants/relation";
import iconEdit from "@/shared/assets/icons/iconEdit.svg";
import iconDocument from "@/shared/assets/icons/iconDocument.svg";
import iconRight from "@/shared/assets/icons/iconRight.svg";
import styles from "./AcquaintanceDetail.module.css";

// R-00에서 넘겨준 id로 사람 찾기 (TODO: API 연결 후 교체)
function findPerson(id) {
  const guardian = MOCK_RELATION.guardians.find((g) => g.id === id);
  if (guardian) return { ...guardian, type: "GUARDIAN", label: guardian.label ?? "" };

  const myPerson = MOCK_RELATION.myPeople.find((p) => p.id === id);
  if (myPerson) return { ...myPerson, type: "MY_PERSON", label: myPerson.relation ?? "" };

  // 주소로 바로 들어온 경우 (화면 확인용으로 첫 번째 나의 사람 보여주기)
  const first = MOCK_RELATION.myPeople[0];
  return { ...first, type: "MY_PERSON", label: first.relation ?? "" };
}

function AcquaintanceDetail() {
  const navigate = useNavigate();
  const { state } = useLocation(); // R-00에서 넘겨준 { id }
  const person = findPerson(state?.id);
  const isGuardian = person.type === "GUARDIAN"; // 서로의 보호자인지

  const [label, setLabel] = useState(person.label); // 관계 형태 (나만 보이는 라벨)
  const labelInputRef = useRef(null);

  // 라벨 저장 (TODO: 라벨 수정 API 연결)
  const handleLabelSave = () => {
    console.log("라벨 저장", person.id, label.trim());
  };

  return (
    <div className={styles.page}>
      {/* 상단 헤더 (제목은 디자인 확인 후 수정) */}
      <SubpageHeader title="" />

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

        {/* 이 사람과 공유 중인 정보 (R-02-01로 이동) */}
        <button
          type="button"
          className={styles.sharedCard}
          onClick={() => navigate("/relation/acquaintance-shared", { state: { id: person.id } })}
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

        {/* 관계 해제 (N-08로 이동) */}
        <button
          type="button"
          className={styles.releaseBtn}
          onClick={() => navigate("/relation/release", { state: { id: person.id } })}
        >
          관계 해제
        </button>
      </div>
    </div>
  );
}

export default AcquaintanceDetail;