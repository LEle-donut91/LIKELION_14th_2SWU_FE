import unchecked from "@/features/request/assets/unchecked.svg";
import checked from "@/features/request/assets/checked.svg";
import styles from "@/features/request/components/Option/CheckOption.module.css";

function CheckOption({
  data = [], // 안심카드 정보 목록 [{ id, title, description }, ...]
  checkedValue, // 현재 전체 그룹에서 체크된 체크박스 버튼의 ID 배열
  onChecked, // 체크박스 버튼 선택 시 체크된 ID를 전달하는 콜백 함수
}) {
  return (
    <div className={styles.optionList}>
      {data.map(({ id, title, description }) => {
        // 현재 항목의 ID가 배열(체크된 항목의 ID를 담은 배열)에 포함되어있는지 확인
        const isChecked = checkedValue.includes(id);

        // 체크 시 배열에 추가하거나 제거하는 토글 로직 구현
        const handleToggle = () => {
          if (isChecked) {
            // 이미 있으면 제거 (체크 해제)
            onChecked(checkedValue.filter((item) => item !== id));
          } else {
            // 없으면 추가 (체크)
            onChecked([...checkedValue, id]);
          }
        };

        return (
          <label key={id} className={styles.optionItem}>
            <input
              type="checkbox"
              id={id}
              className={styles.optionInput}
              name="checkOptionGroup" // 동일한 name으로 하나의 그룹으로 묶음 (중복 선택 방지)
              checked={isChecked}
              onChange={handleToggle}
            />
            <div className={styles.txtContainer}>
              <span
                className={`${isChecked ? styles.checkedTitle : styles.uncheckedTitle} typoBodyStrong`}
              >
                {title}
              </span>
              <span className={`${styles.description} typoCaptionMedium`}>
                {description}
              </span>
            </div>

            <div className={styles.imgContainer}>
              <img src={isChecked ? checked : unchecked} />
            </div>
          </label>
        );
      })}
    </div>
  );
}

export default CheckOption;
