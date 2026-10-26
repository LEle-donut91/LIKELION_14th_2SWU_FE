import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestModal from "@/features/test/components/RequestModal";
import requestModalData from "@/features/test/api/requestModalData";

function ModalTest() {
  // 모달 전체의 오픈 여부 상태
  // requestModalData가 있으면 useState(true), 없으면 useState(false)
  const [isModalOpen, setModalOpen] = useState(Boolean(requestModalData));

  // 현재 몇 번째 모달을 보고 있는지 추적하는 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 보여줄 모달 Item
  const currentModalItem = requestModalData?.[currentIndex];

  // useNavigate 사용
  const navigate = useNavigate();

  // 모달의 cancel(닫기) 버튼 클릭 이벤트 핸들러
  const handleCancelModal = () => {
    if (currentIndex < requestModalData.length - 1) {
      // 다음 데이터가 있으면 인덱스 증가 (다음 모달로 넘어감)
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 마지막 모달까지 다 확인했으면 모달 닫기
      setModalOpen(false);
    }
  };

  // 모달의 confirm(다른 사람) 버튼 클릭 이벤트 핸들러
  const handleConfirmModal = () => {
    // 페이지 이동 (현재 요청 ID를 path parameter로 넘겨줌)
    navigate(`/request/ask-again/${currentModalItem.id}`);
  };

  return (
    <>
      {/* 데이터가 존재할 때만 RequestModal을 렌더링 */}
      {requestModalData && currentModalItem && (
        <RequestModal
          modalOpen={isModalOpen}
          modalItem={currentModalItem}
          onCancelClick={handleCancelModal}
          onConfirmClick={handleConfirmModal}
        />
      )}
    </>
  );
}

export default ModalTest;
