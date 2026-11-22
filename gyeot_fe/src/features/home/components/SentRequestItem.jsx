import RequestItem from "@/features/home/components/RequestItem";
import {
  EMPTY_NAME_TEXT,
  REQUEST_TAG_TEXT,
} from "@/features/home/constants/homeConstants";
import {
  formatDateTime,
  getRemainingText,
} from "@/shared/utils/dateFormat";

// 보낸 요청 (sendlist) - 프로필 없음, 태그 beige-500
// - 담당자 없음: 제목 "To. -", 태그 '담당자 없음' (디자인 합의)
// - 응답 대기: 제목 "To. 이름"(이름이 없으면 "-"), 태그는 응답 기한까지 남은 시간 (기한이 없으면 숨김)
// - 일시가 없으면(null) 일시와 구분 점을 숨김
function SentRequestItem({ request, onClick }) {
  const { receiverName, typeName, dateTime, deadline, isNoAssignee } = request;

  const titleName = isNoAssignee
    ? EMPTY_NAME_TEXT
    : (receiverName ?? EMPTY_NAME_TEXT);

  let tagText = null;
  if (isNoAssignee) {
    tagText = REQUEST_TAG_TEXT.NO_ASSIGNEE;
  } else if (deadline) {
    tagText = getRemainingText(deadline);
  }

  return (
    <RequestItem
      title={`To. ${titleName}`}
      tagTextList={[tagText]}
      tagVariant="sent"
      dataItems={[dateTime ? formatDateTime(dateTime) : null, `${typeName} 요청`]}
      onClick={onClick}
    />
  );
}

export default SentRequestItem;