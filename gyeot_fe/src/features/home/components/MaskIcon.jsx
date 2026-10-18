import styles from "@/features/home/components/MaskIcon.module.css";

// SVG 아이콘을 mask로 그려 color(currentColor)로 색을 바꿀 수 있게 하는 컴포넌트
// (svg를 컴포넌트로 import하는 라이브러리가 없어 mask 방식 사용)
function MaskIcon({ src, size = 24, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.maskIcon} ${className}`}
      style={{
        width: size,
        height: size,
        // 작은 svg는 data URL로 인라인되므로 따옴표로 감싸야 함
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
      }}
    />
  );
}

export default MaskIcon;
