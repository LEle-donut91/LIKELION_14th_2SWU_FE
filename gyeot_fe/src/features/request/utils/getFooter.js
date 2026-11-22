import { REQUEST_ACTION } from "@/features/request/constants/enumConstants";
import {
  FOOTER_ACTIONS,
  REQUESTER_FOOTER_CONFIG,
  REQUESTER_FOOTER_KEY,
  ASSIGNEE_FOOTER_CONFIG,
  ASSIGNEE_FOOTER_KEY,
} from "@/features/request/constants/footerConstants";

// API에서 허용한 버튼만 남긴다. 두 버튼 중 하나만 허용되면 단일 푸터로 표시한다.
const getAllowedFooter = (config, actions) => {
  if (!config) return null;
  if (config.size !== "small") {
    return actions.includes(FOOTER_ACTIONS[config.action]) ? config : null;
  }
  const buttons = ["left", "right"]
    .map((side) => ({
      title: config[`${side}Title`],
      type: config[`${side}Type`],
      action: config[`${side}Action`],
    }))
    .filter((button) => actions.includes(FOOTER_ACTIONS[button.action]));
  if (buttons.length === 2) return config;
  return buttons[0] ? { size: "large", ...buttons[0] } : null;
};

export const getRequesterFooter = (actions) => {
  let key = REQUESTER_FOOTER_KEY.EDIT;
  if (actions.includes(REQUEST_ACTION.WITHDRAW_PROPOSAL)) {
    key = REQUESTER_FOOTER_KEY.EDIT_WITHDRAW;
  } else if (actions.includes(REQUEST_ACTION.REASSIGN)) {
    key = REQUESTER_FOOTER_KEY.EDIT_ASK_AGAIN;
  } else if (actions.includes(REQUEST_ACTION.COMPLETE)) {
    key = REQUESTER_FOOTER_KEY.DONE;
  } else if (actions.includes(REQUEST_ACTION.DUPLICATE)) {
    key = REQUESTER_FOOTER_KEY.SAME_REQUEST;
  }
  return getAllowedFooter(REQUESTER_FOOTER_CONFIG[key], actions);
};

export const getAssigneeFooter = (actions, isEnded = false) => {
  const key = [
    ASSIGNEE_FOOTER_KEY.CHECK_CHANGE,
    ASSIGNEE_FOOTER_KEY.START,
    ASSIGNEE_FOOTER_KEY.DONE,
    ASSIGNEE_FOOTER_KEY.PAST_SITUATION,
  ].find((key) =>
    actions.includes(FOOTER_ACTIONS[ASSIGNEE_FOOTER_CONFIG[key].action]),
  );
  return ASSIGNEE_FOOTER_CONFIG[key] ?? (isEnded
    ? ASSIGNEE_FOOTER_CONFIG[ASSIGNEE_FOOTER_KEY.CONFIRM]
    : null);
};
