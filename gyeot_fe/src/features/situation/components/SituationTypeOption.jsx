import styles from "@/features/situation/components/SituationTypeOption.module.css";
import iconRadioOff from "@/shared/assets/icons/iconRadioOff.svg";
import iconRadioOn from "@/shared/assets/icons/iconRadioOn.svg";
import {
  SITUATION_TYPE_ETC_MAX_LENGTH,
  SITUATION_TYPE_OPTIONS,
} from "@/features/situation/constants/situationConstants";

/**
 * H-01-01 종류 선택 시트 안의 라디오 목록
 * - value    : { type, etcText } (type은 SITUATION_TYPE_OPTIONS의 key)
 * - onChange : 선택/입력이 바뀔 때마다 새 value 전달
 * - '기타'를 고르면 카드 안에 직접 입력칸이 열림
 */
function SituationTypeOption({ value, onChange }) {
  const { type, etcText = "" } = value ?? {};

  const handleTypeSelect = (key) => {
    onChange({ type: key, etcText });
  };

  const handleEtcTextChange = (e) => {
    onChange({ type, etcText: e.target.value });
  };

  return (
    <div className={styles.optionList}>
      {SITUATION_TYPE_OPTIONS.map(({ key, label, description }) => {
        const isSelected = type === key;
        const isEtcOpen = isSelected && key === "ETC";

        return (
          <div
            key={key}
            className={`${styles.optionItem} ${isSelected ? styles.selected : ""}`}
          >
            <label className={styles.optionLabel}>
              <input
                type="radio"
                className={styles.optionInput}
                name="situationTypeGroup"
                checked={isSelected}
                onChange={() => handleTypeSelect(key)}
              />
              <span className={styles.txtContainer}>
                <span className="typoBodyStrong">{label}</span>
                <span className="typoCaptionMedium">{description}</span>
              </span>
              <img
                className={isSelected ? styles.radioOnImg : styles.radioOffImg}
                src={isSelected ? iconRadioOn : iconRadioOff}
                alt=""
              />
            </label>

            {isEtcOpen && (
              <div className={styles.etcInputContainer}>
                <input
                  type="text"
                  className={`${styles.etcInput} typoBodyMedium`}
                  placeholder="예) 이사, 시험 기간"
                  maxLength={SITUATION_TYPE_ETC_MAX_LENGTH}
                  value={etcText}
                  onChange={handleEtcTextChange}
                />
                <span className={`${styles.etcCount} typoCaptionMedium`}>
                  {etcText.length} / {SITUATION_TYPE_ETC_MAX_LENGTH}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SituationTypeOption;
