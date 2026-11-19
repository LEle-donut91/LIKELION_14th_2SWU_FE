import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";
import { getInformationSummary } from "@/features/request/utils/getSafetyCardInfo";

/**
 * RequestSummary의 infoList 항목({ icon, label, value }) 생성 헬퍼
 *  - 요청 상세 / 변경 내용 확인 / 요청 수정 확인 / 다시 부탁하기에서 공통 사용
 */

// 일정(시간) 항목: 시작/종료가 모두 있을 때만 formatRange로 가공
export const buildScheduleItem = (label, startsAt, endsAt, formatRange) => ({
  icon: iconDate,
  label,
  value: startsAt && endsAt ? formatRange(startsAt, endsAt) : "",
});

// 장소 항목
export const buildPlaceItem = (place) => ({
  icon: iconLocation,
  label: "장소",
  value: place ?? "",
});

// 공개 정보 항목: [{ name }] 목록을 요약 문자열로 가공
export const buildInformationItem = (informations) => ({
  icon: iconHealthy,
  label: "정보",
  value: getInformationSummary(informations),
});
