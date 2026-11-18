import styles from "./ReleaseSheet.module.css";

// 안내 박스 앞 (i) 아이콘
function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.2v3.6" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 관계 유형별 안내 문구
function getContent(type, name) {
  if (type === "GUARDIAN") {
    return {
      title: `${name}님과의 보호자 관계를 해제할까요?`,
      points: [
        <>
          <b>양방향으로 완전히 종료</b>돼요
        </>,
        <>양쪽에서 공유 중인 정보 접근이 모두 회수돼요</>,
        <>
          나의 사람으로 <b>자동 복귀하지 않아요</b>
        </>,
      ],
      info: <>서로의 연락 순서와 상황에서 빠지고, 서로 맡고 있던 요청은 다시 부탁해야 해요.</>,
    };
  }

  return {
    title: `${name}님과의 관계를 해제할까요?`,
    points: [
      <>내가 {name}님을 등록한 관계만 끝나요 (상대 → 나 관계는 유지)</>,
      <>
        내가 요청을 통해 공유한 정보 접근은 <b>즉시 회수</b>돼요
      </>,
      <>상대에게 따로 알리지 않아요</>,
    ],
    info: (
      <>
        {name}님이 내 요청을 담당 중이면 <b>수락 철회처럼 처리</b>되고, 내가 만든 상황에서 제외돼요
      </>
    ),
  };
}

/**
 * 관계 해제 확인 바텀 시트 (N-08)
 * @param {boolean}  isOpen     열림 여부
 * @param {string}   type       "GUARDIAN" 서로의 보호자 / "MY_PERSON" 나의 사람
 * @param {string}   name       상대 이름
 * @param {Function} onCancel   취소 / 바깥 클릭 시 동작
 * @param {Function} onConfirm  해제하기 클릭 시 동작
 */
function ReleaseSheet({ isOpen, type, name, onCancel, onConfirm }) {
  if (!isOpen) return null; // 닫혀 있으면 아무것도 그리지 않음

  const content = getContent(type, name);

  return (
    // 어두운 배경 (바깥 클릭 시 닫기)
    <div className={styles.overlay} onClick={onCancel}>
      {/* 아래에서 올라오는 흰 시트 (안쪽 클릭은 닫히지 않게) */}
      <div className={styles.sheet} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <span className={styles.handle} /> {/* 위쪽 손잡이 */}

        <h2 className={styles.title}>{content.title}</h2>

        {/* 해제하면 일어나는 일 */}
        <ul className={styles.points}>
          {content.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        {/* 추가 안내 */}
        <div className={styles.info}>
          <InfoIcon />
          <p>{content.info}</p>
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            취소
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            해제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReleaseSheet;