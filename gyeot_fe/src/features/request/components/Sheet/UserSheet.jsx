import { Sheet } from "react-modal-sheet";
import UserOption from "@/features/request/components/Option/UserOption";
import styles from "@/features/request/components/Sheet/UserSheet.module.css";

function UserSheet({ isOpen, onClose, data, selectedId, onSelect }) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header />
        <Sheet.Content className={styles.sheetContent}>
          {/* 실제로 보여줄 컨텐츠를 넣을 곳 */}

          {/* 상단 설명 */}
          <div className={styles.txtContainer}>
            <span className="typoTitleMedium">요청 대상</span>
            <span className="typoCaptionMedium">
              상황에 참여한 사람들에게만 요청을 보낼 수 있어요.
            </span>
          </div>

          {/* 요청 대상 선택 옵션(라디오 버튼) 나열 */}
          <div className={styles.optionList}>
            {data.map((item) => (
              <UserOption
                key={item.id}
                id={item.id}
                userName={item.userName}
                isGuardian={item.isGuardian}
                selectedValue={selectedId}
                onSelect={onSelect}
              />
            ))}
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

export default UserSheet;
