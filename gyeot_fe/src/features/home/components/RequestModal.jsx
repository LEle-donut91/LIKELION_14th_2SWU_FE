import Modal from "react-modal";
import styles from "@/features/home/components/RequestModal.module.css";
import { NO_ASSIGNEE_MODAL_CONFIG } from "@/features/home/constants/homeConstants";

/**
 * 요청 관련 정보를 보여주는 모달 컴포넌트 (M-01 담당자 없음)
 * - 데이터는 noAssigneeNoticeService가 만든 값을 사용
 * - 바깥 영역 클릭·ESC로는 닫히지 않음 (닫기 기록이 의도치 않게 남지 않도록 버튼으로만 닫음)
 * @param {boolean} modalOpen - 모달의 열림/닫힘 상태 여부
 * @param {Object} modalItem - 모달에 표시할 데이터 객체
 * @param {string} modalItem.userName - 응답 대상 (사용자명)
 * @param {string} modalItem.request - 요청 내용
 * @param {string} modalItem.state - 담당자 없음 사유 (NO_ASSIGNEE_MODAL_CONFIG의 키)
 * @param {string | null} modalItem.time - 요청 시간 (급한 요청은 null → 시간·점 숨김)
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
  // 현재 사유의 설정 (정의되지 않은 사유는 service에서 제외되지만, 대비로 그리지 않음)
  const config = NO_ASSIGNEE_MODAL_CONFIG[modalItem.state];
  if (!config) return null;

  return (
    // 모달 (react-modal 라이브러리 사용)
    <Modal
      isOpen={modalOpen}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
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

          {/* 시간 + 장소 (시간이 없으면 시간·점을 숨기고 장소만) */}
          <div className={styles.resSubTxt}>
            {modalItem.time && (
              <>
                <span className="typoBodySmall">{modalItem.time}</span>
                <div className={styles.pointIcon}>
                  <div className={styles.ellipse} />
                </div>
              </>
            )}
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
          type="button"
          onClick={onCancelClick}
          className={`${styles.modalBtn} ${styles.cancelBtn} typoBodySmall`}
        >
          닫기
        </button>

        {/* [다른 사람] 버튼 */}
        <button
          type="button"
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
