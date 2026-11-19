export const REQUEST_QUERY_KEYS = {
  // 진행 중 상황 목록 조회 (GET)
  situations: (size = 20) => ["requestSituations", { size }],

  // 대상 후보 조회 (GET)
  targets: (situationId = null, requestId = null) => [
    "requestTargets",
    { situationId, requestId },
  ],
  
  // 공개 항목 선택지 조회 (GET)
  informationOptions: (helpType, requestId = null) => [
    "requestInformationOptions",
    { helpType, requestId },
  ],

  // 도움 요청 상세 조회 (GET)
  detail: (requestId) => ["requestDetail", String(requestId)],

  // 전달받은 정보 조회 (GET)
  receivedInfo: (requestId) => ["requestReceivedInfo", String(requestId)],
};
