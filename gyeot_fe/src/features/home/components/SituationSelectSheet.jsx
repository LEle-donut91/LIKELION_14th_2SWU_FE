import { useState } from "react";
import styles from "@/features/home/components/SituationSelectSheet.module.css";
import MaskIcon from "@/features/home/components/MaskIcon";
import ActionButton from "@/features/home/components/ActionButton";
import DotSeparatedText from "@/features/home/components/DotSeparatedText";
import iconRadioOn from "@/shared/assets/icons/IconRadioOn.svg";
import iconRadioOff from "@/shared/assets/icons/IconRadioOff.svg";
import { formatDateRange } from "@/features/home/utils/homeFormat";

// 도움 요청 시 상황 선택 바텀시트 (진행 중 상황이 2개 이상일 때)
function SituationSelectSheet({ situations, onClose, onConfirm }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirmClick = () => {
    if (selectedId !== null) onConfirm(selectedId);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="situationSelectSheetTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.handle} aria-hidden="true" />

        <div className={styles.header}>
          <h2
            id="situationSelectSheetTitle"
            className={`${styles.title} typoTitleMedium`}
          >
            어떤 상황에 부탁할까요?
          </h2>
          <p className={`${styles.description} typoCaptionMedium`}>
            상황에 참여한 사람들에게만 요청을 보낼 수 있어요.
          </p>
        </div>

        <ul className={styles.optionList} role="radiogroup">
          {situations.map((situation) => {
            const isSelected = situation.id === selectedId;

            return (
              <li key={situation.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`${styles.option} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedId(situation.id)}
                >
                  <div className={styles.optionText}>
                    <strong className="typoBodyStrong">
                      {situation.title}
                    </strong>
                    <DotSeparatedText
                      className={`${styles.optionMeta} typoBodySmall`}
                      items={[
                        formatDateRange(situation.startDate, situation.endDate),
                        typeof situation.participantCount === "number" &&
                          `참여자 ${situation.participantCount}명`,
                      ]}
                    />
                  </div>
                  <MaskIcon
                    src={isSelected ? iconRadioOn : iconRadioOff}
                    size={24}
                    className={isSelected ? styles.radioOn : styles.radioOff}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <ActionButton
          variant="secondary"
          isDisabled={selectedId === null}
          onClick={handleConfirmClick}
        >
          도움 요청하기
        </ActionButton>
      </div>
    </div>
  );
}

export default SituationSelectSheet;
