import RequestItem from "@/features/home/components/RequestItem";
import { REQUEST_TAG_TEXT } from "@/features/home/constants/homeConstants";
import {
  formatDateTime,
  getRemainingText,
} from "@/shared/utils/dateFormat";

// 응답 기한 태그 문구
// - 기한 전: 남은 시간 (getRemainingText)
// - 기한 후: '기한 지남'. 일반 요청은 기한이 지나도 시작 전이면 응답할 수 있어 목록에 남는다 (서버 기준)
//   공통 getRemainingText의 '기한 만료'는 응답할 수 없는 것처럼 읽혀 여기서는 쓰지 않는다
//   (판단 기준은 getRemainingText와 같은 '남은 분 0 이하')
// - 기한이 없으면(null) 태그 없음
const getDeadlineTagText = (deadline) => {
  if (!deadline) return null;

  const remainingMinutes = Math.floor((new Date(deadline) - new Date()) / 60000);
  return remainingMinutes <= 0
    ? REQUEST_TAG_TEXT.DEADLINE_PASSED
    : getRemainingText(deadline);
};

// 응답이 필요한 요청 (니드 리스트)
// - 태그: [응답 기한] [재확인] 순서, 같은 색 (재확인 요청만 재확인 태그)
// - 일시 · 장소가 없으면(null) 해당 값과 구분 점을 숨김
function ReceivedRequestItem({ request, onClick }) {
  const {
    requesterName,
    typeName,
    dateTime,
    location,
    deadline,
    isReconfirmation,
  } = request;

  return (
    <RequestItem
      profile={{ name: requesterName }}
      title={`${typeName} 요청`}
      tagTextList={[
        getDeadlineTagText(deadline),
        isReconfirmation ? REQUEST_TAG_TEXT.RECONFIRMATION : null,
      ]}
      tagVariant="received"
      dataItems={[dateTime ? formatDateTime(dateTime) : null, location]}
      onClick={onClick}
    />
  );
}

export default ReceivedRequestItem;