import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
/**
 * 서버설정
 * DB 설정
 * 보안설정
 */
app.get("/", (c) => {
  return c.text("health check!");
});

/** router 설정 */
import hospitalRouter from "./router/hospital_router.js";
app.route("/api/hospital", hospitalRouter);
/** router 설정 END */

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
