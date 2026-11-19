import RequestItem from "@/features/home/components/RequestItem";
import {
  formatDateTime,
  getRemainingText,
} from "@/shared/utils/dateFormat";

// 응답이 필요한 요청 (니드 리스트)
// - 응답 기한(deadline)이 없으면(null) 남은 시간 태그를 숨김
function ReceivedRequestItem({ request, onClick }) {
  const { requester, typeName, dateTime, location, deadline } = request;

  return (
    <RequestItem
      profile={{ name: requester.name, imageUrl: requester.profileImageUrl }}
      title={`${typeName} 요청`}
      tagText={deadline ? getRemainingText(deadline) : null}
      tagVariant="received"
      dataItems={[formatDateTime(dateTime), location]}
      onClick={onClick}
    />
  );
}

export default ReceivedRequestItem;