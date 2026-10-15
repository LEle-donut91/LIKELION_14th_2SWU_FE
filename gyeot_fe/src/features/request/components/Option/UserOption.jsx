import unselectedRadio from "@/features/request/assets/unselectedRadio.svg";
import selectedRadio from "@/features/request/assets/selectedRadio.svg";
import userImg from "@/features/request/assets/userImg.svg";
import styles from "@/features/request/components/Option/UserOption.module.css";

function UserOption({
  id, // 개별 라디오 버튼을 식별하기 위한 고유 ID
  userName,
  isGuardian,
  selectedValue, // 현재 전체 그룹에서 선택된 라디오 버튼의 ID
  onSelect, // 라디오 버튼 선택 시 부모 컴포넌트에 선택된 ID를 전달하는 콜백 함수
}) {
  // 현재 항목의 고유 ID와 부모가 관리하는 선택된 값이 일치하는지 확인 (true/false)
  const isSelected = selectedValue === id;

  return (
    <label className={`${isSelected ? styles.selected : ""}`}>
      <input
        type="radio"
        id={id}
        name="userOptionGroup" // 동일한 name 속성을 부여하여 하나의 그룹으로 묶음 (중복 선택 방지)
        checked={isSelected}
        onChange={() => onSelect(id)} // 선택 시 onSelect 함수를 호출하여 부모 컴포넌트에 상태 변경 요청
      />
      <img className={styles.userImg} src={userImg}/>
      <div className={styles.txtContainer}>
        <span className={`${styles.userNameTxt} typoBodyStrong`}>
          {userName}
        </span>
        {isGuardian === "true" ? (
          <div className={styles.guardianTag}>
            <span className={`${styles.guardianTxt} typoCaptionMedium`}>보호자</span>
          </div>
        ) : (
          <></>
        )}
      </div>

      <img src={isSelected ? selectedRadio : unselectedRadio} />
    </label>
  );
}

export default UserOption;
