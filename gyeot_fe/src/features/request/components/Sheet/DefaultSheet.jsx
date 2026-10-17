import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import styles from "@/features/request/components/Sheet/DefaultSheet.module.css";

/**
 * 라디오 + 체크박스 선택용 바텀시트
 *
 * - title / description : 상단 안내 문구
 * - value               : 부모가 가진 실제 선택 값(id) (시트가 열릴 때마다 임시 상태로 복사됨)
 * - onConfirm           : [확인] 클릭 시 임시 선택 값을 부모에게 전달
 * - children            : (tempValue, setTempValue) => ReactNode
 *                         시트 안에 들어갈 SituationOption / UserOption 등을 부모 컴포넌트에서 직접 주입
 */
function DefaultSheet({
  isOpen,
  onClose,
  title,
  description,
  value,
  onConfirm,
  children,
}) {
  // 부모의 실제 상태와 분리하여 시트 내부에서 관리할 임시 상태
  const [tempValue, setTempValue] = useState(value);

  // 시트가 열리는 순간마다 부모의 최신 값으로 임시 상태 동기화
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setTempValue(value);
  }

  // [확인] 버튼을 눌렀을 때만 부모로 값 전달 및 시트 닫기
  const handleConfirm = () => {
    onConfirm?.(tempValue);
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header />
        <Sheet.Content className={styles.sheetContent}>
          {/* 실제로 보여줄 컨텐츠를 넣을 곳 */}

          {/* 상단 설명 */}
          <div className={styles.txtContainer}>
            <span className="typoTitleMedium">{title}</span>
            <span className="typoCaptionMedium">{description}</span>
          </div>

          {/* 주입된 Option 영역 */}
          <div>{children(tempValue, setTempValue)}</div>

          {/* 하단 확인 버튼 */}
          <button className={styles.footerBtn} onClick={handleConfirm}>
            <span className={`${styles.btnTxt} typoBodyStrong`}>확인</span>
          </button>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onClick={onClose} />
    </Sheet>
  );
}

export default DefaultSheet;
