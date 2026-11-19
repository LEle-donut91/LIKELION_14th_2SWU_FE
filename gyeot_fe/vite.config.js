import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    alias({
      entries: [{ find: "@", replacement: resolve(__dirname, "src") }],
    }),
  ],
  server: {
    proxy: {
      // 로컬 개발: /api 요청을 백엔드로 넘김 (로그인 유지 쿠키를 같은 출처로 주고받기 위해)
      // - 백엔드 경로에도 /api가 있으므로 접두사는 지우지 않음
      "/api": {
        target: "https://api.gyeot.shop",
        changeOrigin: true,
        cookieDomainRewrite: { "*": "" }, // 백엔드가 준 쿠키를 localhost에 저장되도록 도메인 제거
      },
    },
  },
});