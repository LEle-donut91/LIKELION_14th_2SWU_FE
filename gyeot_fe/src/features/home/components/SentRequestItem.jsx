import RequestItem from "@/features/home/components/RequestItem";
import {
  formatDateTime,
  getRemainingText,
} from "@/shared/utils/dateFormat";

// 보낸 요청 (sendlist) - 프로필 없음, 태그 beige-500
// - 응답 기한(deadline)이 없으면(null) 남은 시간 태그를 숨김
function SentRequestItem({ request, onClick }) {
  const { receiverName, typeName, dateTime, deadline } = request;

  return (
    <RequestItem
      title={`To. ${receiverName}`}
      tagText={deadline ? getRemainingText(deadline) : null}
      tagVariant="sent"
      dataItems={[formatDateTime(dateTime), `${typeName} 요청`]}
      onClick={onClick}
    />
  );
}

export default SentRequestItem;