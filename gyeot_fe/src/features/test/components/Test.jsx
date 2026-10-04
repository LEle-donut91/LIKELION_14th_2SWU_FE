import styles from "./Test.module.css";

function Test() {
  return (
    <div>
      {/* 1. Font Family */}
      <p className={styles.fontMyungjo}>Kim jung chul Myungjo</p>
      <p className={styles.fontGothic}>Kim jung chul Gothic</p>

      <hr />

      {/* 2. Typography System */}
      <p className={styles.typoDisplayMedium}>
        함께, 곁에. / Be:side / 0123 / ~@!?-#&’” (Display / medium)
      </p>
      <p className={styles.typoDisplaySmall}>
        함께, 곁에. / Be:side / 0123 / ~@!?-#&’” (Display / small)
      </p>
      <p className={styles.typoTitleMedium}>
        함께, 곁에. / Be:side / 0123 / ~@!?-#&’” (Title / medium)
      </p>
      <p className={styles.typoBodyStrong}>
        함께, 곁에. / Be:side / 0123 / ~@!?-#&’” (Body / strong)
      </p>
      <p className={styles.typoBodyMedium}>
        함께, 곁에. / Be:side / 0123 / ~@!?-#&’” (Body / medium)
      </p>
      <p className={styles.typoBodySmall}>
        함께, 곁에. / Be:side / 0123 / ~@!?-#&’” (Body / small)
      </p>
      <p className={styles.typoCaptionMedium}>
        함께, 곁에. / Be:side / 0123 / ~@!?-#&’” (Caption / medium)
      </p>

      <hr />

      {/* 3. Color System */}
      <div>
        {/* Base */}
        <div className={styles.colorBase000Box} />
        <div className={styles.colorBase999Box} />

        {/* Gray */}
        <div className={styles.colorGray100Box} />
        <div className={styles.colorGray200Box} />
        <div className={styles.colorGray300Box} />
        <div className={styles.colorGray400Box} />
        <div className={styles.colorGray500Box} />
        <div className={styles.colorGray600Box} />
        <div className={styles.colorGray700Box} />
        <div className={styles.colorGray800Box} />
        <div className={styles.colorGray900Box} />

        {/* Olive */}
        <div className={styles.colorOlive100Box} />
        <div className={styles.colorOlive200Box} />
        <div className={styles.colorOlive300Box} />
        <div className={styles.colorOlive400Box} />
        <div className={styles.colorOlive500Box} />
        <div className={styles.colorOlive600Box} />
        <div className={styles.colorOlive700Box} />
        <div className={styles.colorOlive800Box} />
        <div className={styles.colorOlive900Box} />

        {/* Beige */}
        <div className={styles.colorBeige100Box} />
        <div className={styles.colorBeige200Box} />
        <div className={styles.colorBeige300Box} />
        <div className={styles.colorBeige500Box} />
        <div className={styles.colorBeige600Box} />
        <div className={styles.colorBeige800Box} />

        {/* Red */}
        <div className={styles.colorRed500Box} />
        <div className={styles.colorRed700Box} />
        <div className={styles.colorRed900Box} />

        {/* Opacity */}
        <div className={styles.colorOpacity100Box} />
        <div className={styles.colorOpacity200Box} />
        <div className={styles.colorOpacity400Box} />
      </div>
    </div>
  );
}

export default Test;
