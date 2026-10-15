// H-03-02
import styles from "@/features/request/pages/Request.module.css";

import StepHeader from "@/features/request/components/Header/StepHeader";
import LargeFooter from "@/features/request/components/Footer/LargeFooter";
import RadioSection from "@/features/request/components/Section/RadioSection";
import SelectSection from "@/features/request/components/Section/SelectSection";
import InputSection from "@/features/request/components/Section/InputSection";

function Request() {
  return (
    <div className="page">
      {/* 헤더 */}
      <StepHeader title="요청 작성" step="1" />

      {/* 메인 컨텐츠 */}
      <main>
        {/* 상황 */}
        <SelectSection
          title="상황 *"
          text="무릎 수술 회복"
          border="borderActive"
          width="large"
        />

        {/* 도움 종류 */}
        <RadioSection />

        {/* 시작 - 종료 */}
        <div className={styles.timeSectionContainer}>
          <SelectSection
            title="시작 *"
            text="선택"
            border="borderDefault"
            width="small"
          />
          <SelectSection
            title="종료 *"
            text="선택"
            border="borderDefault"
            width="small"
          />
        </div>

        {/* 장소 */}
        <InputSection title="장소 *" size="small" />

        {/* 부탁 내용 */}
        <InputSection title="부탁 내용" size="large" />

        {/* 요청 대상 */}
        <SelectSection
          title="요청 대상 *"
          text="한 명 선택"
          border="borderDefault"
          width="large"
        />

        {/* 응답 기한 */}
        <SelectSection
          title="응답 기한 *"
          text="24시간 (기본)"
          border="borderActive"
          width="large"
        />
      </main>

      {/* 하단 Footer(버튼) */}
      <LargeFooter title="다음" type="primary" />
    </div>
  );
}

export default Request;
