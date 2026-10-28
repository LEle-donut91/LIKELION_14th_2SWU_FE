import iconRadioOff from "@/shared/assets/icons/IconRadioOff.svg";
import iconRadioOn from "@/shared/assets/icons/IconRadioOn.svg";
import styles from "@/features/request/components/Option/SituationOption.module.css";

function SituationOption({
  data = [], // 상황 목록 [{ id, title, startDate, endDate, joinCount }, ...]
  selectedValue, // 현재 전체 그룹에서 선택된 라디오 버튼의 ID
  onSelect, // 라디오 버튼 선택 시 선택된 ID를 전달하는 콜백 함수
}) {
  return (
    <div className={styles.optionList}>
      {data.map(({ id, title, startDate, endDate, joinCount }) => {
        // 현재 항목의 ID와 선택된 값이 일치하는지 확인
        const isSelected = selectedValue === id;

        return (
          <label
            key={id}
            className={`${styles.optionItem} ${isSelected ? styles.selected : ""}`}
          >
            <input
              type="radio"
              id={id}
              className={styles.optionInput}
              name="situationOptionGroup" // 동일한 name으로 하나의 그룹으로 묶음 (중복 선택 방지)
              checked={isSelected}
              onChange={() => onSelect(id)}
            />
            <div className={styles.txtContainer}>
              <span className="typoBodyStrong">{title}</span>
              <div className={styles.subTxtContainer}>
                <span className="typoCaptionMedium">
                  {startDate} - {endDate}
                </span>
                <div className={styles.pointContainer}>
                  <div className={styles.pointDiv}/>
                </div>
                <span className="typoCaptionMedium">참여자 {joinCount}명</span>
              </div>
            </div>

            <img className={`${isSelected ? styles.radioOnImg : styles.radioOffImg}`} src={isSelected ? iconRadioOn : iconRadioOff} />
          </label>
        );
      })}
    </div>
  );
}

export default SituationOption;
