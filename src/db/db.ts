import { createMiddleware } from "hono/factory";
import { Pool } from "@neondatabase/serverless";
import { HonoEnv } from "../types/types.js";

export const dbMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  // 1. 환경변수에서 URL 가져오기
  const connectionString = c.env.DATABASE_URL;

  // 2. Pool 생성
  const pool = new Pool({ connectionString });

  // 3. 컨텍스트(c)에 db 인스턴스 주입
  c.set("db", pool);

  try {
    await next();
  } finally {
    // 4. 요청 처리가 끝나면 연결 종료 (Serverless 환경 리소스 관리)
    // Neon Serverless HTTP 모드에서는 필수적이지 않으나,
    // WebSocket 모드나 일반 Pool 사용 시 명시적 종료가 권장될 수 있습니다.
    c.executionCtx.waitUntil(pool.end());
  }
});
