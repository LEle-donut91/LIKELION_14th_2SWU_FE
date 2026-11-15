export const REQUEST_QUERY_KEYS = {
  // 1. 대상 후보 조회 (GET)
  targets: (situationId = null, requestId = null) => [
    "requestTargets", { situationId, requestId },
  ],
};
