import { useState } from "react";
import iconEyeOff from "@/shared/assets/icons/iconEyeOff.svg";
import iconRadioOn from "@/shared/assets/icons/iconRadioOn.svg";
import iconRadioOff from "@/shared/assets/icons/iconRadioOff.svg";
import styles from "./SignupForm.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식
const LETTER_AND_NUMBER_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/; // 영문 + 숫자 포함
const MIN_PASSWORD_LENGTH = 8; // 비밀번호 최소 길이

// 비밀번호 보일 때 눈 아이콘 (피그마에 없어서 직접 그림)
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#868580" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// 비밀번호 조건 아래 작은 체크 아이콘
function CheckMark() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 5.2l2.2 2.2L8.5 2.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 이메일 회원가입 폼
 * @param {Function} onSubmit  가입하기 클릭 시 동작 (입력값 전달)
 */
function SignupForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", passwordConfirm: "" }); // 입력값
  const [isPasswordVisible, setPasswordVisible] = useState(false); // 비밀번호 보이기 여부
  const [isAgreed, setAgreed] = useState(false); // 개인정보 제공 동의 여부

  // 입력 칸 공통 변경 처리 (name 속성으로 구분)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const hasLetterAndNumber = LETTER_AND_NUMBER_REGEX.test(form.password); // 조건 1
  const hasMinLength = form.password.length >= MIN_PASSWORD_LENGTH; // 조건 2

  // 모든 조건을 만족해야 가입하기 버튼 활성화
  const isValid =
    form.name.trim() &&
    EMAIL_REGEX.test(form.email) &&
    hasLetterAndNumber &&
    hasMinLength &&
    form.password === form.passwordConfirm &&
    isAgreed;

  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 막기
    if (!isValid) return;
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>곁에 오신 걸 환영해요</h2>
      <p className={styles.subtitle}>가입에 필요한 정보를 입력해주세요</p>

      {/* 입력 카드 */}
      <div className={styles.card}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>이름*</label>
          <input id="name" name="name" className={styles.input} value={form.name} onChange={handleChange} placeholder="이름을 입력해주세요" />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>이메일*</label>
          <input id="email" name="email" type="email" className={styles.input} value={form.email} onChange={handleChange} placeholder="example@email.com" />
        </div>

        <hr className={styles.divider} />

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>비밀번호*</label>
          <div className={styles.passwordBox}>
            <input
              id="password"
              name="password"
              type={isPasswordVisible ? "text" : "password"} // 눈 아이콘으로 보이기/숨기기
              className={styles.input}
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setPasswordVisible((prev) => !prev)}
              aria-label={isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {isPasswordVisible ? <EyeIcon /> : <img src={iconEyeOff} alt="" width={18} height={18} />}
            </button>
          </div>

          {/* 비밀번호 조건 (만족하면 올리브색) */}
          <div className={styles.rules}>
            <span className={hasLetterAndNumber ? styles.ruleOk : styles.rule}>
              <CheckMark /> 영문·숫자 포함
            </span>
            <span className={hasMinLength ? styles.ruleOk : styles.rule}>
              <CheckMark /> {MIN_PASSWORD_LENGTH}자 이상
            </span>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="passwordConfirm" className={styles.label}>비밀번호 확인*</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            className={styles.input}
            value={form.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호를 한 번 더 입력해주세요"
          />
        </div>
      </div>

      {/* 개인정보 제공 동의 */}
      <button type="button" className={styles.agreeBox} onClick={() => setAgreed((prev) => !prev)} aria-pressed={isAgreed}>
        <img src={isAgreed ? iconRadioOn : iconRadioOff} alt="" width={18} height={18} />
        <span>
          <strong className={styles.required}>[필수]</strong> 개인정보 제공 동의
        </span>
      </button>

      <button type="submit" className={styles.submitBtn} disabled={!isValid}>
        가입하기
      </button>
    </form>
  );
}

export default SignupForm;