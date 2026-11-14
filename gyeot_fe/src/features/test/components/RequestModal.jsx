import Modal from "react-modal";
import styles from "@/features/test/components/RequestModal.module.css";

// 사유별 태그 · 안내 문구 설정 (키는 API의 reason 값과 동일)
// 이름 뒤 조사/위치가 사유마다 달라서 message는 이름을 받아 문장을 만드는 함수로 둠
const REQUEST_MODAL_CONFIG = {
  UNAVAILABLE: {
    tag: "어려움",
    message: (name) => `${name}님이 이번 요청은 어렵다고 응답하셨어요.`,
  },
  ACCEPTANCE_WITHDRAWN: {
    tag: "어려움",
    message: (name) => `${name}님이 요청이 어렵다고 응답을 수정하셨어요.`,
  },
  DEADLINE_PASSED: {
    tag: "기한 초과",
    message: (name) => `${name}님이 기한 내에 응답하지 않았어요.`,
  },
  RELATIONSHIP_ENDED: {
    tag: "관계 해제",
    message: (name) => `${name}님과 관계가 해제되어 요청할 수 없어요.`,
  },
  PARTICIPANT_LEFT: {
    tag: "상황 이탈",
    message: (name) => `${name}님이 상황에서 제외되어 요청할 수 없어요.`,
  },
  USER_WITHDRAWN: {
    tag: "탈퇴",
    message: (name) => `지금은 ${name}님께 요청이 불가능해요.`,
  },
};

/**
 * 요청 관련 정보를 보여주는 모달 컴포넌트 (M-01 담당자 없음)
 * @param {boolean} modalOpen - 모달의 열림/닫힘 상태 여부
 * @param {Object} modalItem - 모달에 표시할 데이터 객체
 * @param {string} modalItem.userName - 응답 대상 (사용자명)
 * @param {string} modalItem.request - 요청 내용
 * @param {string} modalItem.state - 담당자 없음 사유 (REQUEST_MODAL_CONFIG의 키)
 * @param {string} modalItem.time - 요청 시간
 * @param {string} modalItem.location - 요청 장소
 * @param {number} currentNumber - 현재 모달 순번 (1부터 시작)
 * @param {number} totalCount - 전체 모달 개수
 * @param {() => void} onCancelClick - 취소(닫기) 버튼 클릭 시 실행할 함수
 * @param {() => void} onConfirmClick - 확인(다른 사람) 버튼 클릭 시 실행할 함수
 */

function RequestModal({
  modalOpen,
  modalItem,
  currentNumber,
  totalCount,
  onCancelClick,
  onConfirmClick,
}) {
  // 현재 사유의 설정 (정의되지 않은 사유면 모달을 그리지 않음)
  const config = REQUEST_MODAL_CONFIG[modalItem.state];
  if (!config) return null;

  return (
    // 모달 (react-modal 라이브러리 사용)
    <Modal
      isOpen={modalOpen}
      onRequestClose={onCancelClick}
      overlayClassName={styles.overlayContent}
      className={styles.modalContent}
      ariaHideApp={false}
    >
      {/* 우측 상단 순번 뱃지 (예: 1/3) */}
      <span className={`${styles.badge} typoCaptionMedium`}>
        {currentNumber}/{totalCount}
      </span>

      {/* 모달 제목 (title) */}
      <span className={`${styles.modalTitle} typoBodyStrong`}>담당자 없음</span>

      {/* 요청 대상의 응답 내용 Card */}
      <section className={styles.resCard}>
        {/* [좌측] 사용자 프로필 */}
        <article className={styles.profile}>
          <div className={styles.userImg} />
          <span className="typoCaptionMedium">{modalItem.userName}</span>
        </article>

        {/* [우측] 응답 내용 텍스트 Container*/}
        <article className={styles.resContainer}>
          {/* 요청 + 응답 내용 */}
          <div className={styles.resMainTxt}>
            <span className="typoBodyStrong">{modalItem.request}</span>
            <div className={`${styles.tag} typoCaptionMedium`}>{config.tag}</div>
          </div>

          {/* 시간 + 장소 */}
          <div className={styles.resSubTxt}>
            <span className="typoBodySmall">{modalItem.time}</span>
            <div className={styles.pointIcon}>
              <div className={styles.ellipse} />
            </div>
            <span className="typoBodySmall">{modalItem.location}</span>
          </div>
        </article>
      </section>

      {/* 모달의 설명 텍스트 */}
      <span className={`${styles.infoTxt} typoBodySmall`}>
        {config.message(modalItem.userName)}
        <br />
        다른 사람에게 요청할까요?
      </span>

      {/* 모달의 하단 버튼 Section */}
      <section className={styles.btnContainer}>
        {/* [닫기] 버튼 */}
        <button
          onClick={onCancelClick}
          className={`${styles.modalBtn} ${styles.cancelBtn} typoBodySmall`}
        >
          닫기
        </button>

        {/* [다른 사람] 버튼 */}
        <button
          onClick={onConfirmClick}
          className={`${styles.modalBtn} ${styles.confirmBtn} typoBodySmall`}
        >
          다른 사람
        </button>
      </section>
    </Modal>
  );
}

export default RequestModal;
