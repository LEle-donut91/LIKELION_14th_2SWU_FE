import { Sheet } from "react-modal-sheet";
import DateTimeOption from "@/features/request/components/Option/DateTimeOption";
import styles from "@/features/request/components/Sheet/DateTimeSheet.module.css";

function DateTimeSheet({ isOpen, onClose }) {
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
            />

            {/* 시간 형태 (시, 분) */}
            <DateTimeOption
              type="time"
              title="시간"
            />
          </div>

          {/* 하단 확인 버튼 */}
          <button className={styles.footerBtn} onClick={onClose}>
            <span className={`${styles.btnTxt} typoBodyStrong`}>확인</span>
          </button>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onClick={onClose} />
    </Sheet>
  );
}

export default DateTimeSheet;
