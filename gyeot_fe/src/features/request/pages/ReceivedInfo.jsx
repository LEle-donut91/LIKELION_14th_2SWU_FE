// H-03-01-01
import styles from "@/features/request/pages/ReceivedInfo.module.css";
import ExitHeader from "@/features/request/components/Header/ExitHeader";
import { useRequestNav } from "@/features/request//hooks/useRequestNav";
import SafetyCardDetail from "@/features/request/components/SafetyCard/SafetyCardDetail";
import DueDateState from "@/features/request/components/State/DueDateState";

function ReceivedInfo() {
  const { handleGoBack } = useRequestNav();

  return (
    <div className={styles.page}>
      <ExitHeader title="전달받은 정보" onClick={handleGoBack} />

      <main className={styles.content}>
        <DueDateState
          isResponse={false}
          title="접근 기한"
          dueDate={`~ 00/00 00:00 (종료 시점)`}
        />
        <SafetyCardDetail
          title="기본 정보"
          cardList={[
            {
              cardTitle: "생년월일",
              isSensitive: false,
              firstInfo: "2000년 00월 00일",
            },
          ]}
        />
        <SafetyCardDetail
          title="건강 정보"
          cardList={[
            {
              cardTitle: "페니실린 알러지",
              isSensitive: true,
              firstInfo: "2000년 00월 00일",
              secondInfo: "9/20 갱신",
            },
            {
              cardTitle: "어지러움 주의사항",
              isSensitive: false,
              firstInfo: "앉아서 휴식 필요",
              secondInfo: "추가됨",
            },
          ]}
        />
        <SafetyCardDetail
          title="생활 정보"
          cardList={[
            {
              cardTitle: "반려동물 나롱이",
              isSensitive: false,
              firstInfo: "하루에 3번 끼니 제공",
              secondInfo: "9/20 갱신",
            },
          ]}
        />
        <SafetyCardDetail
          title="미리 남기는 말"
          cardList={[
            {
              cardTitle: "선호",
              isSensitive: false,
              firstInfo: "내용 값",
              secondInfo: "9/20 갱신",
            },
            {
              cardTitle: "문서",
              isSensitive: false,
              firstInfo: "내용 값",
              secondInfo: "9/20 갱신",
            },
          ]}
        />
      </main>
    </div>
  );
}

export default ReceivedInfo;
