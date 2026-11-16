import { REQUEST_ACTION } from "@/features/request/constants/enumConstants";

export const FOOTER_ACTIONS = {
  edit: REQUEST_ACTION.EDIT,
  askAgain: REQUEST_ACTION.REASSIGN,
  withdraw: REQUEST_ACTION.WITHDRAW_PROPOSAL,
  done: REQUEST_ACTION.COMPLETE,
  sameRequest: REQUEST_ACTION.DUPLICATE,
  checkChange: REQUEST_ACTION.ACCEPT_PROPOSAL,
  start: REQUEST_ACTION.START,
  pastSituation: REQUEST_ACTION.VIEW_PAST_SITUATION,
};

// 푸터 종류
export const REQUESTER_FOOTER_KEY = {
  EDIT: "edit",
  EDIT_ASK_AGAIN: "editAskAgain",
  EDIT_WITHDRAW: "editWithdraw",
  DONE: "done",
  SAME_REQUEST: "sameRequest",
};

// 푸터 설정 - action 값은 페이지의 footerActions 키와 연결
export const REQUESTER_FOOTER_CONFIG = {
  [REQUESTER_FOOTER_KEY.EDIT]: {
    size: "large",
    title: "수정",
    type: "secondary",
    action: "edit",
  },
  [REQUESTER_FOOTER_KEY.EDIT_ASK_AGAIN]: {
    size: "small",
    leftType: "secondary",
    rightType: "primary",
    leftTitle: "수정",
    rightTitle: "다른사람 요청",
    leftAction: "edit",
    rightAction: "askAgain",
  },
  [REQUESTER_FOOTER_KEY.EDIT_WITHDRAW]: {
    size: "small",
    leftType: "tertiary",
    rightType: "secondary",
    leftTitle: "수정 철회",
    rightTitle: "수정",
    leftAction: "withdraw",
    rightAction: "edit",
  },
  [REQUESTER_FOOTER_KEY.DONE]: {
    size: "large",
    title: "완료",
    type: "primary",
    action: "done",
  },
  [REQUESTER_FOOTER_KEY.SAME_REQUEST]: {
    size: "large",
    title: "같은 내용 요청",
    type: "secondary",
    action: "sameRequest",
  },
};

// 푸터 종류
export const TARGET_FOOTER_KEY = {
  RESPOND: "RESPOND", // 응답 전: [거절, 수락]
  CHANGE: "CHANGE", // 보류: [거절로 변경, 수락으로 변경]
  CHANGE_TO_ACCEPT: "CHANGE_TO_ACCEPT", // 거절: [수락으로 변경]
};

// 푸터 설정 - action 값은 페이지의 targetActions 키와 연결
export const TARGET_FOOTER_CONFIG = {
  [TARGET_FOOTER_KEY.RESPOND]: {
    size: "small",
    leftType: "secondary",
    leftTitle: "거절",
    rightTitle: "수락",
    leftAction: "refuse",
    rightAction: "accept",
  },
  [TARGET_FOOTER_KEY.CHANGE]: {
    size: "small",
    leftType: "secondary",
    leftTitle: "거절로 변경",
    rightTitle: "수락으로 변경",
    leftAction: "changeToRefuse",
    rightAction: "changeToAccept",
  },
  [TARGET_FOOTER_KEY.CHANGE_TO_ACCEPT]: {
    size: "large",
    title: "수락으로 변경",
    type: "primary",
    action: "changeToAccept",
  },
};

// 푸터 종류
export const ASSIGNEE_FOOTER_KEY = {
  CHECK_CHANGE: "checkChange",
  START: "start",
  DONE: "done",
  PAST_SITUATION: "pastSituation",
};

// 푸터 설정 - action 값은 페이지의 footerActions 키와 연결
export const ASSIGNEE_FOOTER_CONFIG = {
  [ASSIGNEE_FOOTER_KEY.CHECK_CHANGE]: {
    title: "변경 내용 확인",
    type: "primary",
    action: "checkChange",
  },
  [ASSIGNEE_FOOTER_KEY.START]: {
    title: "시작",
    type: "primary",
    action: "start",
  },
  [ASSIGNEE_FOOTER_KEY.DONE]: {
    title: "완료",
    type: "primary",
    action: "done",
  },
  [ASSIGNEE_FOOTER_KEY.PAST_SITUATION]: {
    title: "지난 상황에서 보기",
    type: "primary",
    action: "pastSituation",
  },
};
