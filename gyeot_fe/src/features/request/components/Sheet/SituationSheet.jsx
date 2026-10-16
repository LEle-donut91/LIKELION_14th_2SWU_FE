import { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import SituationOption from "@/features/request/components/Option/SituationOption";
import styles from "@/features/request/components/Sheet/SituationSheet.module.css";

function SituationSheet({ isOpen, onClose, data, selectedId, onSelect }) {
  // 부모의 실제 상태와 분리하여 시트 내부에서 관리할 임시 상태 생성
  const [tempSelectedId, setTempSelectedId] = useState(selectedId);

  // 시트가 열릴 때마다 부모의 최신 값으로 임시 상태 동기화
  useEffect(() => {
    if (isOpen) {
      setTempSelectedId(selectedId);
    }
  }, [isOpen, selectedId]);

  // 옵션을 선택해도 부모를 바로 바꾸지 않고 내부 임시 상태만 변경
  const handleOptionSelect = (id) => {
    setTempSelectedId(id);
  };

  // [확인] 버튼을 눌렀을 때만 부모로 값 전달 및 시트 닫기
  const handleConfirm = () => {
    onSelect(tempSelectedId); // 최종 선택된 값을 부모에 전달
    onClose();                // 시트 닫기
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header />
        <Sheet.Content className={styles.sheetContent}>
          {/* 실제로 보여줄 컨텐츠를 넣을 곳 */}

          {/* 상단 설명 */}
          <div className={styles.txtContainer}>
            <span className="typoTitleMedium">상황</span>
            <span className="typoCaptionMedium">
              상황에 참여한 사람들에게만 요청을 보낼 수 있어요.
            </span>
          </div>

          {/* 상황 선택 옵션(라디오 버튼) 나열 */}
          <div className={styles.optionList}>
            {data.map((item) => (
              <SituationOption
                key={item.id}
                id={item.id}
                title={item.title}
                startDate={item.startDate}
                endDate={item.endDate}
                joinCount={item.joinCount}
                selectedValue={tempSelectedId} // 내부 임시 상태 연결
                onSelect={handleOptionSelect}   // 내부 임시 상태 변경 함수 연결
              />
            ))}
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

export default SituationSheet;
