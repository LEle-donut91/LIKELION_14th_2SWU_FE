import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import styles from "@/features/request/components/Sheet/DueDateSheet.module.css";

function DueDateSheet({ isOpen, onClose, onConfirm }) {
  // 임시 입력 상태 (일, 시간, 분)
  const [inputValues, setInputValues] = useState({
    days: "",
    hours: "",
    minutes: "",
  });

  // 확인 버튼 클릭 시 실행
  const handleConfirmClick = () => {
    onConfirm(inputValues);
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header />
        <Sheet.Content className={styles.sheetContent}>
          <div className={styles.optionList}>
            {/* 응답기한 형태 (일, 시간, 분) */}
            <DateTimeOption 
              type="dueDate" 
              title="응답 기한" 
              value={inputValues}
              onChange={setInputValues}
            />
          </div>

          {/* 하단 확인 버튼 */}
          <button className={styles.footerBtn} onClick={handleConfirmClick}>
            <span className={`${styles.btnTxt} typoBodyStrong`}>확인</span>
          </button>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onClick={onClose} />
    </Sheet>
  );
}

export default DueDateSheet;
