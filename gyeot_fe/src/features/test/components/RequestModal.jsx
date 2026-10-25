import Modal from "react-modal";
import styles from "@/features/test/components/RequestModal.module.css";

/**
 * 요청 관련 정보를 보여주는 모달 컴포넌트
 * @param {boolean} modalOpen - 모달의 열림/닫힘 상태 여부
 * @param {Object} modalItem - 모달에 표시할 데이터 객체
 * @param {string} modalItem.userName - 응답 대상 (사용자명)
 * @param {string} modalItem.request - 요청 내용
 * @param {string} modalItem.state - 요청 상태 코드 ("DIFFICULT" 또는 "EXPIRED")
 * @param {string} modalItem.time - 요청 시간
 * @param {string} modalItem.location - 요청 장소
 * @param {() => void} onCancelClick - 취소(닫기) 버튼 클릭 시 실행할 함수
 * @param {() => void} onConfirmClick - 확인(다른 사람) 버튼 클릭 시 실행할 함수
 */

function RequestModal({ modalOpen, modalItem, onCancelClick, onConfirmClick }) {
  // 모달 텍스트 설정 매핑 객체
  const REQUEST_MODAL_CONFIG = {
    DIFFICULT: {
      state: "어려움",
      information: "이번 요청은 어렵다고 응답하셨어요.",
    },
    EXPIRED: {
      state: "기한 초과",
      information: "기한 내에 응답하지 않았어요.",
    },
  };

  return (
    // 모달 (react-modal 라이브러리 사용)
    <Modal
      isOpen={modalOpen}
      onRequestClose={onCancelClick}
      overlayClassName={styles.overlayContent}
      className={styles.modalContent}
      ariaHideApp={false}
    >
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
            <div className={`${styles.tag} typoCaptionMedium`}>
              {REQUEST_MODAL_CONFIG[modalItem.state].state}
            </div>
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
        {modalItem.userName}님이{" "}
        {REQUEST_MODAL_CONFIG[modalItem.state].information}
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
