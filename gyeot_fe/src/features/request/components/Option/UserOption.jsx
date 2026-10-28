import styles from "@/features/request/components/Option/UserOption.module.css";
import iconRadioOff from "@/shared/assets/icons/IconRadioOff.svg";
import iconRadioOn from "@/shared/assets/icons/IconRadioOn.svg";

function UserOption({
  data = [], // 요청 대상 목록 [{ id, userName, isGuardian }, ...]
  selectedValue, // 현재 전체 그룹에서 선택된 라디오 버튼의 ID
  onSelect, // 라디오 버튼 선택 시 선택된 ID를 전달하는 콜백 함수
}) {
  return (
    <div className={styles.optionList}>
      {data.map(({ id, userName, isGuardian }) => {
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
              name="userOptionGroup" // 동일한 name으로 하나의 그룹으로 묶음 (중복 선택 방지)
              checked={isSelected}
              onChange={() => onSelect(id)}
            />
            <div className={styles.userProfile} />
            <div className={styles.txtContainer}>
              <span className={`${styles.userNameTxt} typoBodyStrong`}>
                {userName}
              </span>
              {isGuardian === "true" && (
                <div className={styles.guardianTag}>
                  <span className={`${styles.guardianTxt} typoCaptionMedium`}>
                    보호자
                  </span>
                </div>
              )}
            </div>

            <img className={`${isSelected ? styles.radioOnImg : styles.radioOffImg}`} src={isSelected ? iconRadioOn : iconRadioOff} />
          </label>
        );
      })}
    </div>
  );
}

export default UserOption;
