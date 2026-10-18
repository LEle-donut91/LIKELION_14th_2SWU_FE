import RequestItem from "@/features/home/components/RequestItem";
import {
  formatDateTime,
  getRemainingText,
} from "@/features/home/utils/homeFormat";

// 응답이 필요한 요청 (니드 리스트)
function ReceivedRequestItem({ request, onClick }) {
  const { requester, typeName, dateTime, location, deadline } = request;

  return (
    <RequestItem
      profile={{ name: requester.name, imageUrl: requester.profileImageUrl }}
      title={`${typeName} 요청`}
      tagText={getRemainingText(deadline)}
      tagVariant="received"
      dataItems={[formatDateTime(dateTime), location]}
      onClick={onClick}
    />
  );
}

export default ReceivedRequestItem;
