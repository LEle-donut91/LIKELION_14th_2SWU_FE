import { useState } from "react";
import iconEyeOff from "@/shared/assets/icons/iconEyeOff.svg";
import styles from "./SignupForm.module.css"; // 회원가입 폼과 같은 스타일 사용

// 비밀번호 보일 때 눈 아이콘 (SignupForm과 동일)
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#868580" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * 이메일 로그인 폼 (A-01)
 * ※ 로그인 화면 시안이 없어 회원가입 폼과 같은 스타일로 구성 (시안 나오면 수정)
 * @param {Function} onSubmit      로그인 클릭 시 동작 ({ email, password } 전달)
 * @param {boolean}  isSubmitting  로그인 요청 중이면 버튼 비활성
 */
function LoginForm({ onSubmit, isSubmitting = false }) {
  const [form, setForm] = useState({ email: "", password: "" }); // 입력값
  const [isPasswordVisible, setPasswordVisible] = useState(false); // 비밀번호 보이기 여부

  // 입력 칸 공통 변경 처리 (name 속성으로 구분)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = form.email.trim() && form.password; // 둘 다 입력해야 로그인 버튼 활성화

  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 막기
    if (!isValid || isSubmitting) return;
    onSubmit({ email: form.email.trim(), password: form.password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>다시 만나서 반가워요</h2>
      <p className={styles.subtitle}>가입한 이메일과 비밀번호를 입력해주세요</p>

      <div className={styles.card}>
        <div className={styles.field}>
          <label htmlFor="loginEmail" className={styles.label}>이메일</label>
          <input
            id="loginEmail"
            name="email"
            type="email"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="loginPassword" className={styles.label}>비밀번호</label>
          <div className={styles.passwordBox}>
            <input
              id="loginPassword"
              name="password"
              type={isPasswordVisible ? "text" : "password"} // 눈 아이콘으로 보이기/숨기기
              className={styles.input}
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              autoComplete="current-password"
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
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={!isValid || isSubmitting}>
        로그인
      </button>
    </form>
  );
}

export default LoginForm;