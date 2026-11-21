// ID의 문자열/숫자 타입에 관계없이 선택한 항목을 조회한다.

// 사용자가 선택한 요청 대상
export const getSelectedUser = (users, userId) =>
  users?.find((item) => String(item.id) === String(userId));

// 사용자가 선택한 상황
export const getSelectedSituation = (situations, situationId) =>
  situations?.find((item) => String(item.id) === String(situationId));

// 선택된 상황을 화면 표시용 문자열로 가공
export const getSelectedSituationText = (situation, situationId) => {
  const selectedSituation = getSelectedSituation(situation, situationId);
  return selectedSituation?.title || "선택"; // 없으면 "선택" 출력
};

// 선택된 요청 대상을 화면 표시용 문자열로 가공
export const getSelectedUserText = (user, userId) => {
  const selectedUser = getSelectedUser(user, userId);
  return selectedUser?.userName || "한 명 선택"; // 없으면 "한 명 선택" 출력
};

// 사용자가 선택한 요청 대상의 이름과 역할(보호자 여부)을 반환
export const getSelectedUserInfo = (users, userId) => {
  const selectedUser = getSelectedUser(users, userId);
  return {
    userName: selectedUser?.userName ?? "",
    userPart: selectedUser?.isGuardian ? "보호자" : "나의 사람",
  };
};

// 입력된 날짜/시간 객체를 화면 표시용 문자열(YY/MM/DD HH:mm)로 가공
export const getDateTimeText = (dateTimeObj) => {
  // 없으면 "선택" 출력
  if (!dateTimeObj) return "선택";
  const { year, month, day, hour, minute } = dateTimeObj;

  // 월, 일, 시, 분이 한 자리일 때 앞에 '0'을 붙여줌 (예: "1" -> "01")
  const pad = (value) => String(value).padStart(2, "0");

  if (!year || !month || !day || !hour || !minute) return "선택";

  // year가 4자리 숫자라면 뒤 2자리만 잘라내고, 아니면 원래 값 사용
  const formattedYear =
    String(year).length === 4 ? String(year).slice(-2) : year;

  const datePart = `${formattedYear}/${pad(month)}/${pad(day)}`;
  const timePart = `${pad(hour)}:${pad(minute)}`;
  return `${datePart} ${timePart}`;
};

// 입력된 응답 기한 객체를 화면 표시용 문자열 (N일 N시간 N분)으로 가공
export const getDueDateText = (dueDate, isFixed = false) => {
  // 응답 기한이 고정된 경우 "시작 시간까지" 출력
  // 1. 다시 부탁하기에서 시작까지 1시간 미만이라 응답 기한에 null 값이 저장되며 "시작 시간까지"로 표시 (이땐 응답 기한 값 임의 조정 불가)
  // 2. 요청 작성/다시 부탁하기 - 시작까지 남은 시간이 24시간 미만이면 응답 기한에 null 값이 저장되며 "시작 시간까지"로 표시
  if (isFixed || dueDate === null) return "시작 시간까지";

  // 없으면 "선택" 출력
  if (!dueDate) return "선택";
  const days = parseInt(dueDate.days, 10) || 0;
  const hours = parseInt(dueDate.hours, 10) || 0;
  const minutes = parseInt(dueDate.minutes, 10) || 0;

  // 정확히 1일 0시간 0분일 때만 "24시간 (기본)" 출력
  if (days === 1 && hours === 0 && minutes === 0) {
    return "24시간 (기본)";
  }

  // 그 외의 경우 조합해서 출력 (예: "2일 3시간", "1일 30분")
  let text = "";
  if (days > 0) text += `${days}일`;
  if (hours > 0) text += ` ${hours}시간`;
  if (minutes > 0) text += ` ${minutes}분`;

  return text;
};
