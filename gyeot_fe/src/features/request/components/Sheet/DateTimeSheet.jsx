import { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import styles from "@/features/request/components/Sheet/DateTimeSheet.module.css";

function DateTimeSheet({ isOpen, onClose, initialValue = {}, onConfirm }) {
  // 시트 내부에서 조작할 임시 상태
  const [tempValue, setTempValue] = useState(initialValue);

  // 시트가 열릴 때마다 부모의 최신 값으로 임시 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setTempValue(initialValue || {});
    }
  }, [isOpen, initialValue]);

  // 확인 버튼 클릭 시
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(tempValue); // 부모에게 최종 값 전달
    }
    onClose(); // 시트 닫기
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header />
        <Sheet.Content className={styles.sheetContent}>
          <div className={styles.optionList}>
            {/* 날짜 형태 (년, 월, 일) */}
            <DateTimeOption
              type="date"
              title="날짜"
              value={tempValue}
              onChange={setTempValue}
            />

            {/* 시간 형태 (시, 분) */}
            <DateTimeOption
              type="time"
              title="시간"
              value={tempValue}
              onChange={setTempValue}
            />
          </div>

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

export default DateTimeSheet;
