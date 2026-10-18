import RequestItem from "@/features/home/components/RequestItem";
import {
  formatDateTime,
  getRemainingText,
} from "@/features/home/utils/homeFormat";

// 보낸 요청 (sendlist) - 프로필 없음, 태그 beige-500
function SentRequestItem({ request, onClick }) {
  const { receiverName, typeName, dateTime, deadline } = request;

  return (
    <RequestItem
      title={`To. ${receiverName}`}
      tagText={getRemainingText(deadline)}
      tagVariant="sent"
      dataItems={[formatDateTime(dateTime), `${typeName} 요청`]}
      onClick={onClick}
    />
  );
}

export default SentRequestItem;
